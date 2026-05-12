import * as lancedb from "@lancedb/lancedb";
import physicianInfo from "./database/physician.json" with { type: "json" };
import { pipeline } from "@xenova/transformers";
import "dotenv/config";
import OpenAI from "openai";

let extractor = null;
let db = null;
let table = null;

const symptomCache = new Map();

async function connectDB() {
    if (!db) {
        db = await lancedb.connect("./database/");
    }
}

async function getEmbedding(text) {
    if (!extractor) {
        extractor = await pipeline(
            "feature-extraction",
            "Xenova/all-MiniLM-L6-v2"
        );
    }

    const output = await extractor(text, {
        pooling: "mean",
        normalize: true,
    });

    return Array.from(output.data);
}

async function storeInDatabase() {
    const tableNames = await db.tableNames();

    if (tableNames.includes("physicians")) {
        table = await db.openTable("physicians");
        return;
    }

    const PHYSICIANS = physicianInfo.map((p) => ({
        text: `
specialty: ${p.specialty}
keywords: ${p.keywords.join(", ")}
keywords: ${p.keywords.join(", ")}
bio: ${p.bio}
        `.trim(),
        original: p,
    }));

    const data = await Promise.all(
        PHYSICIANS.map(async (p) => ({
            ...p,
            vector: await getEmbedding(p.text),
        }))
    );

    table = await db.createTable("physicians", data);
}

async function query(symptom) {
    const normalizedSymptom = symptom.trim().toLowerCase();

    if (symptomCache.has(normalizedSymptom)) {
        return symptomCache.get(normalizedSymptom);
    }

    const queryVector = await getEmbedding(normalizedSymptom);

    const results = await table
        .search(queryVector)
        .limit(3)
        .toArray();

    const physicians = results.map((result) => result.original);

    const systemPrompt = `
You are a medical appointment routing assistant.

Your job is to explain briefly and accurately why the best physician from the provided list is appropriate for the user's concern using ONLY the provided physician information.

Rules:
- Be concise and short (1–3 sentences max).
- Only use information explicitly provided in the physician profiles.
- Do not invent qualifications, diagnoses, or treatments.
- If the concern is unrelated to healthcare, say you cannot help.
- Do not provide diagnosis or emergency advice.
- Compare the candidate physicians and choose the single best match.
- If a general practice physician is included, only choose them when the concern is general, routine, or no specialist is clearly better.
- Return ONLY valid JSON:
{"response": "..."}

Physician Information:
${JSON.stringify(physicians, null, 2)}
`;

    const payload = {
        prompt: systemPrompt,
        physicians,
    };

    symptomCache.set(normalizedSymptom, payload);

    return payload;
}

const client = new OpenAI({
    baseURL: "https://api.featherless.ai/v1",
    apiKey: process.env.FEATHERLESS_API_KEY,
});

async function generate(symptom, prompt = "") {
    await connectDB();
    await storeInDatabase();

    const normalizedSymptom = symptom.trim().toLowerCase();

    const { prompt: systemPrompt } = await query(normalizedSymptom);

    const messages = [
        {
            role: "system",
            content: systemPrompt,
        },
        {
            role: "user",
            content: `Patient concern: ${normalizedSymptom}`,
        },
    ];

    if (prompt.trim()) {
        messages.push({
            role: "user",
            content: prompt,
        });
    }

    const response = await client.chat.completions.create({
        model: "Qwen/Qwen2.5-3B-Instruct",
        response_format: { type: "json_object" },
        messages,
    });

    const output = response?.choices?.[0]?.message?.content;

    if (!output) {
        throw new Error("Empty model response");
    }

    const parsed = JSON.parse(output);

    if (!parsed.response || typeof parsed.response !== "string") {
        throw new Error("Invalid model response");
    }

    return parsed.response;
}

export default generate;