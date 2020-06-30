// https://maps.googleapis.com/maps/api/js?key=${process.env.googleKey}&libraries=places&callback=initMap
const express = require('express');
const router  = express.Router();

module.exports = (googleKey) => {
  console.log(googleKey);
  router.get("/", (req, res) => {
    const result = {
      key: googleKey,
    };
    res.json(result);
  });
};
