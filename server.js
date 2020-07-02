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
const bcrypt = require('bcrypt');
app.use(cookieSession({
  name: 'session',
  keys: [
    "someRandomreallylongstringidontreallyknowwhatimdoingbutthisseemrightforsomereasonilljustkeepmakingitlongerforawhileandmaybeillstopnow",
    "nextrandomstuffsupposidlythisiswhatimsupposedtodo?whoknowbutletskeepitgoingandillfigureitoutlater"
  ]
}));

const saltRounds = 10;

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
        res.status(403).send('must provide a valid email and or password <a href="/"> to go back</a>');
      } else {
        const dbPassword = data.rows[0].password;
        const dbUserId = data.rows[0].id;

        bcrypt.compare(password, dbPassword, function(err, result) {
          if (result) {
            req.session.user_id = dbUserId;
            console.log(req.session.user_id);
            res.redirect('/');
          } else {
            res.status(403).send('must provide a valid email and or password <a href="/"> to go back</a>');
          }
        });
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
    const hashedPassword = bcrypt.hashSync(password, saltRounds)
    const email = req.body.email;
    if(!email || !password || !username ){
      res.status(403).send('Slow down there buckaroo, please fill out all the fields <a href="/"> to go back</a>');
    } else {
      db.query(`INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id;`,[username, email, hashedPassword])
      .then(data => {
        const userId = data.rows[0].id;
        req.session.user_id = userId;
        res.redirect('/');
      })
      .catch(err => {
          res.status(403).send('account with that username already exists <a href="/"> to go back</a>');
        });

    }
    })
app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});


