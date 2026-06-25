const express = require("express");
const router = express.Router();
const { extractReceiptData } = require("../controllers/ocrController");

// POST /api/ocr/extract
router.post("/extract", extractReceiptData);

module.exports = router;
