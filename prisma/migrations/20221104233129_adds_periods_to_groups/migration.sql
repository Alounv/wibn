-- CreateTable
CREATE TABLE "Period" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "period" TEXT NOT NULL,
    "groupId" TEXT,
    CONSTRAINT "Period_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "Group" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Period_period_key" ON "Period"("period");

-- Insert periods
INSERT INTO "Period" ("id", "period") VALUES ('cla34wd9h0000wwfk9wq5u3tc', 'MO-M');
INSERT INTO "Period" ("id", "period") VALUES ('cla34wd9h0001wwfk9q2q7q2c', 'MO-A');
INSERT INTO "Period" ("id", "period") VALUES ('cla34wd9h0002wwfk9q2q7q2d', 'MO-E');
INSERT INTO "Period" ("id", "period") VALUES ('cla34wd9h0003wwfk9q2q7q2e', 'TU-M');
INSERT INTO "Period" ("id", "period") VALUES ('cla34wd9h0004wwfk9q2q7q2f', 'TU-A');
INSERT INTO "Period" ("id", "period") VALUES ('cla34wd9h0005wwfk9q2q7q2g', 'TU-E');
INSERT INTO "Period" ("id", "period") VALUES ('cla34wd9h0006wwfk9q2q7q2h', 'WE-M');
INSERT INTO "Period" ("id", "period") VALUES ('cla34wd9h0007wwfk9q2q7q2i', 'WE-A');
INSERT INTO "Period" ("id", "period") VALUES ('cla34wd9h0008wwfk9q2q7q2j', 'WE-E');
INSERT INTO "Period" ("id", "period") VALUES ('cla34wd9h0009wwfk9q2q7q2k', 'TH-M');
INSERT INTO "Period" ("id", "period") VALUES ('cla34wd9h000awwfk9q2q7q2l', 'TH-A');
INSERT INTO "Period" ("id", "period") VALUES ('cla34wd9h000bwwfk9q2q7q2m', 'TH-E');
INSERT INTO "Period" ("id", "period") VALUES ('cla34wd9h000cwwfk9q2q7q2n', 'FR-M');
INSERT INTO "Period" ("id", "period") VALUES ('cla34wd9h000dwwfk9q2q7q2o', 'FR-A');
INSERT INTO "Period" ("id", "period") VALUES ('cla34wd9h000ewwfka0q5u3tc', 'FR-E');
INSERT INTO "Period" ("id", "period") VALUES ('cla34wd9h000fwwfka0q5u3td', 'SA-M');
INSERT INTO "Period" ("id", "period") VALUES ('cla34wd9h000gwwfka0q5u3te', 'SA-A');
INSERT INTO "Period" ("id", "period") VALUES ('cla34wd9h000hwwfka0q5u3tf', 'SA-E');
INSERT INTO "Period" ("id", "period") VALUES ('cla34wd9h000iwwfka0q5u3tg', 'SU-M');
INSERT INTO "Period" ("id", "period") VALUES ('cla34wd9h000jwwfka0q5u3th', 'SU-A');
INSERT INTO "Period" ("id", "period") VALUES ('cla34wd9h000kwwfka0q5u3ti', 'SU-E');
