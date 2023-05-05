/*
  Warnings:

  - Added the required column `user` to the `LeaderboardEntry` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_LeaderboardEntry" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user" TEXT NOT NULL
);
INSERT INTO "new_LeaderboardEntry" ("date", "id", "name") SELECT "date", "id", "name" FROM "LeaderboardEntry";
DROP TABLE "LeaderboardEntry";
ALTER TABLE "new_LeaderboardEntry" RENAME TO "LeaderboardEntry";
CREATE UNIQUE INDEX "LeaderboardEntry_user_key" ON "LeaderboardEntry"("user");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
