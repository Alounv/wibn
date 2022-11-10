-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Period" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "period" TEXT NOT NULL,
    "userId" TEXT,
    "groupId" TEXT,
    CONSTRAINT "Period_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Period_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Period" ("groupId", "id", "period") SELECT "groupId", "id", "period" FROM "Period";
DROP TABLE "Period";
ALTER TABLE "new_Period" RENAME TO "Period";
CREATE UNIQUE INDEX "Period_period_key" ON "Period"("period");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
