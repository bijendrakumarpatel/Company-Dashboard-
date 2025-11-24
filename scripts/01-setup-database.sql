-- Create users table for authentication
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL DEFAULT 'user', -- 'admin' or 'user'
  phone VARCHAR(20),
  avatar_url VARCHAR(500),
  is_active BOOLEAN DEFAULT true,
  is_premium BOOLEAN DEFAULT false,
  subscription_plan VARCHAR(50) DEFAULT 'free', -- 'free', 'pro', 'premium'
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255),
  phone VARCHAR(20),
  address TEXT,
  city VARCHAR(100),
  state VARCHAR(100),
  gstin VARCHAR(50),
  created_by INT REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2),
  quantity INT DEFAULT 0,
  sku VARCHAR(100),
  category VARCHAR(100),
  created_by INT REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id SERIAL PRIMARY KEY,
  order_number VARCHAR(100) UNIQUE,
  customer_id INT REFERENCES customers(id),
  total_amount DECIMAL(12, 2),
  status VARCHAR(50) DEFAULT 'pending', -- pending, completed, cancelled
  order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  created_by INT REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create agreements table
CREATE TABLE IF NOT EXISTS agreements (
  id SERIAL PRIMARY KEY,
  customer_id INT REFERENCES customers(id),
  template_type VARCHAR(100),
  start_date DATE,
  end_date DATE,
  amount DECIMAL(12, 2),
  remarks TEXT,
  status VARCHAR(50) DEFAULT 'Active',
  created_by INT REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create payments table
CREATE TABLE IF NOT EXISTS payments (
  id SERIAL PRIMARY KEY,
  order_id INT REFERENCES orders(id),
  amount DECIMAL(12, 2),
  payment_method VARCHAR(50),
  payment_status VARCHAR(50) DEFAULT 'pending',
  transaction_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id SERIAL PRIMARY KEY,
  category VARCHAR(100),
  amount DECIMAL(10, 2),
  description TEXT,
  expense_date DATE,
  created_by INT REFERENCES users(id),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better query performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_customers_created_by ON customers(created_by);
CREATE INDEX idx_orders_customer_id ON orders(customer_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_agreements_customer_id ON agreements(customer_id);
CREATE INDEX idx_payments_order_id ON payments(order_id);

-- Insert default admin user (password is hashed in production)
INSERT INTO users (email, password, name, role, is_active) VALUES
('admin@ricemill.com', 'admin123', 'Admin User', 'admin', true)
ON CONFLICT DO NOTHING;

-- Insert sample users
INSERT INTO users (email, password, name, role, is_active, subscription_plan) VALUES
('user1@example.com', 'user123', 'John Doe', 'user', true, 'pro'),
('user2@example.com', 'user123', 'Jane Smith', 'user', true, 'free')
ON CONFLICT DO NOTHING;
