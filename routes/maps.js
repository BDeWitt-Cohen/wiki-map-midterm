/*
 * All routes for Widgets are defined here
 * Since this file is loaded in server.js into api/widgets,
 *   these routes are mounted onto /widgets
 * See: https://expressjs.com/en/guide/using-middleware.html#middleware.router
 */

const express = require('express');
const router  = express.Router();
//Populates all maps
module.exports = (db) => {
  router.get("/", (req, res) => {
    let query = `SELECT * FROM maps;`;
    db.query(query)
      .then(data => {
        const maps = data.rows;
        res.json({ maps});
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  //Inserts new map
  router.post("/post", (req, res) => {
    //for now user is always user 1
    const user = req.session.user_id;
    const inputs = [user, req.body.mapName, req.body.mapDesc]
    console.log(inputs);
    let query = `INSERT INTO maps (user_id, title, description) VALUES ($1, $2, $3);`;
    db.query(query, inputs)
      .then(data => {
        const maps = data.rows;
        res.json({ maps });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  //gets all logged in users maps
  router.get("/user_id", (req, res) => {
    let query = `SELECT * FROM maps WHERE user_id = $1;`;
    db.query(query, [req.session.user_id])
      .then(data => {
        const maps = data.rows;
        res.json({ maps });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.get("/:maps_id", (req, res) => {

    let query = `SELECT * FROM maps WHERE id = $1;`;
    db.query(query, [req.params.maps_id])
      .then(data => {
        const maps = data.rows;
        res.json({ maps });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
};
