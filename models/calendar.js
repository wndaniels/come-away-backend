"use strict";

const db = require("../db");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

class Calendar {
  /**
   * Get all calendars
   */
  static async getAllCal() {
    const result = await db.query(
      `SELECT id,
              business_begins_hour_id AS "businessBeginsHour",
              business_ends_hour_id AS "businessEndsHour",
              user_id AS "userId"
        FROM calendars`
    );
    return result.rows;
  }

  /**
   * Get businessBeginsHour data
   * e.g. '12:00 AM', '1:00 AM', '2:00 AM', etc...
   */
  static async getBeginHoursData() {
    const result = await db.query(
      `SELECT business_begins_hour AS "businessBeginsHour", 
              hour_title AS "hourTitle",
              iso_time AS "isoTime"
        FROM begin_hours`
    );
    return result.rows;
  }

  /**
   * Get businessEndsHour data
   * e.g. '12:00 AM', '1:00 AM', '2:00 AM', etc...
   */
  static async getEndHoursData() {
    const result = await db.query(
      `SELECT business_ends_hour AS "businessEndsHour", 
              hour_title AS "hourTitle",
              iso_time AS "isoTime"
        FROM end_hours`
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
   * User is able to create calendar
   */
  static async create(data) {
    const result = await db.query(
      `INSERT INTO calendars 
                  (
                    business_begins_hour_id, 
                    business_ends_hour_id, 
                    user_id
                  )
        VALUES ($1, $2, $3)
        RETURNING business_begins_hour_id AS "businessBeginsHour",
                  business_ends_hour_id AS "businessEndsHour",
                  user_id AS "userId"`,
      [data.businessBeginsHour, data.businessEndsHour, data.userId]
    );

    let createdCal = result.rows[0];

    return createdCal;
  }

  /**
   * User is able to edit their calendar
   */
  // static async update(data) {
  //   const result = await db.query();
  // }

  static async update(id, data) {
    const { setCols, values } = sqlForPartialUpdate(data, {
      businessBeginsHour: "business_begins_hour_id",
      businessEndsHour: "business_ends_hour_id",
    });

    const idVarIdx = "$" + (values.length + 1);

    const querySql = `UPDATE calendars
      SET ${setCols}
      WHERE id = ${idVarIdx} 
      RETURNING business_begins_hour_id AS "businessBeginsHour",
                business_ends_hour_id AS "businessEndsHour"`;

    const result = await db.query(querySql, [...values, id]);
    const calendar = result.rows[0];

    return calendar;
  }

  /**
   * User is able to delete their current calendar
   */

  static async delete(id) {
    const result = await db.query(
      `DELETE 
        FROM calendars
        WHERE id = $1
        RETURNING id`,
      [id]
    );
    const calendar = result.rows[0];

    if (!calendar) throw new NotFoundError(`No calendar: ${id}`);
  }
}

module.exports = Calendar;
