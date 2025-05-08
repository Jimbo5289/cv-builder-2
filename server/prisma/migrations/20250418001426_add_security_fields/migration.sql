/*
  Warnings:

  - You are about to drop the column `invoiceId` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `stripeId` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Payment` table. All the data in the column will be lost.
  - You are about to drop the column `planId` on the `Subscription` table. All the data in the column will be lost.
  - You are about to drop the column `stripeId` on the `Subscription` table. All the data in the column will be lost.
  - Added the required column `stripePaymentId` to the `Payment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stripeCustomerId` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stripePriceId` to the `Subscription` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stripeSubscriptionId` to the `Subscription` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Payment_stripeId_key";

-- DropIndex
DROP INDEX "Subscription_stripeId_key";

-- AlterTable
ALTER TABLE "Payment" DROP COLUMN "invoiceId",
DROP COLUMN "stripeId",
DROP COLUMN "updatedAt",
ADD COLUMN     "stripePaymentId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Subscription" DROP COLUMN "planId",
DROP COLUMN "stripeId",
ADD COLUMN     "stripeCustomerId" TEXT NOT NULL,
ADD COLUMN     "stripePriceId" TEXT NOT NULL,
ADD COLUMN     "stripeSubscriptionId" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "failedLoginAttempts" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "lastLogin" TIMESTAMP(3),
ADD COLUMN     "lockedUntil" TIMESTAMP(3),
ADD COLUMN     "resetToken" TEXT,
ADD COLUMN     "resetTokenExpiry" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "CV" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "atsScore" INTEGER,

    CONSTRAINT "CV_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CVSection" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "cvId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CVSection_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CV" ADD CONSTRAINT "CV_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CVSection" ADD CONSTRAINT "CVSection_cvId_fkey" FOREIGN KEY ("cvId") REFERENCES "CV"("id") ON DELETE CASCADE ON UPDATE CASCADE;
