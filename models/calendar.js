"use strict";

const db = require("../db");
const { sqlForPartialUpdate } = require("../helpers/sql");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

class Calendar {
  static async getAllCal() {
    const result = await db.query(
      `SELECT id,
              view_title AS "viewType",
              business_begins_hour_id AS "businessBeginsHour",
              business_ends_hour_id AS "businessEndsHour",
              user_id AS "userId"
        FROM calendars`
    );
    return result.rows;
  }

  /**
   * Get viewType data
   * e.g. 'Day', 'Week'
   */
  static async getCalViewTypes() {
    const result = await db.query(
      `SELECT id, view_title AS "viewType"
        FROM cal_views AS "calViews"`
    );
    return result.rows;
  }

  /**
   * Get businessBeginsHour data
   * e.g. '12:00 AM', '1:00 AM', '2:00 AM', etc...
   */
  static async getBeginHoursData() {
    const result = await db.query(
      `SELECT business_begins_hour AS "businessBeginsHour", hour_title AS "hourTitle"
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
      `SELECT business_ends_hour AS "businessEndsHour", hour_title AS "hourTitle"
      FROM end_hours`
    );
    return result.rows;
  }
  /**
   * User is able to create calendar
   */
  static async create(data) {
    const result = await db.query(
      `INSERT INTO calendars (view_title, business_begins_hour_id, business_ends_hour_id, user_id)
            VALUES ($1, $2, $3, $4)
            RETURNING view_title AS "viewType",
              business_begins_hour_id AS "businessBeginsHour",
              business_ends_hour_id AS "businessEndsHour",
              user_id AS "userId"`,
      [
        data.viewType,
        data.businessBeginsHour,
        data.businessEndsHour,
        data.userId,
      ]
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

  static async update(data) {
    const { setCols, values } = sqlForPartialUpdate(data, {
      viewType: "view_title",
      businessBeginsHour: "business_begins_hour_id",
      businessEndsHour: "business_ends_hour_id",
    });

    const querySql = `UPDATE calendars
      SET ${setCols}
      RETURNING 
          view_title AS "viewType",
          business_begins_hour_id AS "businessBeginsHour",
          business_ends_hour_id AS "businessEndsHour"`;

    const result = await db.query(querySql, [...values]);
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
