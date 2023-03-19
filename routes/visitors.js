"use strict";

const jsonschema = require("jsonschema");
const express = require("express");

const {
  ensureCorrectUserOrAdmin,
  ensureAdmin,
  ensureLoggedIn,
} = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const Visitor = require("../models/visitors");
const newVisitorSchema = require("../schemas/visitorNew.json");

const router = express.Router();

router.get("/", async function (req, res, next) {
  try {
    const visitorData = await Visitor.getAllVisitors();
    return res.json(visitorData);
  } catch (err) {
    return next(err);
  }
});

router.post("/add", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, newVisitorSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }
    const visit = await Visitor.create(req.body);
    return res.status(201).json({ visit });
  } catch (err) {
    return next(err);
  }
});

router.patch("/update", async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, updateVistorSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }
    const updatedVisit = await Visitor.update(req.body);
    return res.status(201).json({ updatedVisit });
  } catch (err) {
    return next(err);
  }
});

router.delete(
  "/:id/:username/delete",
  ensureCorrectUserOrAdmin,
  async function (req, res, next) {
    try {
      await Visitor.delete(req.params.id);
      return res.json({ deleted: +req.params.id });
    } catch (err) {
      return next(err);
    }
  }
);

module.exports = router;
