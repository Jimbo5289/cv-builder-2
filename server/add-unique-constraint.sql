-- Manual migration to add unique constraint to stripeSubscriptionId
-- This should be run in production database

-- First, check for any duplicate stripeSubscriptionId values
SELECT stripeSubscriptionId, COUNT(*) as count 
FROM "Subscription" 
GROUP BY stripeSubscriptionId 
HAVING COUNT(*) > 1;

-- If there are duplicates, keep only the most recent one
-- (Uncomment and run if duplicates are found)
-- DELETE FROM "Subscription" s1 
-- WHERE s1.id NOT IN (
--   SELECT s2.id FROM "Subscription" s2 
--   WHERE s2.stripeSubscriptionId = s1.stripeSubscriptionId 
--   ORDER BY s2.createdAt DESC 
--   LIMIT 1
-- );

-- Add the unique constraint
ALTER TABLE "Subscription" 
ADD CONSTRAINT "Subscription_stripeSubscriptionId_key" 
UNIQUE ("stripeSubscriptionId");

-- Verify the constraint was added
SELECT conname, contype 
FROM pg_constraint 
WHERE conrelid = 'Subscription'::regclass 
AND conname = 'Subscription_stripeSubscriptionId_key'; 