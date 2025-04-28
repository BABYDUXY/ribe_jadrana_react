const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
// importing enviromental variables
const host = process.env.HOST;
const user = process.env.USER;
const password = process.env.PASSWORD;
const database = process.env.DATABASE;
const tajni_token = process.env.TAJNI_KLJUC;

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
  const honeypot = podaci["ime"];

  if (honeypot) {
    console.log("Bot detektiran! [Honeypot polje je popunjeno]");
    return res.status(400).json({ poruka: "Neuspješna registracija [BOT]!" });
  }
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

/* PRIJAVA */
app.post("/api/prijava", async (req, res) => {
  const podaci = req.body;

  const honeypot = podaci["ime"];
  console.log(podaci);

  if (honeypot) {
    console.log("Bot detektiran! [Honeypot polje je popunjeno]");
    return res.status(400).json({ poruka: "Neuspješna Prijava [BOT]!" });
  }

  if (!podaci["1"] || !podaci["2"]) {
    return res.status(400).json({ poruka: "Email i lozinka su obavezni." });
  }

  try {
    const sql = "SELECT * FROM korisnik WHERE email = ?";
    const korisnici = await new Promise((resolve, reject) => {
      db.query(sql, podaci["1"], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });

    if (korisnici.length === 0) {
      return res.status(401).json({ poruka: "Neispravni podaci za prijavu." });
    }

    const korisnik = korisnici[0];

    /* LOZINKA CHECK */
    const ispravnaLozinka = await bcrypt.compare(
      podaci["2"],
      korisnik.lozinka_hash
    );

    if (!ispravnaLozinka) {
      return res.status(401).json({ poruka: "Neispravni podaci za prijavu." });
    }

    const token = jwt.sign(
      { id: korisnik.id, korisnicko_ime: korisnik.korisnicko_ime },
      tajni_token, // Tajni ključ za potpis tokena
      { expiresIn: "2h" } // Trajanje tokena
    );

    // Šaljemo token + podatke
    return res.status(200).json({
      poruka: "Prijava uspješna!",
      token,
      korisnicko_ime: korisnik.korisnicko_ime,
    });
  } catch (err) {
    console.error("Greška kod prijave:", err);
    return res.status(500).json({ poruka: "Greška kod prijave." });
  }
});

app.listen(5000, () => {
  console.log("server je pokrenut na portu 5000");
});
