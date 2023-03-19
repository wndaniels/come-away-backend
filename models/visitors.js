"use strict";

const db = require("../db");
const {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} = require("../expressError");

class Visitor {
  static async getAllVisitors() {
    const result = await db.query(
      `SELECT id,
              full_name AS "fullName",
              note,
              start_time AS "startTime",
              end_time AS "endTime",
              calendar_id AS "calendarId"
      FROM visitors`
    );
    return result.rows;
  }

  static async create(data) {
    const result = await db.query(
      `INSERT INTO visitors 
              (
                full_name, 
                note, 
                start_time, 
                end_time, 
                calendar_id
              )
            VALUES ($1, $2, $3, $4, $5)
            RETURNING id,
                      full_name AS "fullName",
                      note,
                      start_time AS "startTime",
                      end_time AS "endTime",
                      calendar_id AS "calendarId"`,
      [data.fullName, data.note, data.startTime, data.endTime, data.calendarId]
    );

    let createdVisitor = result.rows[0];

    return createdVisitor;
  }

  static async delete(id) {
    const result = await db.query(
      `DELETE 
        FROM visitors
        WHERE id = $1
        RETURNING id`,
      [id]
    );
    let visitor = result.rows[0];

    if (!visitor) throw new NotFoundError(`No appointment with ID of ${id}`);
  }
}

module.exports = Visitor;
