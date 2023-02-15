"use strict";

const db = require("../db");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

class Appointment {
  /**
   * Create, update, and delete calendar appointments
   */

  static async create(data) {
    const result = await db.query(
      `INSERT INTO appoointments (description, start_time, end_time)
            VALUES ($1, $2, $3)
            RETURNING id, description, start_time AS "startTime", end_time AS "endTime", cal_id AS "calId"`,
      [data.description, data.startTime, data.endTime]
    );

    let createdAppt = result.rows[0];

    return createdAppt;
  }

  static async get(id) {
    const apptRes = await db.query(
      `SELECT id, description, start_time, end_time, cal_id
                FROM appointments
                WHERE id = $1`,
      [id]
    );
    let appt = apptRes.rows[0];

    if (!appt) throw new NotFoundError(`No appointment with ID of ${id}`);
  }
}
