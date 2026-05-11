import 'dotenv/config';
import OpenAI from 'openai';
import {Router} from 'express';

const router = Router();

const client = new OpenAI({
  baseURL: 'https://api.featherless.ai/v1',
  apiKey: process.env.FEATHERLESS_API_KEY,
});

async function generate() {
    
    const response = await client.chat.completions.create({
    model: 'Qwen/Qwen3.5-4B',
    messages: [
        {
        role: 'user',
        content: [
            { type: 'text', text: 'HI FRIEND' }
        ],
        },
    ],
    });

    if (response){
        return response.choices[0].message.content;
    }
}


router.get("/generate", async (req, res) => {
    try {
        const response = await generate();
        res.send(response);
    } catch (error) {
        console.error(error);
        res.status(500).send("An error occurred while generating content.");
    }
})

export default router;