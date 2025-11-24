import React, { useEffect, useState, useMemo } from "react"; // Added useMemo
import AdminLayout from "../../layout/AdminLayout";
import DataTable from "../../components/Table";
import Modal from "../../components/Modal";
import Loader from "../../components/Loader/Loader";
import { FaFileContract, FaPlus, FaMoneyBillWave, FaTrashAlt, FaCalendarAlt, FaFilter } from 'react-icons/fa'; // Added FaCalendarAlt, FaFilter

// Mock API functions - replace with your actual imports
import {
  getAgreements,
  createAgreement,
  updateAgreement,
  deleteAgreement
} from "../../api/agreementApi";

import AgreementAddForm from "./AgreementAddForm";
import AgreementEditForm from "./AgreementEditForm";
import "./Agreements.css";

// Helper function to format currency
const formatCurrency = (amount) => {
  return `₹${Number(amount).toLocaleString('en-IN')}`;
};

// Available Document Templates for Filter
const DOCUMENT_TEMPLATES = [
    { value: "professional_invoice", label: "INVOICE" },
    { value: "paddy_receipt", label: "PADDY RECEIPT" },
    { value: "lease", label: "LEASE AGREEMENT" },
    { value: "ceo_letter", label: "LETTER" },
    { value: "rtgs_template", label: "RTGS" },
];

export default function Agreements() {
  const [agreements, setAgreements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalType, setModalType] = useState(null); // 'add' | 'edit' | null
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState({
    from: "",
    to: "",
    type: "",
  });

  // --- DATA FETCHING ---
  const fetchData = async () => {
    try {
      setLoading(true);
      // --- DELETING DUMMY DATA AND USING ACTUAL MOCK API CALL ---
      const res = await getAgreements(); 
      setAgreements(Array.isArray(res) ? res : []);
    } catch (err) {
      console.error("Failed to fetch agreements:", err);
      setAgreements([]); // Set to empty array on failure
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);
  
  // --- FILTERING LOGIC ---
  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const filteredAgreements = useMemo(() => {
    let results = agreements;

    const filterTypeLower = filter.type.toLowerCase();

    // Helper to get raw template name from remarks for filtering
    const getTemplateName = (remarks) => {
        try {
            return JSON.parse(remarks).template || "doc";
        } catch(e) { return "doc"; }
    };

    if (filter.from) {
      results = results.filter(r => new Date(r.startDate) >= new Date(filter.from));
    }
    if (filter.to) {
      // Ensure inclusive filtering up to the end of the 'to' day
      const endDate = new Date(filter.to);
      endDate.setDate(endDate.getDate() + 1);
      results = results.filter(r => new Date(r.startDate) < endDate);
    }
    if (filter.type) {
      results = results.filter(r => getTemplateName(r.remarks).toLowerCase() === filterTypeLower);
    }

    return results;
  }, [agreements, filter]);


  // Helper to extract readable type from metadata
  const getDocType = (remarks) => {
    try {
        const meta = JSON.parse(remarks);
        const template = meta.template;
        
        const typeMapping = DOCUMENT_TEMPLATES.find(d => d.value === template);
        const type = typeMapping ? typeMapping.label : template?.toUpperCase() || "DOC";
        
        // Assign class based on type for visual distinction
        const typeClass = type.toLowerCase().replace(/ /g, '-');
        return <span className={`document-type document-type--${typeClass}`}>{type}</span>;
    } catch(e) { 
        return <span className="document-type document-type--default">DOC</span>; 
    }
  };

  const cols = [
    { header: "ID", accessor: "id" },
    { header: "Customer ID", accessor: "customerId" },
    { header: "Date", accessor: "startDate" },
    { 
      header: "Type", 
      accessor: "remarks",
      render: (row) => getDocType(row.remarks)
    },
    { 
      header: "Amount", 
      accessor: "amount",
      render: (row) => <span className="amount-cell">{formatCurrency(row.amount)}</span>
    },
    {
      header: "Actions",
      key: "actions",
      render: (row) => (
        <div className="action-buttons">
          <button 
            className="btn-icon btn-edit" 
            title="Edit Document"
            onClick={() => { setSelected(row); setModalType("edit"); }}>
            <span role="img" aria-label="edit">✎</span>
          </button>
          <button 
            className="btn-icon btn-delete" 
            title="Delete Document"
            onClick={() => handleDelete(row)}>
            <span role="img" aria-label="delete">🗑</span>
          </button>
        </div>
      ),
    },
  ];

  const handleAdd = async (data) => {
    try {
      await createAgreement(data); 
      setModalType(null);
      fetchData();
    } catch (error) {
      console.error("Create failed", error);
    }
  };

  const handleEdit = async (data) => {
    try {
      await updateAgreement(selected.id, data); 
      setModalType(null);
      setSelected(null);
      fetchData();
    } catch (error) {
      console.error("Update failed", error);
    }
  };

  const handleDelete = async (row) => {
    console.warn(`Simulating delete confirmation for document #${row.id}. In a real app, use a custom modal.`);
    
    try {
      await deleteAgreement(row.id);
      fetchData();
    } catch (error) {
      console.error("Delete failed", error);
    }
  };

  return (
    <AdminLayout title="Agreements & Documents">
      <div className="page-container agreements-page">
        
        {/* --- PROFESSIONAL CARD HEADER (Products Page Style) --- */}
        <div className="agreements-page__header card-shadow">
          {/* Title/Subtitle Left */}
          <div className="header-info">
            <h1 className="header-title"><FaFileContract /> Document Manager</h1>
            <p className="header-subtitle">Generate Invoices, Paddy Receipts, Agreements & Letters, and manage your company data in one place.</p>
          </div>

          {/* Action Button Right */}
          <div className="header-actions">
            <button className="btn-success-green" onClick={() => setModalType("add")}>
              <FaPlus /> Create New Document
            </button>
          </div>
        </div>

        {/* --- FILTER PANEL (NEW) --- */}
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
            <label htmlFor="filter-type">Document Type</label>
            <div className="input-with-icon">
                <FaFileContract className="filter-icon" />
                <select
                    id="filter-type"
                    name="type"
                    className="input-field"
                    value={filter.type}
                    onChange={handleFilterChange}
                >
                    <option value="">All Documents</option>
                    {DOCUMENT_TEMPLATES.map(template => (
                        <option key={template.value} value={template.value}>{template.label}</option>
                    ))}
                </select>
            </div>
          </div>
          
          <button className="btn-primary filter-button-action" onClick={() => { /* Filtering is automatic */ }}>
            <FaFilter /> Apply Filters
          </button>
        </div>

        {/* --- TABLE CONTENT (Wrapped in Card) --- */}
        <div className="agreements-content card-shadow">
          <h3 className="content-title">
            <FaMoneyBillWave /> Active Documents ({filteredAgreements.length} records)
          </h3>
          {loading ? <Loader /> : <DataTable columns={cols} data={filteredAgreements} />}
        </div>

        {/* Modals remain the same */}
        <Modal
          open={modalType === "add"}
          title="Document Generator"
          onClose={() => setModalType(null)}
          width="95vw" 
          style={{maxWidth: '1400px'}}
        >
          <AgreementAddForm onSubmit={handleAdd} onCancel={() => setModalType(null)} />
        </Modal>

        <Modal
          open={modalType === "edit"}
          title="Edit Document"
          onClose={() => setModalType(null)}
          width="95vw"
          style={{maxWidth: '1400px'}}
        >
          <AgreementEditForm
            initialData={selected}
            onSubmit={handleEdit}
            onCancel={() => setModalType(null)}
          />
        </Modal>
      </div>
    </AdminLayout>
  );
}
