import React, { useState } from "react";
import { FaDollarSign, FaTag, FaCalendarAlt, FaInfoCircle } from 'react-icons/fa'; // Added icons

export default function ExpenseAddForm({ onSubmit, onCancel, categories }) {
  const [form, setForm] = useState({
    title: "",
    amount: "",
    category: "",
    date: "",
    note: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = (e) => {
    e.preventDefault();
    // Basic validation check
    if (!form.title || !form.amount || !form.category || !form.date) {
        alert("Please fill in all required fields (Title, Amount, Category, Date).");
        return;
    }
    onSubmit(form);
  };
  
  // Custom button styling for this modal (using primary/secondary from the theme)
  const FormActions = () => (
    <div className="form-actions">
      <button type="button" className="btn-secondary" onClick={onCancel}>
        Cancel
      </button>

      <button type="submit" className="btn-primary">
        Save Expense
      </button>
    </div>
  );

  return (
    <form className="control-form form-padding-cleanup" onSubmit={submit}>
      
      {/* 1. Title */}
      <div className="form-group">
        <label htmlFor="title">Expense Title</label>
        <div className="input-with-icon">
            <FaInfoCircle className="input-icon" />
            <input
              id="title"
              type="text"
              name="title"
              className="input-field"
              placeholder="e.g. Diesel Purchase"
              value={form.title}
              onChange={handleChange}
              required
            />
        </div>
      </div>

      <div className="form-row">
        {/* 2. Amount */}
        <div className="form-group">
          <label htmlFor="amount">Amount (₹)</label>
          <div className="input-with-icon">
            <FaDollarSign className="input-icon" />
            <input
              id="amount"
              type="number"
              name="amount"
              className="input-field"
              placeholder="e.g. 1200"
              value={form.amount}
              onChange={handleChange}
              required
            />
          </div>
        </div>

        {/* 3. Category */}
        <div className="form-group">
          <label htmlFor="category">Category</label>
          <div className="input-with-icon">
            <FaTag className="input-icon" />
            <select
              id="category"
              name="category"
              className="input-field"
              value={form.category}
              onChange={handleChange}
              required
            >
              <option value="">Select category</option>
              {categories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 4. Date */}
      <div className="form-group">
        <label htmlFor="date">Date of Expense</label>
        <div className="input-with-icon">
            <FaCalendarAlt className="input-icon" />
            <input
              id="date"
              type="date"
              name="date"
              className="input-field"
              value={form.date}
              onChange={handleChange}
              required
            />
        </div>
      </div>

      {/* 5. Note */}
      <div className="form-group">
        <label htmlFor="note">Note / Description (Optional)</label>
        <textarea
          id="note"
          name="note"
          className="input-field"
          placeholder="Add additional details or reference number..."
          value={form.note}
          onChange={handleChange}
        />
      </div>

      {/* 6. Actions */}
      <FormActions />
    </form>
  );
}
