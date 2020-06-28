const express = require('express');
const router  = express.Router();

module.exports = (db) => {
  router.get("/", (req, res) => {
    console.log('im here');
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
  router.get("/:pin_id", (req, res) => {
    const pin_id = req.params.pin_id;
    let query = 'SELECT * FROM pins WHERE id = $1;';
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
  return router;
};
