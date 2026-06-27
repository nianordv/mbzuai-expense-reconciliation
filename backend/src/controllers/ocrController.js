const pool = require("../db/pool");
const { extractReceiptData } = require("../services/ocrService");

const extractReceipt = async (req, res) => {
  try {
    const { receipt_file_id } = req.body;

    if (!receipt_file_id) {
      return res
        .status(400)
        .json({ success: false, message: "receipt_file_id is required" });
    }

    // look up the file's path on disk
    const fileResult = await pool.query(
      `SELECT file_path FROM receipt_files WHERE receipt_file_id = $1`,
      [receipt_file_id]
    );

    if (fileResult.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Receipt file not found" });
    }

    const filePath = fileResult.rows[0].file_path;

    // call the vision model via the service
    const data = await extractReceiptData(filePath);

    if (!data) {
      return res.status(502).json({
        success: false,
        message: "Extraction returned no usable data",
      });
    }

    return res.status(200).json({ success: true, data });
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ success: false, message: "Failed to extract receipt data" });
  }
};

module.exports = { extractReceipt };
