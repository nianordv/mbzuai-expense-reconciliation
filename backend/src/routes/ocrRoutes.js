const express = require("express");
const router = express.Router();
const { extractReceipt } = require("../controllers/ocrController");

// POST /api/ocr/extract
router.post("/extract", extractReceipt);

module.exports = router;
