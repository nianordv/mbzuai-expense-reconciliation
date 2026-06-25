import { useState } from "react";
import apiClient from "../api/client";

export default function SubmissionForm({ extractedData, receiptFileId }) {
  // form state — pre-filled from the OCR data, but fully editable
  const [form, setForm] = useState({
    vendorName: extractedData?.vendorName || "",
    purchaseDate: extractedData?.purchaseDate || "",
    invoiceNumber: extractedData?.invoiceNumber || "",
    amountAed: extractedData?.amountAed || "",
    currency: extractedData?.currency || "AED",
    cardLastFour: extractedData?.cardLastFour || "",
    category: "",
    department: "Residential Life",
    notes: "",
  });

  const [status, setStatus] = useState("");

  // one handler updates whichever field changed
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      setStatus("Submitting...");
      const res = await apiClient.post("/transactions", {
        user_id: 1, // hardcoded for now — real auth comes later
        cardholder_id: 1, // hardcoded for now
        vendor_name: form.vendorName,
        purchase_date: form.purchaseDate,
        invoice_number: form.invoiceNumber,
        category: form.category,
        department: form.department,
        amount_aed: form.amountAed,
        original_currency: form.currency,
        payment_method: "RLA prepaid card",
        notes: form.notes,
      });
      setStatus(
        `Transaction created (ID: ${res.data.transaction.transaction_id})`
      );
    } catch (err) {
      setStatus(
        "Submit failed: " + (err.response?.data?.message || err.message)
      );
    }
  };

  return (
    <div>
      <h2>Review & Submit</h2>

      <label>Vendor</label>
      <input
        name="vendorName"
        value={form.vendorName}
        onChange={handleChange}
      />

      <label>Purchase Date</label>
      <input
        name="purchaseDate"
        type="date"
        value={form.purchaseDate}
        onChange={handleChange}
      />

      <label>Invoice Number</label>
      <input
        name="invoiceNumber"
        value={form.invoiceNumber}
        onChange={handleChange}
      />

      <label>Amount (AED)</label>
      <input name="amountAed" value={form.amountAed} onChange={handleChange} />

      <label>Currency</label>
      <input name="currency" value={form.currency} onChange={handleChange} />

      <label>Card Last Four</label>
      <input
        name="cardLastFour"
        value={form.cardLastFour}
        onChange={handleChange}
      />

      <label>Category</label>
      <input name="category" value={form.category} onChange={handleChange} />

      <label>Department</label>
      <input
        name="department"
        value={form.department}
        onChange={handleChange}
      />

      <label>Notes</label>
      <textarea name="notes" value={form.notes} onChange={handleChange} />

      <button onClick={handleSubmit}>Submit</button>
      <p>{status}</p>
    </div>
  );
}
