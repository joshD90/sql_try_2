require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");
const ejs = require("ejs");

const pinRouter = require("./routes/pinRoutes.js");

const { nameQuery, createTable, insertUser } = require("./queries");

const app = express();
//set up the properties for how we will create the connection with the DB
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.DBPASSWORD,
  database: "pinSocial",
});
//initialize the actual connection
connection.connect((err) => {
  if (err) throw err;
  console.log("Connection made with DB");
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname + "/public"));
app.set("view engine", "ejs");

app.use("/pin", pinRouter);

app.get("/", (req, res) => {
  res.status(200).render("home");
});
//take name input from form
app.post("/", (req, res) => {
  console.log(req.body, "req.body");
  //create our query string
  let sql = createTable("users");
  //make query to db
  connection.query(sql, (err, results) => {
    if (err) {
      res.status(502).send(err);
      throw err;
    }
    console.log(results);
    //on successful creation (if needed) - insert our user
    let insertQuery = insertUser(req.body.name);
    connection.query(insertQuery, (err, result) => {
      if (err) {
        res
          .status(502)
          .send(err + "there was an error with inserting a new user");
      }
      //redirect to /welcome on success
      res.redirect("/welcome/" + req.body.name);
    });
  });
});

//at this end point make query to db for user details
app.get("/welcome/:name", (req, res) => {
  //form our query string
  const sql = nameQuery(req.params.name);
  connection.query(sql, (err, result) => {
    if (err) {
      res.status(502).send(err);
      throw err;
    }
    console.log(result);
    const user = result[0] ? result[0] : "anonymous";

    //return our ejs with result
    res.status(200).render("welcome", {
      user,
      message: "You can add a pin if you like",
    });
  });
});

app.listen(4000, () => {
  console.log("Server is listening on Port 4000");
});
