-- Add pending_changes column to customer_machines table
-- This column will store JSON array of pending product change requests

ALTER TABLE customer_machines 
ADD COLUMN pending_changes JSONB DEFAULT '[]'::jsonb;

-- Add a comment to document the column purpose
COMMENT ON COLUMN customer_machines.pending_changes IS 'JSON array of pending product change requests with structure: [{id, currentProductId, newProductId, reason, status, requestedBy, requestedAt}]';

-- Create an index on the pending_changes column for better query performance
CREATE INDEX idx_customer_machines_pending_changes ON customer_machines USING GIN (pending_changes);

-- Update existing rows to have an empty array instead of null
UPDATE customer_machines 
SET pending_changes = '[]'::jsonb 
WHERE pending_changes IS NULL;

-- Example structure of pending_changes JSON:
-- [
--   {
--     "id": "uuid",
--     "currentProductId": "product-uuid",
--     "newProductId": "product-uuid", 
--     "reason": "Customer reason for change",
--     "status": "pending|approved|rejected",
--     "requestedBy": "user-uuid",
--     "requestedAt": "2024-01-01T00:00:00Z",
--     "reviewedBy": "admin-uuid",
--     "reviewedAt": "2024-01-01T00:00:00Z",
--     "reviewNotes": "Admin notes"
--   }
-- ] 