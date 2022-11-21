/*
  Warnings:

  - You are about to drop the column `groupId` on the `Period` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Period` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "_GroupToPeriod" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_GroupToPeriod_A_fkey" FOREIGN KEY ("A") REFERENCES "Group" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_GroupToPeriod_B_fkey" FOREIGN KEY ("B") REFERENCES "Period" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_PeriodToUser" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_PeriodToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Period" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_PeriodToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Period" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "period" TEXT NOT NULL
);
INSERT INTO "new_Period" ("id", "period") SELECT "id", "period" FROM "Period";
DROP TABLE "Period";
ALTER TABLE "new_Period" RENAME TO "Period";
CREATE UNIQUE INDEX "Period_period_key" ON "Period"("period");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

-- CreateIndex
CREATE UNIQUE INDEX "_GroupToPeriod_AB_unique" ON "_GroupToPeriod"("A", "B");

-- CreateIndex
CREATE INDEX "_GroupToPeriod_B_index" ON "_GroupToPeriod"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_PeriodToUser_AB_unique" ON "_PeriodToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_PeriodToUser_B_index" ON "_PeriodToUser"("B");
