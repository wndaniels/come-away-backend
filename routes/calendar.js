"use strict";

const jsonschema = require("jsonschema");
const express = require("express");

const {
  ensureCorrectUserOrAdmin,
  ensureAdmin,
  ensureLoggedIn,
} = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const Calendar = require("../models/calendar");
const newCalendarSchema = require("../schemas/calendarNew.json");
const updateCalendarSchema = require("../schemas/calendarUpdate.json");

const router = express.Router();

router.get("/", async function (req, res, next) {
  try {
    const calData = await Calendar.getAllCal();
    return res.json(calData);
  } catch (err) {
    return next(err);
  }
});

router.get("/cal-views", async function (req, res, next) {
  try {
    const calViewData = await Calendar.getCalViewTypes();
    return res.json(calViewData);
  } catch (err) {
    return next(err);
  }
});

router.get("/begin-hours", async function (req, res, next) {
  try {
    const beginHoursData = await Calendar.getBeginHoursData();
    return res.json(beginHoursData);
  } catch (err) {
    return next(err);
  }
});

router.get("/end-hours", async function (req, res, next) {
  try {
    const endHoursData = await Calendar.getEndHoursData();
    return res.json(endHoursData);
  } catch (err) {
    return next(err);
  }
});

router.post(
  "/:username/create",
  ensureCorrectUserOrAdmin,
  async function (req, res, next) {
    try {
      const validator = jsonschema.validate(req.body, newCalendarSchema);
      if (!validator.valid) {
        const errs = validator.errors.map((e) => e.stack);
        throw new BadRequestError(errs);
      }
      const calendar = await Calendar.create(req.body);
      return res.status(201).json({ calendar });
    } catch (err) {
      return next(err);
    }
  }
);

router.patch(
  "/:id/:username/edit",
  ensureCorrectUserOrAdmin,
  async function (req, res, next) {
    try {
      const validator = jsonschema.validate(req.body, updateCalendarSchema);
      if (!validator.valid) {
        const errs = validator.errors.map((e) => e.stack);
        throw new BadRequestError(errs);
      }
      const updatedCalendar = await Calendar.update(req.params.id, req.body);
      return res.status(201).json({ updatedCalendar });
    } catch (err) {
      return next(err);
    }
  }
);

router.delete(
  "/:id/:username/delete",
  ensureCorrectUserOrAdmin,
  async function (req, res, next) {
    try {
      await Calendar.delete(req.params.id);
      return res.json({ deleted: +req.params.id });
    } catch (err) {
      return next(err);
    }
  }
);

module.exports = router;
