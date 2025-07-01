-- Seed data for CaboAI PostgreSQL Database
-- Initial data for Los Cabos business platform

-- Insert sample admin user
INSERT INTO users (id, email, password_hash, first_name, last_name, role, is_active, email_verified) 
VALUES (
    '550e8400-e29b-41d4-a716-446655440000',
    'admin@caboai.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewgdRMY.Z.Y9tZ8O', -- password: admin123
    'Admin',
    'CaboAI',
    'admin',
    true,
    true
) ON CONFLICT (email) DO NOTHING;

-- Insert sample business owner
INSERT INTO users (id, email, password_hash, first_name, last_name, phone, role, is_active, email_verified)
VALUES (
    '550e8400-e29b-41d4-a716-446655440001', 
    'maria@marinahotel.com',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewgdRMY.Z.Y9tZ8O', -- password: admin123
    'María',
    'González',
    '+52 624 143 3333',
    'business_owner',
    true,
    true
) ON CONFLICT (email) DO NOTHING;

-- Insert sample businesses
INSERT INTO businesses (
    id, owner_id, name, description, category, subcategory,
    email, phone, whatsapp_number, website,
    address, neighborhood, latitude, longitude,
    business_hours, services, amenities, languages,
    price_range, accepted_currencies,
    ai_enabled, ai_personality, subscription_plan, is_verified, rating, review_count
) VALUES (
    '660e8400-e29b-41d4-a716-446655440000',
    '550e8400-e29b-41d4-a716-446655440001',
    'Hotel Marina Los Cabos',
    'Hotel boutique luxury frente a la marina con vista al Arco de Cabo San Lucas',
    'hospitalidad',
    'hotel',
    'reservas@marinahotel.com',
    '+52 624 143 3333',
    '+52 624 143 3333',
    'https://marinahotel.com',
    'Boulevard Marina s/n, Centro, Cabo San Lucas, BCS',
    'marina',
    22.8905,
    -109.9167,
    '{
        "monday": {"open": "00:00", "close": "23:59", "closed": false},
        "tuesday": {"open": "00:00", "close": "23:59", "closed": false},
        "wednesday": {"open": "00:00", "close": "23:59", "closed": false},
        "thursday": {"open": "00:00", "close": "23:59", "closed": false},
        "friday": {"open": "00:00", "close": "23:59", "closed": false},
        "saturday": {"open": "00:00", "close": "23:59", "closed": false},
        "sunday": {"open": "00:00", "close": "23:59", "closed": false}
    }',
    ARRAY['hospedaje', 'restaurante', 'bar', 'piscina', 'spa', 'concierge'],
    ARRAY['wifi', 'estacionamiento', 'aire_acondicionado', 'vista_mar', 'acceso_playa'],
    ARRAY['es', 'en'],
    '$$$',
    ARRAY['MXN', 'USD'],
    true,
    'Asistente profesional y amable especializado en hospitalidad luxury. Experto en Los Cabos con conocimiento profundo de servicios hoteleros, recomendaciones locales y atención al cliente excepcional.',
    'professional',
    true,
    4.8,
    245
) ON CONFLICT (id) DO NOTHING;

-- Insert sample restaurant business
INSERT INTO businesses (
    id, owner_id, name, description, category, subcategory,
    email, phone, whatsapp_number,
    address, neighborhood, latitude, longitude,
    business_hours, services, amenities, languages,
    price_range, accepted_currencies,
    ai_enabled, ai_personality, subscription_plan, is_verified, rating, review_count
) VALUES (
    '660e8400-e29b-41d4-a716-446655440001',
    '550e8400-e29b-41d4-a716-446655440001',
    'Restaurante Mariscos El Capitán',
    'Auténtica cocina mexicana y mariscos frescos con vista al mar',
    'restaurantes',
    'mariscos',
    'reservas@mariscoscapitan.com',
    '+52 624 143 5555',
    '+52 624 143 5555',
    'Playa El Médano, Cabo San Lucas, BCS',
    'medano_beach',
    22.8880,
    -109.9123,
    '{
        "monday": {"open": "11:00", "close": "22:00", "closed": false},
        "tuesday": {"open": "11:00", "close": "22:00", "closed": false},
        "wednesday": {"open": "11:00", "close": "22:00", "closed": false},
        "thursday": {"open": "11:00", "close": "22:00", "closed": false},
        "friday": {"open": "11:00", "close": "23:00", "closed": false},
        "saturday": {"open": "11:00", "close": "23:00", "closed": false},
        "sunday": {"open": "11:00", "close": "22:00", "closed": false}
    }',
    ARRAY['comida', 'bebidas', 'mariscos_frescos', 'eventos_privados'],
    ARRAY['terraza', 'vista_mar', 'estacionamiento', 'wifi'],
    ARRAY['es', 'en'],
    '$$',
    ARRAY['MXN', 'USD'],
    true,
    'Asistente experto en gastronomía mexicana y mariscos. Conocedor de Los Cabos, amigable y profesional, especializado en recomendaciones culinarias y reservas.',
    'starter',
    true,
    4.6,
    189
) ON CONFLICT (id) DO NOTHING;

-- Insert sample tour operator business
INSERT INTO businesses (
    id, owner_id, name, description, category, subcategory,
    email, phone, whatsapp_number, website,
    address, neighborhood, latitude, longitude,
    business_hours, services, amenities, languages,
    price_range, accepted_currencies,
    ai_enabled, ai_personality, subscription_plan, is_verified, rating, review_count
) VALUES (
    '660e8400-e29b-41d4-a716-446655440002',
    '550e8400-e29b-41d4-a716-446655440001',
    'Cabo Adventures & Tours',
    'Tours de aventura, avistamiento de ballenas y actividades acuáticas en Los Cabos',
    'turismo',
    'tours_aventura',
    'info@caboadventures.com',
    '+52 624 143 7777',
    '+52 624 158 9999',
    'https://caboadventures.com',
    'Marina Cabo San Lucas, Dock F, Local 12',
    'marina',
    22.8889,
    -109.9142,
    '{
        "monday": {"open": "07:00", "close": "18:00", "closed": false},
        "tuesday": {"open": "07:00", "close": "18:00", "closed": false},
        "wednesday": {"open": "07:00", "close": "18:00", "closed": false},
        "thursday": {"open": "07:00", "close": "18:00", "closed": false},
        "friday": {"open": "07:00", "close": "18:00", "closed": false},
        "saturday": {"open": "07:00", "close": "18:00", "closed": false},
        "sunday": {"open": "07:00", "close": "18:00", "closed": false}
    }',
    ARRAY['whale_watching', 'snorkel', 'pesca_deportiva', 'sunset_cruise', 'tours_privados'],
    ARRAY['equipos_incluidos', 'guias_certificados', 'transporte_hotel', 'fotografo'],
    ARRAY['es', 'en'],
    '$$',
    ARRAY['MXN', 'USD', 'CAD'],
    true,
    'Experto en turismo y aventuras en Los Cabos. Especializado en actividades marinas, conocedor del clima y condiciones locales, enfocado en crear experiencias memorables y seguras.',
    'business',
    true,
    4.9,
    456
) ON CONFLICT (id) DO NOTHING;

-- Insert sample knowledge base entries
INSERT INTO knowledge_base (business_id, title, content, category, tags, language, is_active) VALUES
(
    '660e8400-e29b-41d4-a716-446655440000',
    'Políticas de Check-in y Check-out',
    'Check-in: 15:00 hrs. Check-out: 12:00 hrs. Early check-in sujeto a disponibilidad sin costo adicional. Late check-out disponible hasta las 15:00 con cargo de 50% de la tarifa diaria.',
    'politicas',
    ARRAY['checkin', 'checkout', 'horarios'],
    'es',
    true
),
(
    '660e8400-e29b-41d4-a716-446655440000',
    'Servicios del Hotel',
    'Servicios incluidos: WiFi gratuito, estacionamiento, alberca, gimnasio, concierge. Servicios adicionales: Spa, restaurant, room service, tours, transportación al aeropuerto.',
    'servicios',
    ARRAY['servicios', 'amenidades', 'incluido'],
    'es',
    true
),
(
    '660e8400-e29b-41d4-a716-446655440000',
    'Recomendaciones Los Cabos',
    'Actividades recomendadas: Avistamiento de ballenas (dic-abr), El Arco, Playa del Amor, Marina, vida nocturna en Cabo San Lucas, golf, pesca deportiva, snorkel.',
    'recomendaciones',
    ARRAY['actividades', 'turismo', 'los_cabos'],
    'es',
    true
);

-- Insert sample conversations and messages for demo
INSERT INTO conversations (
    id, business_id, customer_phone, customer_name, customer_email,
    channel, language, status, intent, context, last_message_at
) VALUES (
    '770e8400-e29b-41d4-a716-446655440000',
    '660e8400-e29b-41d4-a716-446655440000',
    '+1 555 123 4567',
    'John Smith',
    'john.smith@email.com',
    'whatsapp',
    'en',
    'resolved',
    'booking_inquiry',
    '{"budget": "500-1000", "guests": 2, "dates": "2024-02-15 to 2024-02-20"}',
    NOW() - INTERVAL '2 days'
),
(
    '770e8400-e29b-41d4-a716-446655440001',
    '660e8400-e29b-41d4-a716-446655440002',
    '+52 55 9876 5432',
    'Ana García',
    'ana.garcia@email.com',
    'whatsapp',
    'es',
    'active',
    'tour_inquiry',
    '{"activity": "whale_watching", "group_size": 4, "date": "2024-02-10"}',
    NOW() - INTERVAL '1 hour'
);

-- Insert sample messages
INSERT INTO messages (conversation_id, content, message_type, is_from_customer, sender_name, processed_by_ai, ai_confidence) VALUES
(
    '770e8400-e29b-41d4-a716-446655440000',
    'Hi! Do you have rooms available for February 15-20?',
    'text',
    true,
    'John Smith',
    true,
    0.9500
),
(
    '770e8400-e29b-41d4-a716-446655440000',
    '¡Hola John! Yes, we have beautiful oceanview rooms available for those dates. Our rates for February 15-20 range from $450-$850 per night including breakfast. Would you like me to show you our available options?',
    'text',
    false,
    'Hotel Marina AI',
    true,
    0.9200
);

-- Insert sample analytics data
INSERT INTO business_analytics (
    business_id, date, total_conversations, new_conversations, resolved_conversations,
    total_messages, ai_messages, human_messages, avg_response_time_seconds,
    leads_generated, bookings_made, revenue_generated
) VALUES
(
    '660e8400-e29b-41d4-a716-446655440000',
    CURRENT_DATE - INTERVAL '1 day',
    25, 18, 22, 67, 45, 22, 45, 12, 8, 12500.00
),
(
    '660e8400-e29b-41d4-a716-446655440000',
    CURRENT_DATE - INTERVAL '2 days',
    32, 24, 28, 89, 62, 27, 38, 15, 11, 18750.00
);

-- Create sample API key for testing
INSERT INTO api_keys (
    business_id, name, key_hash, key_preview, 
    permissions, rate_limit, is_active
) VALUES (
    '660e8400-e29b-41d4-a716-446655440000',
    'Production API Key',
    '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewgdRMY.Z.Y9tZ8O',
    'caboai_live_1234...',
    '["read:conversations", "write:messages", "read:analytics"]',
    1000,
    true
);

-- Update sequences to avoid conflicts
SELECT setval('users_id_seq', (SELECT MAX(id::text)::int FROM users WHERE id::text ~ '^[0-9]+$'), true);
SELECT setval('businesses_id_seq', (SELECT MAX(id::text)::int FROM businesses WHERE id::text ~ '^[0-9]+$'), true);