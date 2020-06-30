const express = require('express');
const router = express.Router();


module.exports = (db) => {

  //GET from /api/favs
  router.get("/:map_id", (req, res) => {
   
    console.log(req.params.map_id);
   
    let query = `SELECT count(*) FROM favorites WHERE map_id = $1;`;
    db.query(query, [req.params.map_id])
      .then(data => {
        const favs = data.rows;

        res.json({ favs });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  //POST from /api/favs
  router.post("/post", (req, res) => {
    console.log(req.body.map_id);
    const user = req.session.user_id;
    const inputs = [user, req.body.map_id];
    let query = `INSERT INTO favorites (user_id, map_id) VALUES ($1, $2);`;

    db.query(query, inputs)
      .then(data => {
        const favs = data.rows;
        res.json({ favs });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  return router;
}
