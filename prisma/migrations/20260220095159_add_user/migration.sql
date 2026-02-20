/*
  Warnings:

  - Added the required column `userId` to the `Note` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
-- CreateTable for User
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- Create unique index on email
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- Add nullable userId column to Note so we can backfill existing rows
ALTER TABLE "Note" ADD COLUMN "userId" INTEGER;

-- Insert a default user to own existing notes created before users existed
INSERT INTO "User" ("name", "email", "password", "createdAt")
VALUES ('Imported', 'imported@example.com', '', CURRENT_TIMESTAMP);

-- Backfill existing notes to the imported user
UPDATE "Note" SET "userId" = (
  SELECT "id" FROM "User" WHERE "email" = 'imported@example.com' LIMIT 1
);

-- Make userId required and add foreign key constraint
ALTER TABLE "Note" ALTER COLUMN "userId" SET NOT NULL;
ALTER TABLE "Note" ADD CONSTRAINT "Note_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
