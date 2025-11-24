import React, { useState } from "react";
import AdminLayout from "../../layout/AdminLayout";
import { FaBuilding, FaMapMarkerAlt, FaPhone, FaMoneyBillWave, FaSave, FaUserCog } from 'react-icons/fa';
import "./Settings.css";

// Helper function to simulate saving data (replace with actual API call)
const saveSettings = (profile) => {
  console.log("Saving profile:", profile);
  // In a real application, you'd make an API call here.
  return new Promise(resolve => setTimeout(resolve, 1000));
};

export default function Settings() {
  const [profile, setProfile] = useState({
    companyName: "Acme Corp Solutions",
    gst: "27AABCD1234F1Z1",
    address: "123 Technology Park, Silicon Valley, CA 94002",
    phone: "+1 (555) 123-4567",
  });
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const change = (key) => (e) => {
    setProfile({ ...profile, [key]: e.target.value });
    setMessage(null); // Clear message on change
  }

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);
    try {
      await saveSettings(profile);
      setMessage({ type: 'success', text: 'Settings saved successfully!' });
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to save settings. Please try again.' });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AdminLayout title="Settings">
      <div className="settings-page">
        <div className="settings-header">
          <h2 className="settings-title"><FaUserCog /> System Settings</h2>
          <p className="settings-subtitle">Manage your company's core profile information and regulatory details.</p>
        </div>

        <div className="settings-content card-shadow">
          <h3 className="section-title"><FaBuilding /> Company Profile</h3>

          <div className="form-grid">
            
            <div className="form-group">
              <label htmlFor="companyName">Company Name</label>
              <div className="input-with-icon">
                <FaBuilding className="input-icon" />
                <input 
                  id="companyName"
                  value={profile.companyName} 
                  onChange={change("companyName")} 
                  placeholder="Enter company legal name"
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="gst">GST/Tax ID Number</label>
              <div className="input-with-icon">
                <FaMoneyBillWave className="input-icon" />
                <input 
                  id="gst"
                  value={profile.gst} 
                  onChange={change("gst")} 
                  placeholder="e.g., 27AABCD1234F1Z1"
                />
              </div>
            </div>
            
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <div className="input-with-icon">
                <FaPhone className="input-icon" />
                <input 
                  id="phone"
                  type="tel"
                  value={profile.phone} 
                  onChange={change("phone")} 
                  placeholder="e.g., +1 (555) 123-4567"
                />
              </div>
            </div>
            
            {/* Full-width Address field */}
            <div className="form-group form-group--full-width">
              <label htmlFor="address">Address</label>
              <div className="input-with-icon">
                {/* Adjust icon position for multiline textarea */}
                <FaMapMarkerAlt className="input-icon" style={{ top: '10px' }} /> 
                <textarea 
                  id="address"
                  value={profile.address} 
                  onChange={change("address")} 
                  rows={3}
                  placeholder="Street address, City, Postal Code"
                ></textarea>
              </div>
            </div>

          </div>
          
          {message && (
            <div className={`save-message save-message--${message.type}`}>
              {message.text}
            </div>
          )}

          <button 
            className="save-button" 
            onClick={handleSave} 
            disabled={isSaving}
          >
            {isSaving ? (
              <>
                <FaSave className="spinner" /> Saving...
              </>
            ) : (
              <>
                <FaSave /> Save Settings
              </>
            )}
          </button>
        </div>
      </div>
    </AdminLayout>
  );
}
