// load .env data into process.env
require('dotenv').config();

// Web server config
const googleKey  = process.env.googleKey;
const PORT       = process.env.PORT || 8080;
const ENV        = process.env.ENV || "development";
const express    = require("express");
const bodyParser = require("body-parser");
const sass       = require("node-sass-middleware");
const app        = express();
const morgan     = require('morgan');
const cookieSession = require('cookie-session');
app.use(cookieSession({
  name: 'session',
  keys: [
    "someRandomreallylongstringidontreallyknowwhatimdoingbutthisseemrightforsomereasonilljustkeepmakingitlongerforawhileandmaybeillstopnow",
    "nextrandomstuffsupposidlythisiswhatimsupposedtodo?whoknowbutletskeepitgoingandillfigureitoutlater"
  ]
}));
// PG database client/connection setup
const { Pool } = require('pg');
const dbParams = require('./lib/db.js');
const db = new Pool(dbParams);
db.connect();

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// Separated Routes for each Resource
// Note: Feel free to replace the example routes below with your own
const usersRoutes = require("./routes/users");
const mapsRoutes = require("./routes/maps");
const pinsRoutes = require("./routes/pins");
const googleRoutes = require("./routes/google");
const favsRoutes = require("./routes/favs");

// Mount all resource routes
// Note: Feel free to replace the example routes below with your own
app.use("/api/users", usersRoutes(db));
app.use("/api/maps", mapsRoutes(db));
app.use("/api/pins", pinsRoutes(db));
app.use("/api/google", googleRoutes(googleKey));
app.use("/api/favs", favsRoutes(db));
// app.use("/api/google", googleRoutes(googleKey));


// Note: mount other resources here, using the same pattern above


// Home page
// Warning: avoid creating more routes in this file!
// Separate them into separate routes files (see above).
app.get("/", (req, res) => {
  if(req.session.user_id){
    db.query(`SELECT username FROM users WHERE id = $1`, [req.session.user_id])
      .then(data => {
       const username = data.rows[0].username;
       const templateVars = {
        user_id: req.session.user_id,
        username
      };

      res.render("index", templateVars);

    })
      .catch(err => {
        res
        .status(500)
        .json({ error: err.message });
    });
  } else{
    const templateVars = {
      user_id: null,
      username: null,
    };

    res.render("index", templateVars);
  }

});

app.get('/login/:id', (req, res) => {
  req.session.user_id = req.params.id;
  console.log(req.session.user_id);
  res.redirect('/');
});


app.get("/logout", (req, res) => {
  req.session = null;
  res.redirect("/");
});

//posts
//login authenticaiton
app.post("/login/form/", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;
    db.query(`SELECT password, id FROM users WHERE username = $1;`,[username])
    .then(data => {
      if(data.rowCount === 0){
        res.redirect('/');
      } else {
        const dbPassword = data.rows[0].password;
        const dbUserId = data.rows[0].id;
         if(password === dbPassword){
        res.redirect(`/login/${dbUserId}`)
      } else {
        res.redirect('/');
      }
    }
    })
    .catch(err => {
      res
          .status(500)
          .json({ error: err.message });
      });
  })
  app.post("/register/form/", (req, res) => {

    const username = req.body.username;
    const password = req.body.password;
    const email = req.body.email;
    console.log(username);
    console.log(password);
      db.query(`INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id;`,[username, email, password])
      .then(data => {
        const userId = data.rows[0].id;
        res.redirect(`/login/${userId}`);
      })
      .catch(err => {
        res
            .status(500)
            .json({ error: err.message });
        });
    })


app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});

