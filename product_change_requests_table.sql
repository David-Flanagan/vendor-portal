-- Product Change Requests Table
-- This table stores customer requests to change products in their machines

CREATE TABLE IF NOT EXISTS product_change_requests (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    customer_machine_id UUID NOT NULL REFERENCES customer_machines(id) ON DELETE CASCADE,
    current_product_id UUID NOT NULL REFERENCES products(id),
    new_product_id UUID NOT NULL REFERENCES products(id),
    reason TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    requested_by UUID NOT NULL REFERENCES auth.users(id),
    requested_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    reviewed_by UUID REFERENCES auth.users(id),
    reviewed_at TIMESTAMP WITH TIME ZONE,
    review_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_product_change_requests_customer_machine ON product_change_requests(customer_machine_id);
CREATE INDEX IF NOT EXISTS idx_product_change_requests_status ON product_change_requests(status);
CREATE INDEX IF NOT EXISTS idx_product_change_requests_requested_by ON product_change_requests(requested_by);

-- Row Level Security (RLS) policies
ALTER TABLE product_change_requests ENABLE ROW LEVEL SECURITY;

-- Users can only see their own requests
CREATE POLICY "Users can view their own product change requests" ON product_change_requests
    FOR SELECT USING (auth.uid() = requested_by);

-- Users can insert their own requests
CREATE POLICY "Users can create product change requests" ON product_change_requests
    FOR INSERT WITH CHECK (auth.uid() = requested_by);

-- Admins can view all requests (you'll need to implement admin role checking)
CREATE POLICY "Admins can view all product change requests" ON product_change_requests
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM user_roles 
            WHERE user_id = auth.uid() 
            AND role = 'admin'
        )
    );

-- Function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_product_change_requests_updated_at 
    BEFORE UPDATE ON product_change_requests 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column(); 