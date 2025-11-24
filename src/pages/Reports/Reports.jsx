import React, { useState, useMemo } from "react";
import AdminLayout from "../../layout/AdminLayout";
import DataTable from "../../components/Table";
import { FaFilter, FaCalendarAlt, FaChartBar, FaMoneyBillWave, FaArrowUp, FaArrowDown, FaMapMarkerAlt } from 'react-icons/fa';

// 1. IMPORT LEAFLET COMPONENTS
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
// 2. IMPORTANT: Import Leaflet CSS
import 'leaflet/dist/leaflet.css';

import "./Reports.css";

// Fix for default Leaflet icons not appearing in Webpack/Vite builds
import L from 'leaflet';
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

// --- UPDATED DUMMY DATA with Location Coordinates ---
const fakeReports = [
  { id: 1, type: "Sales", amount: 50000.00, date: "2024-01-05", lat: 34.0522, lng: -118.2437, location: "Los Angeles" },
  { id: 2, type: "Expenses", amount: 12000.50, date: "2024-01-06", lat: 40.7128, lng: -74.0060, location: "New York" },
  { id: 3, type: "Sales", amount: 75200.00, date: "2024-01-10", lat: 34.0522, lng: -118.2437, location: "Los Angeles" },
  { id: 4, type: "Payments", amount: 2500.00, date: "2024-01-12", lat: 51.5074, lng: 0.1278, location: "London" },
  { id: 5, type: "Expenses", amount: 5500.75, date: "2024-01-15", lat: 40.7128, lng: -74.0060, location: "New York" },
];

// Helper to format currency
const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

// --- NEW MAP COMPONENT ---
const MapComponent = ({ reportData }) => {
  // Use a sensible default center if data is empty, e.g., center of US
  const defaultPosition = [39.8283, -98.5795]; 
  
  // Calculate aggregated data for markers (grouping reports by location)
  const aggregatedData = reportData.reduce((acc, report) => {
      const key = `${report.lat},${report.lng}`;
      if (!acc[key]) {
          acc[key] = {
              lat: report.lat,
              lng: report.lng,
              location: report.location,
              totalAmount: 0,
              reportsCount: 0,
          };
      }
      acc[key].totalAmount += report.amount;
      acc[key].reportsCount += 1;
      return acc;
  }, {});

  const markers = Object.values(aggregatedData);

  return (
    <div className="map-container">
        <MapContainer 
            center={markers.length > 0 ? [markers[0].lat, markers[0].lng] : defaultPosition} 
            zoom={markers.length > 0 ? 5 : 3} 
            scrollWheelZoom={false}
        >
            <TileLayer
                attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {markers.map((marker, index) => (
                <Marker key={index} position={[marker.lat, marker.lng]}>
                    <Popup>
                        <div className="map-popup">
                            <strong>{marker.location}</strong><br/>
                            Total Reports: {marker.reportsCount}<br/>
                            Total Amount: {formatCurrency(marker.totalAmount)}
                        </div>
                    </Popup>
                </Marker>
            ))}
        </MapContainer>
    </div>
  );
};

// --- REPORTS COMPONENT (REVISED) ---
export default function Reports() {
  const [filter, setFilter] = useState({
    from: "",
    to: "",
    type: "",
  });

  const handleFilterChange = (e) => {
    setFilter({ ...filter, [e.target.name]: e.target.value });
  };

  const filteredReports = useMemo(() => {
    let results = fakeReports;

    if (filter.from) {
      results = results.filter(r => new Date(r.date) >= new Date(filter.from));
    }
    if (filter.to) {
      results = results.filter(r => new Date(r.date) <= new Date(filter.to));
    }
    if (filter.type) {
      results = results.filter(r => r.type.toLowerCase() === filter.type.toLowerCase());
    }

    return results;
  }, [filter]);

  const columns = [
    { 
      header: "Type", 
      accessor: "type",
      render: (row) => (
        <span className={`report-type report-type--${row.type.toLowerCase()}`}>
          {row.type === 'Sales' && <FaArrowUp />}
          {row.type === 'Expenses' && <FaArrowDown />}
          {row.type === 'Payments' && <FaMoneyBillWave />}
          {row.type}
        </span>
      )
    },
    { 
      header: "Amount", 
      accessor: "amount",
      render: (row) => (
        <span className="report-amount">
          {formatCurrency(row.amount)}
        </span>
      )
    },
    { header: "Date", accessor: "date" },
    { header: "Location", accessor: "location" }, // Added location to table
  ];

  return (
    <AdminLayout title="Reports">
      <div className="reports-page">
        <div className="reports-header">
          <h2 className="reports-title"><FaChartBar /> Report Generator</h2>
        </div>

        <div className="filter-panel card-shadow">
          {/* ... filter groups remain the same ... */}
          {/* (Filter groups removed for brevity, they are the same as before) */}
          <div className="filter-group">
            <FaCalendarAlt className="filter-icon" />
            <label htmlFor="filter-from">From Date</label>
            <input id="filter-from" type="date" name="from" value={filter.from} onChange={handleFilterChange} />
          </div>
          <div className="filter-group">
            <FaCalendarAlt className="filter-icon" />
            <label htmlFor="filter-to">To Date</label>
            <input id="filter-to" type="date" name="to" value={filter.to} onChange={handleFilterChange} />
          </div>
          <div className="filter-group">
            <FaChartBar className="filter-icon" />
            <label htmlFor="filter-type">Report Type</label>
            <select id="filter-type" name="type" value={filter.type} onChange={handleFilterChange}>
              <option value="">All Types</option>
              <option value="Sales">Sales</option>
              <option value="Expenses">Expenses</option>
              <option value="Payments">Payments</option>
            </select>
          </div>
          <button className="filter-button" onClick={() => console.log('Apply Filter Logic')}>
            <FaFilter /> Apply Filter
          </button>
        </div>
        
        {/* --- 3. ADD MAP COMPONENT --- */}
        <div className="reports-map card-shadow">
            <h3><FaMapMarkerAlt /> Geographic Report Distribution</h3>
            <MapComponent reportData={filteredReports} />
        </div>

        <div className="reports-data card-shadow">
          <h3>Generated Report Data ({filteredReports.length} items)</h3>
          <DataTable columns={columns} data={filteredReports} />
        </div>
        
      </div>
    </AdminLayout>
  );
}
