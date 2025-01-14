const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());
// importing enviromental variables
const host = process.env.HOST;
const user = process.env.USER;
const password = process.env.PASSWORD;
const database = process.env.DATABASE;

console.log(host);

const db = mysql.createConnection({
  host: host,
  user: user,
  password: password,
  database: database,
});

// prettier-ignore
app.get("/", (req, res) => {
  const sql = "SELECT * FROM ribe";
  db.query(sql,(err,data)=>{
    if (err) return res.json(err);
    return res.json(data);
  })

})

app.get("/plave", (req, res) => {
  const sql = "SELECT * FROM ribe WHERE vrsta = 'plava' ";
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get("/bijele", (req, res) => {
  const sql = "SELECT * FROM ribe WHERE vrsta = 'bijela' ";
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get("/tezinaASC", (req, res) => {
  const sql = "SELECT * FROM ribe ORDER BY max_tezina";
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get("/tezinaDESC", (req, res) => {
  const sql = "SELECT * FROM ribe ORDER BY max_tezina DESC";
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get("/otrovne", (req, res) => {
  const sql = "SELECT * FROM ribe WHERE otrovna = 1";
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get("/broj", (req, res) => {
  const sql = "SELECT COUNT(ID) FROM ribe";
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.listen(5000, () => {
  console.log("server je pokrenut na portu 5000");
});
