module.exports = (db) => {
  router.get("/", (req, res) => {
    let query = `SELECT * FROM favorites;`;
    db.query(query)
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





  
}