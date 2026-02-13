-- Car Rental Platform Database Schema (PostgreSQL)
-- Run this SQL to create the necessary tables

-- Cars table
CREATE TABLE IF NOT EXISTS cars (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INTEGER NOT NULL,
    price_per_day DECIMAL(10, 2) NOT NULL,
    whatsapp_number VARCHAR(20) NOT NULL,
    images JSONB,
    description TEXT,
    location VARCHAR(100),
    seats INTEGER DEFAULT 5,
    doors INTEGER DEFAULT 4,
    transmission VARCHAR(50) DEFAULT 'Automatic',
    available BOOLEAN DEFAULT TRUE,
    start_date DATE,
    end_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Drivers table
CREATE TABLE IF NOT EXISTS drivers (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100),
    license_number VARCHAR(50),
    vehicle_assigned VARCHAR(100),
    photo_url TEXT,
    status VARCHAR(20) DEFAULT 'available',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Terms and Policies table
CREATE TABLE IF NOT EXISTS terms (
    id SERIAL PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert default terms and policies
INSERT INTO terms (title, content, display_order) VALUES
('1. Eligibility', 'Renters must be 18 years or older.\nA valid driver''s license is required.\nProof of identity and contact information must be provided.', 1),
('2. Booking and Reservation', 'All bookings must be made through our website or approved contact methods.\nReservations are confirmed only after payment or admin approval.\nCancellations must be notified at least 24 hours in advance.', 2),
('3. Payment', 'Payment can be made via approved methods (e.g., cash, mobile money, or bank transfer).\nNo vehicle will be released without full payment.\nAdditional charges may apply for late return or extra services.', 3),
('4. Vehicle Use', 'Vehicles must be used legally and responsibly.\nNo smoking, alcohol, or illegal substances in the vehicle.\nRenters are responsible for any damage caused during rental.\nVehicles must be returned in the same condition as received.', 4),
('5. Fuel Policy', 'Vehicles are provided with a full tank.\nRenters must refuel before returning; otherwise, refueling charges apply.', 5),
('6. Rental Duration and Late Returns', 'The rental period starts at the agreed pickup time.\nLate returns are subject to extra charges per hour/day.\nEarly returns will not affect the paid rental fee unless otherwise agreed.', 6),
('7. Insurance & Liability', 'Renters are responsible for minor damages and fines.\nMajor accidents must be reported immediately.\nInsurance coverage details will be provided at pickup.', 7),
('8. WhatsApp / Contact Rules', 'Communication for booking is done via WhatsApp or official contact numbers.\nDo not share the vehicle or booking details with third parties.\nAll inquiries must be polite and professional.', 8),
('9. Termination of Rental', 'Rental may be terminated immediately if rules are violated.\nNo refunds for early termination caused by renter misconduct.', 9),
('10. General', 'We reserve the right to update these rules at any time.\nBy renting a vehicle, you agree to follow all terms and policies.\nQuestions or concerns can be addressed via official contact channels.', 10)
ON CONFLICT DO NOTHING;
