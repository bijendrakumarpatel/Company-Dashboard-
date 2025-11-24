import React from "react";
import { FaUserFriends, FaBoxOpen, FaShoppingCart, FaDollarSign, FaArrowUp, FaArrowDown, FaStore } from 'react-icons/fa';

// --- Re-defining StatCard and StatIcon Components for this file ---
const StatIcon = ({ type, children }) => {
    const iconClass = {
        customers: 'stat-icon-blue',
        products: 'stat-icon-green',
        orders: 'stat-icon-amber',
        revenue: 'stat-icon-red',
    }[type] || 'stat-icon-blue';

    return (
        <div className={`stat-icon ${iconClass}`}>
            {children}
        </div>
    );
};

const StatCard = ({ label, value, hint, trend, icon, type }) => {
    const trendClass = trend > 0 ? 'trend-positive' : trend < 0 ? 'trend-negative' : 'trend-neutral';
    const trendIcon = trend > 0 ? <FaArrowUp /> : trend < 0 ? <FaArrowDown /> : null;
    const trendText = trend !== 0 ? `${Math.abs(trend)}%` : '0%';

    return (
        <div className="stat-card">
            <div className="stat-header">
                <span className="stat-label">{label}</span>
                <StatIcon type={type}>
                    {icon}
                </StatIcon>
            </div>
            <p className="stat-value">{value}</p>
            <div className="stat-footer">
                <span className="stat-hint">{hint}</span>
                <span className={`stat-trend ${trendClass}`}>
                    {trendIcon}
                    {trend !== 0 ? trendText : ''}
                </span>
            </div>
        </div>
    );
};
// -------------------------------------------------------------------


export default function CardsSection({ summary }) {
  const {
    totalCustomers = 0,
    totalProducts = 0,
    totalOrders = 0,
    totalRevenue = 0,
  } = summary || {
      // Fallback/Mock Data structure
      totalCustomers: 0,
      totalProducts: 0,
      totalOrders: 0,
      totalRevenue: 0,
  };

  return (
    <div className="stat-card-grid">
      <StatCard
        label="Customers"
        value={totalCustomers.toLocaleString()}
        hint="Total active customers"
        trend={totalCustomers > 0 ? 5 : 0} // Ensure trend is 0 if value is 0
        icon={<FaUserFriends />}
        type="customers"
      />
      <StatCard
        label="Products"
        value={totalProducts.toLocaleString()}
        hint="Total items in stock"
        trend={totalProducts > 0 ? -2 : 0} // Ensure trend is 0 if value is 0
        icon={<FaBoxOpen />}
        type="products"
      />
      <StatCard
        label="Orders"
        value={totalOrders.toLocaleString()}
        hint="All-time orders placed"
        trend={totalOrders > 0 ? 12 : 0} // Ensure trend is 0 if value is 0
        icon={<FaShoppingCart />}
        type="orders"
      />
      <StatCard
        label="Revenue"
        value={`₹${totalRevenue.toLocaleString('en-IN', { minimumFractionDigits: 0 })}`}
        hint="Total revenue (YTD)"
        trend={totalRevenue > 0 ? 8 : 0} // Ensure trend is 0 if value is 0
        icon={<FaDollarSign />}
        type="revenue"
      />
    </div>
  );
}
