import { useState } from "react";
import apiClient from "../../api/client";


export default function RlaDashboard() {
  const [formData, setFormData] = useState({
    purchase_date: "",
    vendor_name: "",
    invoice_number: "",
    category: "",
    department: "",
    amount_aed: "",
    original_currency: "AED",
    payment_method: "Prepaid card",
    notes: "",
  })

  const handleChange = (e) => {
    const {name, value} = e.target;
    setFormData({
      ...formData,
      [name]: value,
    }) 
  }

  const handleSubmit = async (e) => {
    // prevent reloading page when submitted
    e.preventDefault()

    try {
      const response = await apiClient.post(
        "/transactions",
        {
          user_id: 1,
          cardholder_id: 1,
          reconciliation_period_id: 1,
          ...formData
        }
      )
      console.log(response.data)
    } catch (error) {
      console.error(error)
    }
  }
  return (
    <div>
      <h1>RLA Dashboard</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label>Purchase Date</label>
          <input
            type="date"
            name="purchase_date"
            value={formData.purchase_date}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Vendor Name</label>
          <input
            type="text"
            name="vendor_name"
            value={formData.vendor_name}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Invoice Number</label>
          <input
            type="text"
            name="invoice_number"
            value={formData.invoice_number}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Category</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Department</label>
          <input
            type="text"
            name="department"
            value={formData.department}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Amount (AED)</label>
          <input
            type="number"
            name="amount_aed"
            value={formData.amount_aed}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Original Currency</label>
          <input
            type="text"
            name="original_currency"
            value={formData.original_currency}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Payment Method</label>
          <input
            type="text"
            name="payment_method"
            value={formData.payment_method}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Notes</label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
          />
        </div>

        <button type="submit">Submit Transaction</button>
      </form>
    </div>
  );
}