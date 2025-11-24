-- Seed demo data for testing
INSERT INTO customers (name, email, phone, address, city, state, gstin, created_by, created_at) VALUES
('Rajesh Singh', 'rajesh@example.com', '9876543210', 'Main Street', 'Delhi', 'DL', '10BJPR1234A1Z5', 1, NOW()),
('Priya Sharma', 'priya@example.com', '8765432109', 'Park Avenue', 'Mumbai', 'MH', '27BJPR5678B2Z6', 1, NOW()),
('Amit Patel', 'amit@example.com', '7654321098', 'Commercial Lane', 'Bangalore', 'KA', '29BJPR9012C3Z7', 1, NOW())
ON CONFLICT DO NOTHING;

INSERT INTO products (name, description, price, quantity, sku, category, created_by, created_at) VALUES
('Premium Rice - Basmati', 'High quality Basmati rice', 250.00, 100, 'RICE-001', 'Rice', 1, NOW()),
('Wheat Flour - 1kg', 'Pure wheat flour', 50.00, 500, 'FLOUR-001', 'Flour', 1, NOW()),
('Cooking Oil - 5L', 'Pure vegetable cooking oil', 450.00, 50, 'OIL-001', 'Oil', 1, NOW())
ON CONFLICT DO NOTHING;

INSERT INTO orders (order_number, customer_id, total_amount, status, order_date, created_by, created_at) VALUES
('ORD-2025-001', 1, 15000.00, 'completed', NOW(), 1, NOW()),
('ORD-2025-002', 2, 8500.00, 'processing', NOW(), 1, NOW()),
('ORD-2025-003', 3, 22000.00, 'completed', NOW(), 1, NOW())
ON CONFLICT DO NOTHING;
