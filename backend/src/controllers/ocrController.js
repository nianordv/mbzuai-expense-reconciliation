const pool = require("../db/pool");

const extractReceiptData = async (req, res) => {
  try {
    const { receipt_file_id } = req.body;

    if (!receipt_file_id) {
      return res
        .status(400)
        .json({ success: false, message: "receipt_file_id is required" });
    }

    // confirm the file actually exists (real version will read it for the vision model)
    const fileResult = await pool.query(
      `SELECT * FROM receipt_files WHERE receipt_file_id = $1`,
      [receipt_file_id]
    );

    if (fileResult.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Receipt file not found" });
    }

    // ---- MOCK OCR OUTPUT ----
    // Hardcoded for now. Later this block is replaced by a real vision-model call.
    const extracted = {
      vendorName: "Debbitone - Global Village Africa Pavilion",
      purchaseDate: "2026-02-07",
      invoiceNumber: "0000001",
      amountAed: "60.00",
      currency: "AED",
      cardLastFour: "4924",
      isHandwritten: true,
      confidence: "medium",
    };
    // -------------------------

    res.status(200).json({ success: true, data: extracted });
  } catch (error) {
    console.error(error.message);
    res
      .status(500)
      .json({ success: false, message: "Failed to extract receipt data" });
  }
};

module.exports = { extractReceiptData };
