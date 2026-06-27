const fs = require("fs");
const OpenAI = require("openai");

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENROUTER_API_KEY,
});

// the exact shape we want back — described to the model in the prompt
const EXTRACTION_PROMPT = `You are a receipt and invoice data extractor.
Extract the following fields from the image and return ONLY a JSON object,
no markdown, no explanation, in exactly this shape:
{
  "vendorName": "the actual merchant/shop name, not the payment processor",
  "purchaseDate": "YYYY-MM-DD",
  "invoiceNumber": "invoice or receipt number, or empty string if none",
  "amountAed": "the total amount as a string, numbers only e.g. 60.00",
  "currency": "the currency code, e.g. AED",
  "cardLastFour": "last 4 digits of the card if shown, else empty string",
  "isHandwritten": true or false,
  "confidence": "high, medium, or low"
}
If a field is missing or unreadable, use an empty string (or false for isHandwritten).`;

const extractReceiptData = async (filePath) => {
  // 1. read the image and base64-encode it
  const imageBuffer = fs.readFileSync(filePath);
  const base64Image = imageBuffer.toString("base64");
  const mimeType = filePath.endsWith(".png") ? "image/png" : "image/jpeg";

  // 2. send image + prompt to the vision model
  const response = await client.chat.completions.create({
    model: "nvidia/nemotron-3-nano-omni-30b-a3b-reasoning:free", //regular llm
    messages: [
      {
        role: "user",
        content: [
          { type: "text", text: EXTRACTION_PROMPT },
          {
            type: "image_url",
            image_url: { url: `data:${mimeType};base64,${base64Image}` },
          },
        ],
      },
    ],
  });

  // 3. parse the model's JSON reply
  const raw = response.choices[0].message.content;
  console.log("MODEL RAW RESPONSE:", raw);
  const cleaned = raw.replace(/```json|```/g, "").trim(); // strip code fences if present

  try {
    return JSON.parse(cleaned);
  } catch (err) {
    console.error("OCR error:", err.message);
    console.error("Full error:", err.response?.data || err);
    return res
      .status(500)
      .json({ success: false, message: "Failed to extract receipt data" });
  }
};

module.exports = { extractReceiptData };
