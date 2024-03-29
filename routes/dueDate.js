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
const newDueDateSchema = require("../schemas/dueDateNew.json");
const updateDueDateSchema = require("../schemas/dueDateUpdate.json");
const DueDate = require("../models/dueDate");

const router = express.Router();

router.get("/years", async function (req, res, next) {
  try {
    const yearsData = await Calendar.getYearsData();
    return res.json(yearsData);
  } catch (err) {
    return next(err);
  }
});

router.get("/months", async function (req, res, next) {
  try {
    const monthsData = await Calendar.getMonthsData();
    return res.json(monthsData);
  } catch (err) {
    return next(err);
  }
});

router.get("/days", async function (req, res, next) {
  try {
    const daysData = await Calendar.getDaysData();
    return res.json(daysData);
  } catch (err) {
    return next(err);
  }
});

router.get("/", async function (req, res, next) {
  try {
    const dueDateData = await DueDate.getAllDueDates();
    return res.json(dueDateData);
  } catch (err) {
    return next(err);
  }
});

router.post(
  "/:username/create",
  ensureCorrectUserOrAdmin,
  async function (req, res, next) {
    try {
      const validator = jsonschema.validate(req.body, newDueDateSchema);
      if (!validator.valid) {
        const errs = validator.errors.map((e) => e.stack);
        throw new BadRequestError(errs);
      }
      const dueDate = await DueDate.create(req.body);
      return res.status(201).json({ dueDate });
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
      const validator = jsonschema.validate(req.body, updateDueDateSchema);
      if (!validator.valid) {
        const errs = validator.errors.map((e) => e.stick);
        throw new BadRequestError(errs);
      }
      const updateDueDate = await DueDate.update(req.params.id, req.body);
      return res.status(201).json({ updateDueDate });
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
      await DueDate.delete(req.params.id);
      return res.json({ delete: +req.params.id });
    } catch (err) {
      return next(err);
    }
  }
);

module.exports = router;
