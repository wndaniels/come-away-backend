"use strict";

require("dotenv").config();

const SECRET_KEY = process.env.SECRET_KEY || "fSR17dGmFe";
const PORT = +process.env.PORT || 3001;
const BCRYPT_WORK_FACTOR = process.env.NODE_ENV === "test" ? 1 : 12;

/** Use dev daatabase testing database, or via env var, production database */
function getDatabaseUri() {
  return process.env.NODE_ENV === "test"
    ? "come_away_test"
    : process.env.DATABASE_URL || "come_away";
}

module.exports = {
  SECRET_KEY,
  PORT,
  BCRYPT_WORK_FACTOR,
  getDatabaseUri,
};
