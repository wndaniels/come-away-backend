"use strict";

const db = require("../db");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");
const { user } = require("pg/lib/defaults");

class DueDate {
  /**
   * Get all due dates
   */
  static async getAllDueDates() {
    const result = await db.query(
      `SELECT id,
              baby_name AS "babyName",
              year_id AS "yearId",
              month_id AS "month_id",
              day_id AS "dayId",
              user_id AS "userId"
        FROM due_dates`
    );
    return result.rows;
  }

  /**
   * Get years data
   * e.g. '2023', '2024', '2025', etc...
   */
  static async getYearsData() {
    const result = await db.query(
      `SELECT id,
              year
        FROM years`
    );
    return result.rows;
  }

  /**
   * Get months data
   * e.g. 'January', 'February', 'March', etc...
   */
  static async getMonthsData() {
    const result = await db.query(
      `SELECT id,
              month
        FROM months`
    );
    return result.rows;
  }

  /**
   * Get days data
   * e.g. '1', '2', '3',...,'30'
   */
  static async getDaysData() {
    const result = await db.query(
      `SELECT id,
              day
        FROM days`
    );
    return result.rows;
  }

  /**
   * User is able to add their due date which will serve as the start date for the users calendar.
   */
  static async create(data) {
    const result = await db.query(
      `INSERT INTO due_dates
                  (
                    baby_name,
                    year_id,
                    month_id,
                    day_id,
                    user_id
                  )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id,
                  baby_name AS "babyName",
                  year_id AS "yearId",
                  month_id AS "monthId",
                  day_id AS "dayId",
                  user_id AS "userId"`,
      [data.babyName, data.yearId, data.monthId, data.dayId, data.userId]
    );
    let createdDueDate = result.rows[0];
    return createdDueDate;
  }
}

module.exports = DueDate;
