import express from "express";
import generateContent from "../ai/ai.res.js";
const router = express.Router();
router.post("/get-review", async (req, res) => {
    const prompt = await req.body.prompt;
    const response = await generateContent(prompt);
    res.send(response);
});
export default router;
