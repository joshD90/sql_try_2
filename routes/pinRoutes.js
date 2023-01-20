require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");

const {
  pinTableCreate,
  insertPin,
  pinSearchAll,
  pinSearchParam,
} = require("../queries/pinQueries.js");

//set up the properties for how we will create the connection with the DB
const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: process.env.DBPASSWORD,
  database: "pinSocial",
});

const router = express.Router();

router.get("/", (req, res) => {
  connection.execute(pinSearchAll, (err, result) => {
    if (err) {
      res.status(502).send(err);
      throw err;
    }
    res.status(200).render("searchResult", { results: result });
  });
});

router.post("/", (req, res) => {
  //first create the pins table if there is no table
  connection.execute(pinTableCreate, (err, result) => {
    if (err) {
      res.status(502).send(err);
      throw err;
    }
    //if the table creation was successful then insert the pin
    connection.execute(
      insertPin,
      [req.body.name, req.body.about, req.body.date],
      (error, result) => {
        if (error) {
          res
            .status(502)
            .send("there was a problem creating the new pin" + err);
          throw err;
        }
        //just sending back simple text for the moment
        res
          .status(201)
          .render("welcome", { message: "You successfully created a pin" });
      }
    );
  });
});

router.get("/search", (req, res) => {
  const term = `%${req.query.term}%`;

  connection.execute(pinSearchParam, [term], (err, result) => {
    if (err) {
      res.status(404).render("searchResult", {
        results: ["There was an error with the search"],
      });
      throw err;
    }
    res.status(200).render("searchResult", { results: result });
  });
});

module.exports = router;
