import React, { useEffect, useState, useMemo } from "react"; 
import AdminLayout from "../../layout/AdminLayout";
import DataTable from "../../components/Table";
import Modal from "../../components/Modal";
import Loader from "../../components/Loader/Loader";
import { FaMoneyBillWave, FaPlus, FaCalendarAlt, FaChartBar, FaFilter, FaRedoAlt, FaEdit, FaTrashAlt } from 'react-icons/fa'; 

// Mock API functions - replace with your actual imports
import { getExpenses, createExpense } from "../../api/expenseApi";
// Note: deleteExpense function should be imported and used for action buttons

import ExpenseAddForm from "./ExpenseAddForm";
import "./Expenses.css";

const formatCurrency = (amount) => {
  return `₹${Number(amount).toLocaleString('en-IN')}`;
};

// --- Categories for Filter and Form ---
const EXPENSE_CATEGORIES = [
  { value: 'Fuel', label: 'Fuel' },
  { value: 'Maintenance', label: 'Maintenance' },
  { value: 'Transport', label: 'Transport' },
  { value: 'Office', label: 'Office Supplies' },
  { value: 'Utility', label: 'Utilities' },
  { value: 'Other', label: 'Other' },
];

export default function Expenses() {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  
  // --- FILTER STATE ---
  const [filter, setFilter] = useState({
    from: "",
    to: "",
    category: "",
  });

  const load = async () => {
    try {
      setLoading(true);
      const res = await getExpenses(); // Actual API call
      setExpenses(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error(err);
      // Fallback dummy data if API fails to prevent empty screen
      const fallbackData = [
          { id: 1, title: 'Office Rent', amount: 35000, category: 'Fixed', date: '2025-11-01', note: 'Monthly rental payment.' },
          { id: 2, title: 'Server Subscription', amount: 4500, category: 'Tech', date: '2025-11-05', note: 'Annual cloud server fees.' },
          { id: 3, title: 'Diesel Purchase', amount: 8200, category: 'Fuel', date: '2025-11-10', note: 'Vehicle fuel for delivery.' },
      ];
      setExpenses(fallbackData);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);
  
  // --- FILTER LOGIC ---
  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };
  
  const filteredExpenses = useMemo(() => {
    let results = expenses;

    if (filter.from) {
      results = results.filter(r => new Date(r.date) >= new Date(filter.from));
    }
    if (filter.to) {
      const endDate = new Date(filter.to);
      endDate.setDate(endDate.getDate() + 1);
      results = results.filter(r => new Date(r.date) < endDate);
    }
    if (filter.category) {
      results = results.filter(r => r.category === filter.category);
    }

    return results;
  }, [expenses, filter]);


  const add = async (data) => {
    await createExpense(data);
    setAddOpen(false);
    load();
  };
  
  const handleDelete = (row) => {
      console.warn(`Simulating delete for expense ID: ${row.id}. Add deleteExpense API call here.`);
      // await deleteExpense(row.id); // Uncomment in real app
      load();
  };

  // --- DataTable Columns ---
  const columns = [
    { header: "TITLE", accessor: "title" },
    { 
      header: "AMOUNT", 
      accessor: "amount", 
      render: (row) => <span className="amount-cell">{formatCurrency(row.amount)}</span>
    },
    { header: "CATEGORY", accessor: "category" },
    { header: "DATE", accessor: "date" },
    {
      header: "ACTIONS",
      key: "actions",
      render: (row) => (
        <div className="action-buttons">
          <button className="btn-icon btn-edit" title="Edit"><FaEdit /></button>
          <button className="btn-icon btn-delete" title="Delete" onClick={() => handleDelete(row)}><FaTrashAlt /></button>
        </div>
      ),
    },
  ];

  return (
    <AdminLayout title="Expenses">
      <div className="page-container expenses-page">

        {/* --- 1. PROFESSIONAL CARD HEADER --- */}
        <div className="expenses-page__header card-shadow">
          {/* Title/Subtitle Left */}
          <div className="header-info">
            <h1 className="header-title"><FaMoneyBillWave /> Expense Records</h1>
            <p className="header-subtitle">Manage and track all operational expenses in one place.</p>
          </div>

          {/* Action Button Right */}
          <div className="header-actions">
            <button className="btn-success-green" onClick={() => setAddOpen(true)}>
              <FaPlus /> Add New Expense
            </button>
          </div>
        </div>

        {/* --- 2. FILTER PANEL --- */}
        <div className="filter-panel card-shadow">
          <div className="filter-group">
            <label htmlFor="filter-from">From Date</label>
            <div className="input-with-icon">
                <FaCalendarAlt className="filter-icon" />
                <input
                    id="filter-from"
                    type="date"
                    name="from"
                    className="input-field"
                    value={filter.from}
                    onChange={handleFilterChange}
                />
            </div>
          </div>

          <div className="filter-group">
            <label htmlFor="filter-to">To Date</label>
            <div className="input-with-icon">
                <FaCalendarAlt className="filter-icon" />
                <input
                    id="filter-to"
                    type="date"
                    name="to"
                    className="input-field"
                    value={filter.to}
                    onChange={handleFilterChange}
                />
            </div>
          </div>

          <div className="filter-group">
            <label htmlFor="filter-category">Category</label>
            <div className="input-with-icon">
                <FaChartBar className="filter-icon" />
                <select
                    id="filter-category"
                    name="category"
                    className="input-field"
                    value={filter.category}
                    onChange={handleFilterChange}
                >
                    <option value="">All Categories</option>
                    {EXPENSE_CATEGORIES.map(cat => (
                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                </select>
            </div>
          </div>
          
          <button className="btn-primary filter-button-action" onClick={load}>
            <FaRedoAlt /> Refresh Data
          </button>
        </div>


        {/* --- 3. TABLE CONTENT --- */}
        <div className="expenses-content card-shadow">
          <h3 className="content-title">
            <FaMoneyBillWave /> Active Expense Records ({filteredExpenses.length} records)
          </h3>
          {loading ? (
            <Loader size={50} />
          ) : (
            <DataTable columns={columns} data={filteredExpenses} />
          )}
        </div>

        {/* -------- ADD MODAL -------- */}
        <Modal open={addOpen} title="Add New Expense" onClose={() => setAddOpen(false)}>
          <ExpenseAddForm categories={EXPENSE_CATEGORIES} onSubmit={add} onCancel={() => setAddOpen(false)} />
        </Modal>
      </div>
    </AdminLayout>
  );
}
