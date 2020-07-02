/*
 * All routes for Users are defined here
 * Since this file is loaded in server.js into api/users,
 *   these routes are mounted onto /users
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    db.query(`SELECT * FROM users;`)
    .then(data => {
      const users = data.rows;
      res.json({ users });
    })
    .catch(err => {
      res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.get("/:user_id", (req, res) => {
    const user_id = req.params.user_id;
    db.query(`SELECT * FROM users WHERE id = $1;`, [user_id])
    .then(data => {
      const users = data.rows;
      res.json({ users });
    })
    .catch(err => {
      res
          .status(500)
          .json({ error: err.message });
      });
  });
  router.get("/:username/:password", (req, res) => {
    username = req.params.username
    password = req.params.password
    db.query(`SELECT * FROM users, password WHERE username = $1;`,[])
    .then(data => {
      const users = data.rows;
      res.json({ users });
    })
    .catch(err => {
      res
          .status(500)
          .json({ error: err.message });
      });
  })
  return router;
};
