-- Alter Player table to support full CRUD requirements.
ALTER TABLE "Player"
  RENAME COLUMN "displayName" TO "fullName";

ALTER TABLE "Player"
  ADD COLUMN "nickname" TEXT,
  ALTER COLUMN "psnId" DROP NOT NULL;

UPDATE "Player"
SET "nickname" = "fullName"
WHERE "nickname" IS NULL;

ALTER TABLE "Player"
  ALTER COLUMN "nickname" SET NOT NULL;

ALTER TABLE "Player"
  ADD CONSTRAINT "Player_nickname_key" UNIQUE ("nickname");

ALTER TABLE "Player"
  DROP COLUMN "favoriteTeam",
  DROP COLUMN "updatedAt";
