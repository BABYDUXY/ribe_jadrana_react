const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
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
  const sql = "SELECT * FROM riba";
  db.query(sql,(err,data)=>{
    if (err) return res.json(err);
    return res.json(data);
  })

})

app.get("/plave", (req, res) => {
  const sql = "SELECT * FROM riba WHERE vrsta = 'plava' ";
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get("/bijele", (req, res) => {
  const sql = "SELECT * FROM riba WHERE vrsta = 'bijela' ";
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});

app.get("/otrovne", (req, res) => {
  const sql = "SELECT * FROM riba WHERE otrovna = 1";
  db.query(sql, (err, data) => {
    if (err) return res.json(err);
    return res.json(data);
  });
});
/* REGISTRACIJA KORISNIKA U SUSTAV */
app.post("/api/registracija", async (req, res) => {
  const podaci = req.body;
  console.log("podaci");
  console.log("Primljeni podaci s frontenda:", podaci);

  /* Verficiramo jesu li sva polja unesena */
  if (!podaci["1"] || !podaci["2"] || !podaci["3"] || !podaci["4"]) {
    return res.status(400).json({ poruka: "Sva polja su obavezna." });
  }

  const korisnicko_ime = podaci["1"];
  const email = podaci["2"];
  const lozinka = podaci["3"];

  const provjera = `
    SELECT * FROM korisnik WHERE korisnicko_ime = ? OR email = ?
  `;

  /* Počinjemo sa try fetch blokom */
  try {
    const rezultatProvjere = await new Promise((resolve, reject) => {
      db.query(provjera, [korisnicko_ime, email], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

    if (rezultatProvjere.length > 0) {
      return res
        .status(400)
        .json({ poruka: "Korisničko ime ili email već postoji." });
    }

    /* SOL I HASHIRANJE */
    const saltRounds = 6;
    const sol = await bcrypt.genSalt(saltRounds);
    const lozinka_hash = await bcrypt.hash(lozinka, sol);

    const sql =
      "INSERT INTO korisnik (korisnicko_ime, email, lozinka_hash, sol) VALUES(?, ?, ?, ?)";

    /* Ubacujemo korisnika u bazu */
    const rezultat = await new Promise((resolve, reject) => {
      db.query(
        sql,
        [korisnicko_ime, email, lozinka_hash, sol],
        (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        }
      );
    });
    console.log("Uspješno dodan korisnik, ID:", rezultat.insertId);
    return res.status(201).json({ poruka: "Registracija uspješna!" });
  } catch (err) {
    console.error("Greška kod registracije:", err);
    return res.status(500).json({ poruka: "Greška kod registracije" });
  }
});

app.listen(5000, () => {
  console.log("server je pokrenut na portu 5000");
});
