const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    let query = `SELECT * FROM pins;`;
    db.query(query)
      .then(data => {
        const pins = data.rows;
        res.json({ pins });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });

  });

  //returns all pins for a specific map
  router.get("/:pin_id", (req, res) => {
    const pin_id = req.params.pin_id;
    let query = 'SELECT * FROM pins WHERE map_id = $1;';
    db.query(query, [pin_id])
      .then(data => {
        const pins = data.rows;
        res.json({ pins });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });

  });


  router.post("/post", (req, res) => {
    const user = req.session.user_id;
    const mapId = req.body.newMapId;
    const name = req.body.pinTitle;
    const inputs = [user, mapId, req.body.firstPinlong, req.body.firstPinlat, name]
    let query = `INSERT INTO pins (user_id, map_id, long, lat, name) VALUES ($1, $2, $3, $4, $5);`;
    db.query(query, inputs)
      .then(data => {
        console.log(data);
        const pins = data.rows;
        res.json({ pins, mapId });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.post("/post/:map_id", (req, res) => {
    const user = req.session.user_id;
    const mapId = req.params.map_id;
    const name = req.body.pinTitle;
    const desc = req.body.newSpotDesc
    const inputs = [user, mapId, req.body.firstPinlong, req.body.firstPinlat, name, desc];
    let query = `INSERT INTO pins (user_id, map_id, long, lat, name, description) VALUES ($1, $2, $3, $4, $5, $6);`;
    db.query(query, inputs)
      .then(data => {
        console.log(data);
        const pins = data.rows;
        res.json({ pins, mapId });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });



  return router;
};
