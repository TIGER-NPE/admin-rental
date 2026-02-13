-- Car Rental Platform Database Schema
-- Run this script to create the database and tables

-- Create database
CREATE DATABASE IF NOT EXISTS car_rental;
USE car_rental;

-- Create cars table
CREATE TABLE IF NOT EXISTS cars (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    model VARCHAR(255) NOT NULL,
    year INT NOT NULL,
    price_per_day DECIMAL(10, 2) NOT NULL,
    whatsapp_number VARCHAR(20) NOT NULL,
    image_url VARCHAR(500),
    description TEXT,
    location VARCHAR(255) DEFAULT 'Kigali, Rwanda',
    available BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create car_images table for multiple images per car
CREATE TABLE IF NOT EXISTS car_images (
    id INT AUTO_INCREMENT PRIMARY KEY,
    car_id INT NOT NULL,
    image_url VARCHAR(500) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (car_id) REFERENCES cars(id) ON DELETE CASCADE
);

-- Insert sample data for testing
INSERT INTO cars (name, model, year, price_per_day, whatsapp_number, image_url, description, location) VALUES
('Toyota Corolla', 'Corolla', 2023, 450000.00, '250788123456', 'https://images.unsplash.com/photo-1621007947382-bb3c3968e3bb?w=800', 'Reliable and fuel-efficient sedan perfect for city driving', 'Kigali, Rwanda'),
('Honda Civic', 'Civic', 2022, 550000.00, '250788123457', 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', 'Sporty sedan with excellent handling and comfort', 'Kigali, Rwanda'),
('BMW 3 Series', '320i', 2023, 1200000.00, '250788123458', 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800', 'Luxury sedan with premium features and smooth ride', 'Kigali, Rwanda'),
('Ford Ranger', 'Ranger', 2022, 800000.00, '250788123459', 'https://images.unsplash.com/photo-1605218427368-351816b9837e?w=800', 'Powerful pickup truck for adventure and work', 'Kigali, Rwanda'),
('Mercedes-Benz A-Class', 'A200', 2023, 1500000.00, '250788123460', 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800', 'Compact luxury hatchback with modern design', 'Kigali, Rwanda'),
('Volkswagen Polo', 'Polo', 2021, 400000.00, '250788123461', 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800', 'Compact and efficient car for urban use', 'Kigali, Rwanda'),
('Audi A4', 'A4', 2022, 1100000.00, '250788123462', 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800', 'Elegant sedan with advanced technology', 'Kigali, Rwanda'),
('Toyota Hilux', 'Hilux', 2023, 950000.00, '250788123463', 'https://images.unsplash.com/photo-1621251683728-04537f8567b6?w=800', 'Rugged and reliable pickup truck', 'Kigali, Rwanda');

-- Insert sample car images
INSERT INTO car_images (car_id, image_url, is_primary) VALUES
(1, 'https://images.unsplash.com/photo-1621007947382-bb3c3968e3bb?w=800', TRUE),
(1, 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800', FALSE),
(2, 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800', TRUE),
(2, 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800', FALSE),
(3, 'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=800', TRUE),
(3, 'https://images.unsplash.com/photo-1605218427368-351816b9837e?w=800', FALSE),
(4, 'https://images.unsplash.com/photo-1605218427368-351816b9837e?w=800', TRUE),
(4, 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800', FALSE),
(5, 'https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=800', TRUE),
(5, 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800', FALSE),
(6, 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800', TRUE),
(6, 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800', FALSE),
(7, 'https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=800', TRUE),
(7, 'https://images.unsplash.com/photo-1621251683728-04537f8567b6?w=800', FALSE),
(8, 'https://images.unsplash.com/photo-1621251683728-04537f8567b6?w=800', TRUE),
(8, 'https://images.unsplash.com/photo-1621007947382-bb3c3968e3bb?w=800', FALSE);

-- Create indexes
CREATE INDEX idx_available ON cars(available);
CREATE INDEX idx_price ON cars(price_per_day);
CREATE INDEX idx_car_id ON car_images(car_id);
