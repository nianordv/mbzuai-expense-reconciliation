import { useState } from "react";
import apiClient from "../../api/client";
import ReceiptUpload from "../../components/ReceiptUpload";
import SubmissionForm from "../../components/SubmissionForm";

export default function RlaDashboard() {
  const [extractedData, setExtractedData] = useState(null);
  const [receiptFileId, setReceiptFileId] = useState(null);

  // after upload succeeds, run OCR on the first uploaded file
  const handleUploaded = async (uploadedFiles) => {
    const firstFileId = uploadedFiles[0].receipt_file_id;
    setReceiptFileId(firstFileId);
    const res = await apiClient.post("/ocr/extract", {
      receipt_file_id: firstFileId,
    });
    setExtractedData(res.data.data);
  };

  return (
    <div>
      <h1>RLA Dashboard</h1>
      <ReceiptUpload onUploaded={handleUploaded} />
      {extractedData && (
        <SubmissionForm
          extractedData={extractedData}
          receiptFileId={receiptFileId}
        />
      )}
    </div>
  );
}
