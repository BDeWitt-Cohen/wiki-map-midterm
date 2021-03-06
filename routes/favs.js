const express = require('express');
const router = express.Router();


module.exports = (db) => {

  //GET from /api/favs
  router.get("/:map_id", (req, res) => {
    const user_id = req.session;
    let query = `SELECT count(*) FROM favorites WHERE map_id = $1;`;
    db.query(query, [req.params.map_id])
      .then(data => {
        const favs = data.rows;

        res.json({ favs, user_id });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });
  router.post("/post/:map_id", (req, res) => {
    const user = req.session.user_id;
    const inputs = [user, req.params.map_id];
    // console.log(req.body.map_id);
    let query = `INSERT INTO favorites (user_id, map_id) VALUES ($1, $2);`;
    db.query(`SELECT user_id FROM maps WHERE id = $1`, [req.params.map_id])
      .then(data => {
        if(data.rows[0].user_id != req.session.user_id) {
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
        }
        console.log('cant like youre own stuff');
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });

  });
  return router;
};

