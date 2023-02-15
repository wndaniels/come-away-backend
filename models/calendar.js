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
      `SELECT view_type_id AS "viewTypeId",
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
      `SELECT id, business_begins_hour AS "businessBeginsHour", hour_title AS "hourTitle"
      FROM begin_hours`
    );
    return result.rows;
  }

  static async getEndHoursData() {
    const result = await db.query(
      `SELECT id, business_ends_hour AS "businessEndsHour", hour_title AS "hourTitle"
      FROM end_hours`
    );
    return result.rows;
  }
  /**
   * Create and delete a calendar
   */
  static async create(data) {
    const result = await db.query(
      `INSERT INTO calendars (view_type_id, business_begins_hour_id, business_ends_hour_id)
            VALUES ($1, $2, $3)
            RETURNING id, view_type_id AS "viewTypeId",
              business_begins_hour_id AS "businessBeginsHourId",
              business_ends_hour_id AS "businessEndsHourId"`,
      [data.viewType, data.businessBeginsHour, data.businessEndsHour]
    );
    let createdCal = result.rows[0];

    return createdCal;
  }
}

module.exports = Calendar;
