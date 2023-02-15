"use strict";

const db = require("../db");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

class Calendar {
  static async getAllCal() {
    const result = await db.query(
      `SELECT cal_view_id AS "calViewId",
              business_begins_hour_id AS "businessBeginsHourId",
              business_ends_hour_id AS "businessEndsHourId"
        FROM calendars`
    );
    return result.rows;
  }

  static async getCalViewTypes() {
    const result = await db.query(
      `SELECT id, view_type AS "viewType"
        FROM cal_views AS "calViews"`
    );
    return result.rows;
  }

  static async getBeginHoursData() {
    const result = await db.query(
      `SELECT id, business_begins_hour AS "businessBeginsHour"
      FROM begin_hours`
    );
    return result.rows;
  }

  static async getEndHoursData() {
    const result = await db.query(
      `SELECT id, business_ends_hour AS "businessEndsHour"
      FROM end_hours`
    );
    return result.rows;
  }
  /**
   * Create and delete a calendar
   */
  static async create(data) {
    const result = await db.query(
      `INSERT INTO calendars (cal_view_id, business_begins_hour_id, business_ends_hour_id)
            VALUES ($1, $2, $3)
            RETURNING id, cal_view_id AS "calViewId",
              business_begins_hour_id AS "businessBeginsHourId",
              business_ends_hour_id AS "businessEndsHourId"`,
      [data.calViewsId, data.businessBeginsHourId, data.businessEndsHourId]
    );
    let createdCal = result.rows[0];

    return createdCal;
  }
}

module.exports = Calendar;
