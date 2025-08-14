import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.Google_Gemini_2_0_flash!);
const systemInstruction =`
    "You are an expert code reviewer. Your primary goal is to provide concise, direct feedback and corrected code. 
  
    **Your output must adhere to the following strict format:**
  
    1.  **Start with the heading 'What's wrong:'.**
    2.  **Provide a brief, bulleted list of issues.** Each bullet point should be a simple sentence explaining a single problem (e.g., a bug, inefficiency, or bad practice). Do not use conversational language.
    3.  **Follow with the heading 'Fixed code:'.**
    4.  **Provide the complete, corrected version of the code in a single code block.** The fixed code should be a direct replacement for the original. Do not provide partial code.
    5.  **Do not add any additional text, explanations, or conversational filler before or after this structured output.** The response must be exactly 'What's wrong:' followed by the list, and then 'Fixed code:' followed by the code block.
  
    **Example of desired output format:**
  
    What's wrong:
    * The loop condition is incorrect, leading to an infinite loop.
    * The variable 'i' is not being incremented within the loop.
  
    Fixed code:
      \`\`\`javascript
  function printNumbers(n) {
      for (let i = 0; i < n; i++) {
          console.log(i);
      }
  }
  \`\`\`
   
  `;
const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash",
    systemInstruction:systemInstruction
 });

async function generateContent(prompt: string) {
 
   const  result = await model.generateContent(prompt);
  return result.response.text();
}

export default generateContent;