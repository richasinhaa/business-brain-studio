-- CreateTable
CREATE TABLE "BusinessKyc" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BusinessKyc_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "BusinessKyc_userId_idx" ON "BusinessKyc"("userId");
