import { Router } from "express";
import generate from "../lance.js";

const router = Router();

router.post("/generate", async (req, res) => {
  const { symptom, prompt } = req.body;
  try {
    if (!symptom) {
      return res.status(400).json({ error: "symptom is required" });
    }
    const response = await generate(symptom, prompt);
    res.json({ reply: response });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while generating content." });
  }
});

export default router;