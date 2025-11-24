"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  FaArrowRight,
  FaLock,
  FaChartBar,
  FaUsers,
  FaCogs,
  FaCheck,
  FaGithub,
  FaLinkedin,
  FaTwitter,
} from "react-icons/fa"
import "./Home.css"

export default function Home({ onLoginClick }) {
  const navigate = useNavigate()
  const [email, setEmail] = useState("")

  const features = [
    {
      icon: <FaChartBar className="feature-icon" />,
      title: "Advanced Analytics",
      description: "Real-time insights and detailed reports on your business metrics",
    },
    {
      icon: <FaUsers className="feature-icon" />,
      title: "Customer Management",
      description: "Comprehensive customer database with transaction history",
    },
    {
      icon: <FaCogs className="feature-icon" />,
      title: "Workflow Automation",
      description: "Streamline your business processes with automation tools",
    },
    {
      icon: <FaLock className="feature-icon" />,
      title: "Secure & Reliable",
      description: "Enterprise-grade security with 99.9% uptime guarantee",
    },
  ]

  const plans = [
    {
      name: "Starter",
      price: "$0",
      description: "Perfect for getting started",
      features: ["Up to 100 customers", "Basic reports", "Email support"],
      color: "blue",
    },
    {
      name: "Professional",
      price: "$29",
      description: "For growing businesses",
      features: ["Unlimited customers", "Advanced analytics", "Priority support", "API access"],
      color: "green",
      featured: true,
    },
    {
      name: "Enterprise",
      price: "Custom",
      description: "For large organizations",
      features: ["Everything in Pro", "Custom integrations", "Dedicated support", "SLA"],
      color: "purple",
    },
  ]

  const handleNewsletterSignup = (e) => {
    e.preventDefault()
    if (email) {
      alert(`Thanks for subscribing! Check ${email} for updates.`)
      setEmail("")
    }
  }

  return (
    <div className="home-page">
      {/* Navigation */}
      <nav className="navbar">
        <div className="navbar-container">
          <div className="navbar-brand">
            <div className="brand-logo">LAXMI</div>
            <span className="brand-text">Rice Mill Admin</span>
          </div>
          <button className="navbar-login-btn" onClick={onLoginClick}>
            Login
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h1 className="hero-title">Complete Business Management System</h1>
            <p className="hero-subtitle">
              Manage customers, orders, products, and finances all in one place. Built for modern businesses.
            </p>
            <div className="hero-buttons">
              <button className="btn-primary" onClick={onLoginClick}>
                Get Started <FaArrowRight />
              </button>
              <button className="btn-secondary" onClick={() => navigate("/login")}>
                Admin Login
              </button>
            </div>
          </div>
          <div className="hero-image">
            <div className="hero-card">
              <div className="card-header">Dashboard Overview</div>
              <div className="card-stat">
                <span>Revenue</span>
                <strong>₹2,50,000</strong>
              </div>
              <div className="card-stat">
                <span>Orders</span>
                <strong>342</strong>
              </div>
              <div className="card-stat">
                <span>Customers</span>
                <strong>1,289</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="section-container">
          <h2 className="section-title">Powerful Features</h2>
          <p className="section-subtitle">Everything you need to run your business efficiently</p>
          <div className="features-grid">
            {features.map((feature, idx) => (
              <div key={idx} className="feature-card">
                <div className="feature-icon-wrapper">{feature.icon}</div>
                <h3>{feature.title}</h3>
                <p>{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="pricing-section">
        <div className="section-container">
          <h2 className="section-title">Simple, Transparent Pricing</h2>
          <p className="section-subtitle">Choose the plan that fits your business needs</p>
          <div className="pricing-grid">
            {plans.map((plan, idx) => (
              <div key={idx} className={`price-card ${plan.featured ? "featured" : ""}`}>
                <div className={`price-header ${plan.color}`}>
                  <h3>{plan.name}</h3>
                  <p className="price">{plan.price}</p>
                  <p className="price-desc">{plan.description}</p>
                </div>
                <ul className="price-features">
                  {plan.features.map((feature, i) => (
                    <li key={i}>
                      <FaCheck /> {feature}
                    </li>
                  ))}
                </ul>
                <button className={`price-btn ${plan.featured ? "primary" : "secondary"}`}>Get Started</button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="section-container">
          <div className="stats-grid">
            <div className="stat-item">
              <h3>10,000+</h3>
              <p>Active Users</p>
            </div>
            <div className="stat-item">
              <h3>₹5 Cr+</h3>
              <p>Transactions Processed</p>
            </div>
            <div className="stat-item">
              <h3>150+</h3>
              <p>Happy Businesses</p>
            </div>
            <div className="stat-item">
              <h3>99.9%</h3>
              <p>Uptime SLA</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2>Ready to transform your business?</h2>
          <p>Start your free trial today. No credit card required.</p>
          <button className="btn-primary" onClick={onLoginClick}>
            Start Free Trial <FaArrowRight />
          </button>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="newsletter-section">
        <div className="section-container">
          <div className="newsletter-content">
            <h2>Subscribe to our newsletter</h2>
            <p>Get the latest updates and tips delivered to your inbox</p>
            <form className="newsletter-form" onSubmit={handleNewsletterSignup}>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <button type="submit" className="btn-primary">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-col">
              <h4>Product</h4>
              <ul>
                <li>
                  <a href="#features">Features</a>
                </li>
                <li>
                  <a href="#pricing">Pricing</a>
                </li>
                <li>
                  <a href="#security">Security</a>
                </li>
                <li>
                  <a href="#changelog">Changelog</a>
                </li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Company</h4>
              <ul>
                <li>
                  <a href="#about">About Us</a>
                </li>
                <li>
                  <a href="#blog">Blog</a>
                </li>
                <li>
                  <a href="#careers">Careers</a>
                </li>
                <li>
                  <a href="#contact">Contact</a>
                </li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Legal</h4>
              <ul>
                <li>
                  <a href="#privacy">Privacy Policy</a>
                </li>
                <li>
                  <a href="#terms">Terms of Service</a>
                </li>
                <li>
                  <a href="#cookies">Cookie Policy</a>
                </li>
                <li>
                  <a href="#disclaimer">Disclaimer</a>
                </li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Support</h4>
              <ul>
                <li>
                  <a href="#help">Help Center</a>
                </li>
                <li>
                  <a href="#docs">Documentation</a>
                </li>
                <li>
                  <a href="#api">API Docs</a>
                </li>
                <li>
                  <a href="#status">Status Page</a>
                </li>
              </ul>
            </div>
            <div className="footer-col">
              <h4>Contact</h4>
              <p>Email: info@laxmiricemil.com</p>
              <p>Phone: +91 95735 01203</p>
              <div className="social-links">
                <a href="#github" title="GitHub">
                  <FaGithub />
                </a>
                <a href="#linkedin" title="LinkedIn">
                  <FaLinkedin />
                </a>
                <a href="#twitter" title="Twitter">
                  <FaTwitter />
                </a>
              </div>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 Laxmi Jee Rice Mill Admin System. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
