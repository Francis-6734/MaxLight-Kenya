-- Auth moved from Auth.js (Prisma-managed sessions/accounts) to Supabase
-- Auth. User.id now mirrors auth.users.id (Supabase-assigned UUID) instead
-- of a Prisma-generated cuid, and credential/session storage is dropped
-- since Supabase owns that data now.

-- DropForeignKey
ALTER TABLE "Account" DROP CONSTRAINT IF EXISTS "Account_userId_fkey";
ALTER TABLE "Session" DROP CONSTRAINT IF EXISTS "Session_userId_fkey";

-- DropTable
DROP TABLE IF EXISTS "Account";
DROP TABLE IF EXISTS "Session";
DROP TABLE IF EXISTS "VerificationToken";

-- AlterTable
ALTER TABLE "User" DROP COLUMN IF EXISTS "emailVerified";
ALTER TABLE "User" DROP COLUMN IF EXISTS "image";
ALTER TABLE "User" DROP COLUMN IF EXISTS "passwordHash";
ALTER TABLE "User" ALTER COLUMN "id" DROP DEFAULT;
