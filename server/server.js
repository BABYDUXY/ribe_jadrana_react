const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const dotenv = require("dotenv");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const verifyToken = require("./middleware/verifyToken");
const crypto = require("crypto");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

dotenv.config();

const uploadDir = "uploads_javno";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

function generateHash() {
  return crypto.randomBytes(6).toString("hex");
}

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads_javno", express.static("uploads_javno"));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads_javno/");
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});
const upload = multer({ storage });

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
  const sql = "SELECT * FROM riba ORDER BY ime ASC;";
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
      {
        korisnik_id: korisnik.ID,
        korisnicko_ime: korisnik.korisnicko_ime,
        email: korisnik.email,
        datum_kreiranja: korisnik.datum_kreiranja,
      },
      tajni_token, // Tajni ključ za potpis tokena
      { expiresIn: "2h" } // Trajanje tokena
    );

    // Šaljemo token + podatke
    return res.status(200).json({
      poruka: "Prijava uspješna!",
      token,
    });
  } catch (err) {
    console.error("Greška kod prijave:", err);
    return res.status(500).json({ poruka: "Greška kod prijave." });
  }
});

app.put("/api/korisnik/update", verifyToken, async (req, res) => {
  const { korisnicko_ime } = req.body;
  const userInfo = req.user;
  const email = userInfo.email;
  console.log("email: ", email, "user:", korisnicko_ime);

  if (!email || !korisnicko_ime) {
    return res.status(400).json({ poruka: "Nedostaju podaci." });
  }

  try {
    const sql = "UPDATE korisnik SET korisnicko_ime = ? WHERE email = ?";
    db.query(sql, [korisnicko_ime, email], (err, result) => {
      if (err) {
        console.error("Greška kod upita:", err);
        return res.status(500).json({ poruka: "Greška na serveru." });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({ poruka: "Korisnik nije pronađen." });
      }
      return res
        .status(200)
        .json({ poruka: "Korisničko ime ažurirano uspješno." });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ poruka: "Greška na serveru." });
  }
});

/* -------------------------Objave ------------------------------------- */
app.post("/api/objava/tekst", verifyToken, async (req, res) => {
  const { naslov, sadrzaj } = req.body;
  const userInfo = req.user;
  const id = userInfo.korisnik_id;

  if (!sadrzaj || !naslov) {
    return res.status(400).json({ poruka: "Nedostaju obavezna polja." });
  }
  const hash = generateHash();

  const sql = `
    INSERT INTO objava (naslov, sadrzaj, korisnik_id, hash, status)
    VALUES (?, ?, ?, ?, 'pending')
  `;

  try {
    const rezultat = await new Promise((resolve, reject) => {
      db.query(sql, [naslov, sadrzaj, id, hash], (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });

    console.log("Objava dodana, ID:", rezultat.insertId);
    return res
      .status(201)
      .json({ poruka: "Objava uspješno dodana.", hash: hash });
  } catch (err) {
    console.error("Greška pri dodavanju objave:", err);
    return res.status(500).json({ poruka: "Greška na serveru." });
  }
});

app.post(
  "/api/objava/javno",
  verifyToken,
  upload.single("slika"),
  async (req, res) => {
    const {
      riba,
      tezina,
      stap_brend,
      stap_model,
      rola_brend,
      rola_model,
      mamac,
      opis,
      mjesto,
    } = req.body;
    const userInfo = req.user;
    const id = userInfo.korisnik_id;
    console.log(
      riba,
      tezina,
      stap_brend,
      stap_model,
      rola_brend,
      rola_model,
      mamac,
      opis,
      mjesto
    );

    if (
      !riba ||
      !tezina ||
      !stap_brend ||
      !stap_model ||
      !rola_brend ||
      !rola_model ||
      !mamac ||
      !mjesto
    ) {
      return res.status(400).json({ poruka: "Nisu sva polja popunjena." });
    }
    const hash = generateHash();

    let slika = null;
    if (req.file) {
      slika = `/uploads_javno/${req.file.filename}`;
    }

    let stapBrendId, rolaBrendId;

    try {
      // Check if stap_brend exists
      const stapBrendResult = await new Promise((resolve, reject) => {
        db.query(
          "SELECT ID FROM brend WHERE naziv = ?",
          [stap_brend],
          (err, result) => {
            if (err) reject(err);
            resolve(result);
            console.log("uspijesno provjeren brend");
          }
        );
      });
      console.log("2");

      if (stapBrendResult.length === 0) {
        // Insert new brand for stap_brend
        const insertStapBrend = await new Promise((resolve, reject) => {
          db.query(
            "INSERT INTO brend (naziv) VALUES (?)",
            [stap_brend],
            (err, result) => {
              if (err) reject(err);
              resolve(result);
            }
          );
        });
        stapBrendId = insertStapBrend.insertId;
      } else {
        stapBrendId = stapBrendResult[0].ID;
      }

      // Check if rola_brend exists
      if (stap_brend !== rola_brend) {
        const rolaBrendResult = await new Promise((resolve, reject) => {
          db.query(
            "SELECT ID FROM brend WHERE naziv = ?",
            [rola_brend],
            (err, result) => {
              if (err) reject(err);
              resolve(result);
            }
          );
        });

        if (rolaBrendResult.length === 0) {
          // Insert new brand for rola_brend
          const insertRolaBrend = await new Promise((resolve, reject) => {
            db.query(
              "INSERT INTO brend (naziv) VALUES (?)",
              [rola_brend],
              (err, result) => {
                if (err) reject(err);
                resolve(result);
              }
            );
          });
          rolaBrendId = insertRolaBrend.insertId;
        } else {
          rolaBrendId = rolaBrendResult[0].ID;
        }
      } else {
        // If stap_brend and rola_brend are the same, use the same ID
        rolaBrendId = stapBrendId;
      }

      // Check if the stap_model already exists in the model_opreme table for this brand
      let stapModelId = null;
      const stapModelResult = await new Promise((resolve, reject) => {
        db.query(
          "SELECT ID FROM model_opreme WHERE naziv = ? AND brend = ?",
          [stap_model, stapBrendId],
          (err, result) => {
            if (err) reject(err);
            resolve(result);
          }
        );
      });

      if (stapModelResult.length === 0) {
        // Insert stap_model if it doesn't exist
        const insertStapModel = await new Promise((resolve, reject) => {
          db.query(
            "INSERT INTO model_opreme (tip_id, naziv, brend) VALUES (?, ?, ?)",
            [1, stap_model, stapBrendId],
            (err, result) => {
              if (err) reject(err);
              resolve(result);
            }
          );
        });
        stapModelId = insertStapModel.insertId;
      } else {
        stapModelId = stapModelResult[0].ID;
      }

      // Check if the rola_model already exists in the model_opreme table for this brand
      let rolaModelId = null;
      const rolaModelResult = await new Promise((resolve, reject) => {
        db.query(
          "SELECT ID FROM model_opreme WHERE naziv = ? AND brend = ?",
          [rola_model, rolaBrendId],
          (err, result) => {
            if (err) reject(err);
            resolve(result);
          }
        );
      });

      if (rolaModelResult.length === 0) {
        // Insert rola_model if it doesn't exist
        const insertRolaModel = await new Promise((resolve, reject) => {
          db.query(
            "INSERT INTO model_opreme (tip_id, naziv, brend) VALUES (?, ?, ?)",
            [2, rola_model, rolaBrendId],
            (err, result) => {
              if (err) reject(err);
              resolve(result);
            }
          );
        });
        rolaModelId = insertRolaModel.insertId;
      } else {
        rolaModelId = rolaModelResult[0].ID;
      }

      // If everything is inserted correctly, insert into objava
      /*  const sql = `
      INSERT INTO objava (naslov, sadrzaj, korisnik_id, hash, status, slika)
      VALUES (?, ?, ?, ?, 'pending', ?)
    `;

      const rezultat = await new Promise((resolve, reject) => {
        db.query(sql, [naslov, sadrzaj, id, hash, slika], (err, result) => {
          if (err) {
            reject(err);
          } else {
            resolve(result);
          }
        });
      }); */

      /* console.log("Objava dodana, ID:", rezultat.insertId); */
      return res
        .status(201)
        .json({ poruka: "Objava uspješno dodana.", hash: hash });
    } catch (err) {
      console.error("Greška pri dodavanju objave:", err);
      return res.status(500).json({ poruka: "Greška na serveru." });
    }
  }
);

app.listen(5000, () => {
  console.log("server je pokrenut na portu 5000");
});
