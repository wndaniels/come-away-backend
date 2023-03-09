"use strict";

const jsonschema = require("jsonschema");
const express = require("express");

const { ensureCorrectUserOrAdmin, ensureAdmin } = require("../middleware/auth");
const { BadRequestError } = require("../expressError");
const { createToken } = require("../helpers/tokens");
const User = require("../models/user");
const newUserSchema = require("../schemas/userNew.json");
const updateUserSchema = require("../schemas/userUpdate.json");

const router = express.Router();

/**
 * POST / {user} => {user, token}
 *
 * Adds a new user. This is not the register endpoint,
 * rather a route for admin users to add new users.
 *
 * This returns the newly created user and an authentication token.
 * (user: {username, firstName, lastName, email, isAdmin} => token)
 *
 * Authorization Required: Admin
 */

router.post("/", ensureAdmin, async function (req, res, next) {
  try {
    const validator = jsonschema.validate(req.body, newUserSchema);
    if (!validator.valid) {
      const errs = validator.errors.map((e) => e.stack);
      throw new BadRequestError(errs);
    }
    const user = await User.register(req.body);
    const token = createToken(user);
    return res.status(201).json({ user, token });
  } catch (err) {
    return next(err);
  }
});

/**
 * GET / => { users: [ {username, firstName, lastName, email}, ... ] }
 *
 * Returns list of all users.
 *
 * Authorization Required: Admin
 */

router.get("/", async function (req, res, next) {
  try {
    const users = await User.findAll();
    return res.json({ users });
  } catch (err) {
    return next(err);
  }
});

/** GET /[username] => { user }
 *
 * Returns { username, firstName, lastName, isAdmin, jobs }
 *
 * Authorization required: admin or same user-as-:username
 **/

router.get(
  "/:username",
  ensureCorrectUserOrAdmin,
  async function (req, res, next) {
    try {
      const user = await User.get(req.params.username);
      return res.json({ user });
    } catch (err) {
      return next(err);
    }
  }
);

/**
 * PATCH /[username] { user } => { user }
 *
 * Data can include:
 * {firstName, lastName, password, email}
 *
 * Returns { username, firstName, lastName, email, isAdmin }
 *
 * Authorization Required: Admin, or same user as username
 */

router.patch(
  "/:username",
  ensureCorrectUserOrAdmin,
  async function (req, res, next) {
    try {
      const validator = jsonschema.validate(req.body, updateUserSchema);
      if (!validator.valid) {
        const errs = validator.errors.map((e) => e.stack);
        throw new BadRequestError(errs);
      }

      const user = await User.update(req.params.username, req.body);
      return res.json({ user });
    } catch (err) {
      return next(err);
    }
  }
);

/**
 * DELETE /[username] => { delete: username }
 *
 * Authorization Required: Admin, or same user as username
 */

router.delete(
  "/:username",
  ensureCorrectUserOrAdmin,
  async function (req, res, next) {
    try {
      await User.remove(req.params.username);
      return res.json({ deleted: req.params.username });
    } catch (err) {
      return next(err);
    }
  }
);

module.exports = router;
