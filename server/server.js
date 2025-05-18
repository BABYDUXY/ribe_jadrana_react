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

const uploadMainDir = "uploads";
if (!fs.existsSync(uploadMainDir)) {
  fs.mkdirSync(uploadMainDir);
}

const uploadDir = "uploads/javno";
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}
const uploadDir2 = "uploads/privatno";
if (!fs.existsSync(uploadDir2)) {
  fs.mkdirSync(uploadDir2);
}

function generateHash() {
  return crypto.randomBytes(6).toString("hex");
}

const app = express();
app.use(cors());
app.use(express.json());
app.use("/uploads/javno", express.static("uploads/javno"));
app.use("/uploads/privatno", express.static("uploads/privatno"));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/javno/");
  },
  filename: function (req, file, cb) {
    const uniqueName = Date.now() + path.extname(file.originalname);
    cb(null, uniqueName);
  },
});

const storagePrivatno = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/privatno/");
  },
  filename: function (req, file, cb) {
    const unikatnoIme = Date.now() + path.extname(file.originalname);
    cb(null, unikatnoIme);
  },
});
const upload = multer({ storage });
const uploadPrivatno = multer({ storage: storagePrivatno });

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
/* Javne objave */
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
      opis = "nema",
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

    const cleanOpis = opis.trim() === "" ? "nema" : opis;

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
      slika = `/uploads/javno/${req.file.filename}`;
    }

    let stapBrendId, rolaBrendId;

    try {
      /* brend za štap */
      const stapBrendResult = await new Promise((resolve, reject) => {
        db.query(
          "SELECT ID FROM brend WHERE naziv = ?",
          [stap_brend],
          (err, result) => {
            if (err) reject(err);
            resolve(result);
          }
        );
      });

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
        console.log("unesen novi brend stapa id: " + stapBrendId);
      } else {
        stapBrendId = stapBrendResult[0].ID;
        console.log("brend stapa vec postoji id: " + stapBrendId);
      }

      /* brend za rolu */
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
          console.log("unesen novi brend role id: " + rolaBrendId);
        } else {
          rolaBrendId = rolaBrendResult[0].ID;
          console.log("brend role vec postoji id: " + rolaBrendId);
        }
      } else {
        /* ako su isti onda isti id */
        rolaBrendId = stapBrendId;
        console.log("rola i stap imaju isti brend");
      }

      /* MODEL stap */
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
        console.log("model stapa je unesen id: " + stapModelId);
      } else {
        stapModelId = stapModelResult[0].ID;
        console.log("model stapa vec postoji id: " + stapModelId);
      }
      /* MODEL ROLA */

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
        console.log("model role je unesen id: " + rolaModelId);
      } else {
        rolaModelId = rolaModelResult[0].ID;
        console.log("model role vec postoji id: " + rolaModelId);
      }

      /* MODEL mamac */
      let mamacModelId = null;
      const mamacModelResult = await new Promise((resolve, reject) => {
        db.query(
          "SELECT ID FROM model_opreme WHERE naziv = ?",
          [mamac],
          (err, result) => {
            if (err) reject(err);
            resolve(result);
          }
        );
      });

      if (mamacModelResult.length === 0) {
        const insertMamacModel = await new Promise((resolve, reject) => {
          db.query(
            "INSERT INTO model_opreme (tip_id, naziv, brend) VALUES (?, ?, ?)",
            [3, mamac, null],
            (err, result) => {
              if (err) reject(err);
              resolve(result);
            }
          );
        });
        mamacModelId = insertMamacModel.insertId;
        console.log("mamac je unesen id: " + mamacModelId);
      } else {
        mamacModelId = mamacModelResult[0].ID;
        console.log("mamac vec postoji id: " + mamacModelId);
      }

      /* LINK za štap */
      let stapLinkId = null;
      const linkOpremeResult = await new Promise((resolve, reject) => {
        db.query(
          "SELECT ID FROM link_opreme WHERE model_id = ?",
          [stapModelId],
          (err, result) => {
            if (err) reject(err);
            resolve(result);
          }
        );
      });

      if (linkOpremeResult.length === 0) {
        const insertStapLink = await new Promise((resolve, reject) => {
          db.query(
            "INSERT INTO link_opreme (model_id, link) VALUES (?, ?)",
            [stapModelId, "#"],
            (err, result) => {
              if (err) reject(err);
              resolve(result);
            }
          );
        });
        stapLinkId = insertStapLink.insertId;
        console.log("link za stap je unesen id: " + stapLinkId);
      } else {
        stapLinkId = linkOpremeResult.map((row) => row.ID);
        console.log("Postojeci Linkovi za štap su:" + stapLinkId);
      }
      /* LINK za rolu */
      let rolaLinkId = null;
      const linkOpremeResultRola = await new Promise((resolve, reject) => {
        db.query(
          "SELECT ID FROM link_opreme WHERE model_id = ?",
          [rolaModelId],
          (err, result) => {
            if (err) reject(err);
            resolve(result);
          }
        );
      });

      if (linkOpremeResultRola.length === 0) {
        const insertRolaLink = await new Promise((resolve, reject) => {
          db.query(
            "INSERT INTO link_opreme (model_id, link) VALUES (?, ?)",
            [rolaModelId, "#"],
            (err, result) => {
              if (err) reject(err);
              resolve(result);
            }
          );
        });
        rolaLinkId = insertRolaLink.insertId;
        console.log("link za rolu je unesen id: " + rolaLinkId);
      } else {
        rolaLinkId = linkOpremeResultRola.map((row) => row.ID);
        console.log("Postojeci Linkovi za Rolu su:" + rolaLinkId);
      }

      /* LINK za mamac */
      let mamacLinkId = null;
      const linkOpremeResultMamac = await new Promise((resolve, reject) => {
        db.query(
          "SELECT ID FROM link_opreme WHERE model_id = ?",
          [mamacModelId],
          (err, result) => {
            if (err) reject(err);
            resolve(result);
          }
        );
      });

      if (linkOpremeResultMamac.length === 0) {
        const insertMamaclink = await new Promise((resolve, reject) => {
          db.query(
            "INSERT INTO link_opreme (model_id, link) VALUES (?, ?)",
            [mamacModelId, "#"],
            (err, result) => {
              if (err) reject(err);
              resolve(result);
            }
          );
        });
        mamacLinkId = insertMamaclink.insertId;
        console.log("Link za mamac je unesen id:" + mamacLinkId);
      } else {
        mamacLinkId = linkOpremeResultMamac.map((row) => row.ID);
        console.log("Postojeci Linkovi za Mamac su:" + mamacLinkId);
      }

      /* Unos ulova */
      let ulovId = null;
      const insertUlov = await new Promise((resolve, reject) => {
        const now = new Date();
        db.query(
          "INSERT INTO ulov (korisnik_id, riba_id, tezina, slika_direktorij, datum_ulova, mjesto, hash) VALUES (?, ?, ?, ?, ?, ?, ?)",
          [id, riba, tezina, slika, now, mjesto, hash],
          (err, result) => {
            if (err) reject(err);
            resolve(result);
          }
        );
      });
      ulovId = insertUlov.insertId;
      console.log("ULOV uspiješno unesen ID: " + ulovId);

      /* unos Objave */

      const insertObjava = await new Promise((resolve, reject) => {
        db.query(
          "INSERT INTO objava (ulov_id, sadrzaj, korisnik_id, hash, status) VALUES (?, ?, ?, ?, ?)",
          [ulovId, cleanOpis, id, hash, "pending"],
          (err, result) => {
            if (err) reject(err);
            resolve(result);
          }
        );
      });

      const opremaLinkIds = [stapLinkId, rolaLinkId, mamacLinkId];
      const insertOpremauUlovu = await Promise.all(
        opremaLinkIds.map((opremaId) => {
          return new Promise((resolve, reject) => {
            db.query(
              "INSERT INTO oprema_u_ulovu (oprema_id, ulov_id) VALUES (?, ?)",
              [opremaId, ulovId],
              (err, result) => {
                if (err) return reject(err);
                resolve(result);
              }
            );
          });
        })
      );
      console.log("Objvava uspješno dodana - javna");
      return res
        .status(201)
        .json({ poruka: "Objava uspješno dodana.", hash: hash });
    } catch (err) {
      console.error("Greška pri dodavanju objave:", err);
      return res.status(500).json({ poruka: "Greška na serveru." });
    }
  }
);

/* Privatne objave */
app.post(
  "/api/objava/privatno",
  verifyToken,
  uploadPrivatno.single("slika"),
  async (req, res) => {
    const {
      riba,
      tezina,
      stap_brend,
      stap_model,
      rola_brend,
      rola_model,
      mamac,
      opis = "nema",
      mjesto,
      datum,
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
      mjesto,
      datum
    );

    const cleanOpis = opis.trim() === "" ? "nema" : opis;

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
      slika = `/uploads/privatno/${req.file.filename}`;
    }

    let stapBrendId, rolaBrendId;

    try {
      /* brend za štap */
      const stapBrendResult = await new Promise((resolve, reject) => {
        db.query(
          "SELECT ID FROM brend WHERE naziv = ?",
          [stap_brend],
          (err, result) => {
            if (err) reject(err);
            resolve(result);
          }
        );
      });

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
        console.log("unesen novi brend stapa id: " + stapBrendId);
      } else {
        stapBrendId = stapBrendResult[0].ID;
        console.log("brend stapa vec postoji id: " + stapBrendId);
      }

      /* brend za rolu */
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
          console.log("unesen novi brend role id: " + rolaBrendId);
        } else {
          rolaBrendId = rolaBrendResult[0].ID;
          console.log("brend role vec postoji id: " + rolaBrendId);
        }
      } else {
        /* ako su isti onda isti id */
        rolaBrendId = stapBrendId;
        console.log("rola i stap imaju isti brend");
      }

      /* MODEL stap */
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
        console.log("model stapa je unesen id: " + stapModelId);
      } else {
        stapModelId = stapModelResult[0].ID;
        console.log("model stapa vec postoji id: " + stapModelId);
      }
      /* MODEL ROLA */

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
        console.log("model role je unesen id: " + rolaModelId);
      } else {
        rolaModelId = rolaModelResult[0].ID;
        console.log("model role vec postoji id: " + rolaModelId);
      }

      /* MODEL mamac */
      let mamacModelId = null;
      const mamacModelResult = await new Promise((resolve, reject) => {
        db.query(
          "SELECT ID FROM model_opreme WHERE naziv = ?",
          [mamac],
          (err, result) => {
            if (err) reject(err);
            resolve(result);
          }
        );
      });

      if (mamacModelResult.length === 0) {
        const insertMamacModel = await new Promise((resolve, reject) => {
          db.query(
            "INSERT INTO model_opreme (tip_id, naziv, brend) VALUES (?, ?, ?)",
            [3, mamac, null],
            (err, result) => {
              if (err) reject(err);
              resolve(result);
            }
          );
        });
        mamacModelId = insertMamacModel.insertId;
        console.log("mamac je unesen id: " + mamacModelId);
      } else {
        mamacModelId = mamacModelResult[0].ID;
        console.log("mamac vec postoji id: " + mamacModelId);
      }

      /* LINK za štap */
      let stapLinkId = null;
      const linkOpremeResult = await new Promise((resolve, reject) => {
        db.query(
          "SELECT ID FROM link_opreme WHERE model_id = ?",
          [stapModelId],
          (err, result) => {
            if (err) reject(err);
            resolve(result);
          }
        );
      });

      if (linkOpremeResult.length === 0) {
        const insertStapLink = await new Promise((resolve, reject) => {
          db.query(
            "INSERT INTO link_opreme (model_id, link) VALUES (?, ?)",
            [stapModelId, "#"],
            (err, result) => {
              if (err) reject(err);
              resolve(result);
            }
          );
        });
        stapLinkId = insertStapLink.insertId;
        console.log("link za stap je unesen id: " + stapLinkId);
      } else {
        stapLinkId = linkOpremeResult[0].ID;
        console.log("Postojeci Linkovi za štap su:" + stapLinkId);
      }
      /* LINK za rolu */
      let rolaLinkId = null;
      const linkOpremeResultRola = await new Promise((resolve, reject) => {
        db.query(
          "SELECT ID FROM link_opreme WHERE model_id = ?",
          [rolaModelId],
          (err, result) => {
            if (err) reject(err);
            resolve(result);
          }
        );
      });

      if (linkOpremeResultRola.length === 0) {
        const insertRolaLink = await new Promise((resolve, reject) => {
          db.query(
            "INSERT INTO link_opreme (model_id, link) VALUES (?, ?)",
            [rolaModelId, "#"],
            (err, result) => {
              if (err) reject(err);
              resolve(result);
            }
          );
        });
        rolaLinkId = insertRolaLink.insertId;
        console.log("link za rolu je unesen id: " + rolaLinkId);
      } else {
        rolaLinkId = linkOpremeResultRola[0].ID;
        console.log("Postojeci Linkovi za Rolu su:" + rolaLinkId);
      }

      /* LINK za mamac */
      let mamacLinkId = null;
      const linkOpremeResultMamac = await new Promise((resolve, reject) => {
        db.query(
          "SELECT ID FROM link_opreme WHERE model_id = ?",
          [mamacModelId],
          (err, result) => {
            if (err) reject(err);
            resolve(result);
          }
        );
      });

      if (linkOpremeResultMamac.length === 0) {
        const insertMamaclink = await new Promise((resolve, reject) => {
          db.query(
            "INSERT INTO link_opreme (model_id, link) VALUES (?, ?)",
            [mamacModelId, "#"],
            (err, result) => {
              if (err) reject(err);
              resolve(result);
            }
          );
        });
        mamacLinkId = insertMamaclink.insertId;
        console.log("Link za mamac je unesen id:" + mamacLinkId);
      } else {
        mamacLinkId = linkOpremeResultMamac[0].ID;
        console.log("Postojeci Linkovi za Mamac su:" + mamacLinkId);
      }

      /* Unos ulova */
      let ulovId = null;
      const insertUlov = await new Promise((resolve, reject) => {
        db.query(
          "INSERT INTO ulov (korisnik_id, riba_id, tezina, opis, slika_direktorij, datum_ulova, mjesto, hash) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
          [id, riba, tezina, cleanOpis, slika, datum, mjesto, hash],
          (err, result) => {
            if (err) reject(err);
            resolve(result);
          }
        );
      });
      ulovId = insertUlov.insertId;
      console.log("ulov unesen. id: " + ulovId);

      const opremaLinkIds = [stapLinkId, rolaLinkId, mamacLinkId];
      const insertOpremauUlovu = await Promise.all(
        opremaLinkIds.map((opremaId) => {
          return new Promise((resolve, reject) => {
            db.query(
              "INSERT INTO oprema_u_ulovu (oprema_id, ulov_id) VALUES (?, ?)",
              [opremaId, ulovId],
              (err, result) => {
                if (err) return reject(err);
                resolve(result);
              }
            );
          });
        })
      );

      console.log("Sve je uspješno uneseno - privatna objava ");

      return res
        .status(201)
        .json({ poruka: "Objava uspješno dodana.", hash: hash });
    } catch (err) {
      console.error("Greška pri dodavanju objave:", err);
      return res.status(500).json({ poruka: "Greška na serveru." });
    }
  }
);
/* dohvaćanje javnih objava */
app.get("/objave/ulovi", (req, res) => {
  const sql = `
  SELECT 
  objava.ID,
  objava.hash,
  objava.status,
  objava.datum_kreiranja,
  objava.naslov,
  objava.sadrzaj AS opis_objave,

  korisnik.korisnicko_ime AS autor,

  ulov.tezina,
  ulov.slika_direktorij,
  ulov.mjesto,
  ulov.opis AS opis_ulova,

  riba.ime AS ime_ribe,

  -- Oprema samo ako postoji ulov
  GROUP_CONCAT(DISTINCT brend.naziv) AS brend,
  GROUP_CONCAT(DISTINCT tip_opreme.naziv) AS tip,
  GROUP_CONCAT(DISTINCT model_opreme.naziv) AS model,
  GROUP_CONCAT(DISTINCT link_opreme.link) AS link,
  GROUP_CONCAT(DISTINCT CONCAT(brend.naziv, ' ', model_opreme.naziv)) AS kombinirani_model,
  GROUP_CONCAT(DISTINCT CASE 
      WHEN model_opreme.tip_id = 3 AND model_opreme.brend IS NULL THEN model_opreme.naziv 
  END) AS mamac,

  -- Lajkovi i dislajkovi
  (SELECT COUNT(*) FROM ocjena_objave WHERE ocjena_objave.objava_id = objava.ID AND ocjena_objave.pozitivno = 1) AS broj_lajkova,
  (SELECT COUNT(*) FROM ocjena_objave WHERE ocjena_objave.objava_id = objava.ID AND ocjena_objave.pozitivno = 0) AS broj_dislajkova,

  -- Komentari
  GROUP_CONCAT(DISTINCT CONCAT(komentator.korisnicko_ime, ': ', komentar_u_objavi.tekst)) AS komentari

FROM objava

LEFT JOIN ulov ON objava.ulov_id = ulov.ID
LEFT JOIN korisnik ON COALESCE(ulov.korisnik_id, objava.korisnik_id) = korisnik.ID
LEFT JOIN riba ON ulov.riba_id = riba.ID

LEFT JOIN oprema_u_ulovu ON oprema_u_ulovu.ulov_id = ulov.ID
LEFT JOIN link_opreme ON oprema_u_ulovu.oprema_id = link_opreme.ID
LEFT JOIN model_opreme ON link_opreme.model_id = model_opreme.ID
LEFT JOIN tip_opreme ON model_opreme.tip_id = tip_opreme.ID
LEFT JOIN brend ON model_opreme.brend = brend.ID

LEFT JOIN komentar_u_objavi ON komentar_u_objavi.objava_id = objava.ID
LEFT JOIN korisnik AS komentator ON komentar_u_objavi.korisnik_id = komentator.ID

GROUP BY objava.ID
ORDER BY objava.datum_kreiranja DESC;`;

  db.query(sql, (err, data) => {
    if (err) return res.json(err);

    const structuredData = data.map((row) => ({
      ...row,
      brend: row.brend ? row.brend.split(",") : [],
      tip: row.tip ? row.tip.split(",") : [],
      model: row.model ? row.model.split(",") : [],
      link: row.link ? row.link.split(",") : [],
      komentari: row.komentari
        ? row.komentari.split(",").map((k) => {
            const [korisnicko_ime, ...tekst] = k.split(": ");
            return {
              korisnicko_ime: korisnicko_ime?.trim(),
              tekst: tekst.join(": ").trim(),
            };
          })
        : [],
      kombinirani_model: row.kombinirani_model
        ? row.kombinirani_model.split(",")
        : [],
    }));

    return res.json(structuredData);
  });
});

/* Privatni ulovi */

app.get("/privatni/ulovi", (req, res) => {
  const sql = `
  SELECT 
  ulov.ID AS ulov_id,
  ulov.tezina,
  ulov.slika_direktorij,
  ulov.mjesto,
  ulov.opis AS opis_ulova,
  ulov.datum_ulova AS datum_kreiranja,

  korisnik.korisnicko_ime AS autor,
  
  riba.ime AS ime_ribe,

  GROUP_CONCAT(DISTINCT brend.naziv) AS brend,
  GROUP_CONCAT(DISTINCT tip_opreme.naziv) AS tip,
  GROUP_CONCAT(DISTINCT model_opreme.naziv) AS model,
  GROUP_CONCAT(DISTINCT link_opreme.link) AS link,
  GROUP_CONCAT(DISTINCT CONCAT(brend.naziv, ' ', model_opreme.naziv)) AS kombinirani_model,
  GROUP_CONCAT(DISTINCT CASE 
      WHEN model_opreme.tip_id = 3 AND model_opreme.brend IS NULL THEN model_opreme.naziv 
  END) AS mamac

FROM ulov

LEFT JOIN korisnik ON ulov.korisnik_id = korisnik.ID
LEFT JOIN riba ON ulov.riba_id = riba.ID

LEFT JOIN oprema_u_ulovu ON oprema_u_ulovu.ulov_id = ulov.ID
LEFT JOIN link_opreme ON oprema_u_ulovu.oprema_id = link_opreme.ID
LEFT JOIN model_opreme ON link_opreme.model_id = model_opreme.ID
LEFT JOIN tip_opreme ON model_opreme.tip_id = tip_opreme.ID
LEFT JOIN brend ON model_opreme.brend = brend.ID

WHERE ulov.opis IS NOT NULL

GROUP BY ulov.ID
ORDER BY ulov.datum_ulova DESC;
;
`;

  db.query(sql, (err, data) => {
    if (err) return res.json(err);

    const structuredData = data.map((row) => ({
      ...row,
      brend: row.brend ? row.brend.split(",") : [],
      tip: row.tip ? row.tip.split(",") : [],
      model: row.model ? row.model.split(",") : [],
      link: row.link ? row.link.split(",") : [],
      komentari: row.komentari
        ? row.komentari.split(",").map((k) => {
            const [korisnicko_ime, ...tekst] = k.split(": ");
            return {
              korisnicko_ime: korisnicko_ime?.trim(),
              tekst: tekst.join(": ").trim(),
            };
          })
        : [],
      kombinirani_model: row.kombinirani_model
        ? row.kombinirani_model.split(",")
        : [],
    }));

    return res.json(structuredData);
  });
});

/* MOJa sviđanja */

app.get("/objave/mojasvidanja", verifyToken, async (req, res) => {
  const userInfo = req.user;
  const id = userInfo.korisnik_id;
  const sql = `
  SELECT 
  objava.ID,
  objava.hash,
  objava.status,
  objava.datum_kreiranja,
  objava.naslov,
  objava.sadrzaj AS opis_objave,

  korisnik.korisnicko_ime AS autor,

  ulov.tezina,
  ulov.slika_direktorij,
  ulov.mjesto,
  ulov.opis AS opis_ulova,

  riba.ime AS ime_ribe,

  -- Oprema samo ako postoji ulov
  GROUP_CONCAT(DISTINCT brend.naziv) AS brend,
  GROUP_CONCAT(DISTINCT tip_opreme.naziv) AS tip,
  GROUP_CONCAT(DISTINCT model_opreme.naziv) AS model,
  GROUP_CONCAT(DISTINCT link_opreme.link) AS link,
  GROUP_CONCAT(DISTINCT CONCAT(brend.naziv, ' ', model_opreme.naziv)) AS kombinirani_model,
  GROUP_CONCAT(DISTINCT CASE 
      WHEN model_opreme.tip_id = 3 AND model_opreme.brend IS NULL THEN model_opreme.naziv 
  END) AS mamac,

  -- Lajkovi i dislajkovi
  (SELECT COUNT(*) FROM ocjena_objave WHERE ocjena_objave.objava_id = objava.ID AND ocjena_objave.pozitivno = 1) AS broj_lajkova,
  (SELECT COUNT(*) FROM ocjena_objave WHERE ocjena_objave.objava_id = objava.ID AND ocjena_objave.pozitivno = 0) AS broj_dislajkova,

  -- Komentari
  GROUP_CONCAT(DISTINCT CONCAT(komentator.korisnicko_ime, ': ', komentar_u_objavi.tekst)) AS komentari

FROM objava

-- JOIN samo one objave koje je korisnik lajkao
INNER JOIN ocjena_objave ON ocjena_objave.objava_id = objava.ID 
  AND ocjena_objave.pozitivno = 1 
  AND ocjena_objave.korisnik_id = ?

LEFT JOIN ulov ON objava.ulov_id = ulov.ID
LEFT JOIN korisnik ON COALESCE(ulov.korisnik_id, objava.korisnik_id) = korisnik.ID
LEFT JOIN riba ON ulov.riba_id = riba.ID

LEFT JOIN oprema_u_ulovu ON oprema_u_ulovu.ulov_id = ulov.ID
LEFT JOIN link_opreme ON oprema_u_ulovu.oprema_id = link_opreme.ID
LEFT JOIN model_opreme ON link_opreme.model_id = model_opreme.ID
LEFT JOIN tip_opreme ON model_opreme.tip_id = tip_opreme.ID
LEFT JOIN brend ON model_opreme.brend = brend.ID

LEFT JOIN komentar_u_objavi ON komentar_u_objavi.objava_id = objava.ID
LEFT JOIN korisnik AS komentator ON komentar_u_objavi.korisnik_id = komentator.ID

GROUP BY objava.ID
ORDER BY objava.datum_kreiranja DESC;

`;

  db.query(sql, [id], (err, data) => {
    if (err) return res.json(err);

    const structuredData = data.map((row) => ({
      ...row,
      brend: row.brend ? row.brend.split(",") : [],
      tip: row.tip ? row.tip.split(",") : [],
      model: row.model ? row.model.split(",") : [],
      link: row.link ? row.link.split(",") : [],
      komentari: row.komentari
        ? row.komentari.split(",").map((k) => {
            const [korisnicko_ime, ...tekst] = k.split(": ");
            return {
              korisnicko_ime: korisnicko_ime?.trim(),
              tekst: tekst.join(": ").trim(),
            };
          })
        : [],
      kombinirani_model: row.kombinirani_model
        ? row.kombinirani_model.split(",")
        : [],
    }));

    return res.json(structuredData);
  });
});
/* --------- ocjenjivanje objave --------------- */
app.post("/api/ocjene", verifyToken, async (req, res) => {
  const { objava_id, pozitivno } = req.body;
  const userInfo = req.user;
  const id = userInfo.korisnik_id;
  console.log(objava_id, pozitivno);

  db.query(
    "SELECT pozitivno FROM ocjena_objave WHERE objava_id = ? AND korisnik_id = ?",
    [objava_id, id],
    (err, rows) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ poruka: "Greška u bazi." });
      }

      if (rows.length === 0) {
        db.query(
          "INSERT INTO ocjena_objave (objava_id, korisnik_id, pozitivno) VALUES (?, ?, ?)",
          [objava_id, id, pozitivno],
          (err2) => {
            if (err2) {
              console.error(err2);
              return res
                .status(500)
                .json({ poruka: "Neuspješno dodana reakcija." });
            }

            res.status(201).json({ poruka: "Ocjena dodana." });
            console.log("ocjena dodana");
          }
        );
      } else {
        console.log("ocjena već postoji");
        res.status(409).json({ poruka: "Ocjena već postoji." });
      }
    }
  );
});

app.put("/api/ocjene", verifyToken, async (req, res) => {
  const { objava_id, pozitivno } = req.body;
  const userInfo = req.user;
  const id = userInfo.korisnik_id;

  try {
    const result = await db.query(
      "UPDATE ocjena_objave SET pozitivno = ? WHERE korisnik_id = ? AND objava_id = ?",
      [pozitivno, id, objava_id]
    );

    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ poruka: "greška, reakcija nije pronađena" });
    }

    res.json({ poruka: "Ocjena updateana." });
    console.log("ocjena promijenjena");
  } catch (err) {
    console.error(err);
    res.status(500).json({ poruka: "Neuspješan fetch." });
  }
});

app.delete("/api/ocjene", verifyToken, async (req, res) => {
  const { objava_id } = req.body;
  const userInfo = req.user;
  const id = userInfo.korisnik_id;

  try {
    const result = await db.query(
      "DELETE FROM ocjena_objave WHERE korisnik_id = ? AND objava_id = ?",
      [id, objava_id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ poruka: "nije pronađena reakcija" });
    }

    res.json({ poruka: "ocjena maknuta." });
    console.log("ocjena obrisana");
  } catch (err) {
    console.error(err);
    res.status(500).json({ poruka: "Neuspješno brisanje" });
  }
});

app.get("/api/ocjene/:objava_id", verifyToken, async (req, res) => {
  const { objava_id } = req.params;
  const userInfo = req.user;
  const id = userInfo.korisnik_id;

  const sql =
    "SELECT pozitivno FROM ocjena_objave WHERE objava_id = ? AND korisnik_id = ? ";
  db.query(sql, [objava_id, id], (err, data) => {
    if (err) return res.json(err);
    if (data.length === 0) {
      return res.json({ reaction: null });
    }

    const pozitivno = data[0].pozitivno;
    if (pozitivno === 1) return res.json({ reaction: true });
    if (pozitivno === 0) return res.json({ reaction: false });
    return res.json({ reaction: null });
  });
});

app.post("/api/komentar", verifyToken, async (req, res) => {
  const { objava_id, tekst } = req.body;
  const userInfo = req.user;
  const id = userInfo.korisnik_id;

  if (!tekst || tekst.trim() === "") {
    return res.json({ poruka: "Molimo upišite komentar!" });
  }

  const sql = `
    INSERT INTO komentar_u_objavi (objava_id, korisnik_id, tekst)
    VALUES (?, ?, ?)
  `;

  db.query(sql, [objava_id, id, tekst], (err, result) => {
    if (err) {
      console.error("Greška prilikom dodavanja komentara:", err);
      return res.status(500).json({ poruka: "Greška na serveru." });
    }

    if (result.affectedRows > 0) {
      return res.json({ poruka: "Uspješno dodan komentar!" });
    } else {
      return res.status(400).json({ poruka: "Komentar nije dodan." });
    }
  });
});

app.listen(5000, () => {
  console.log("server je pokrenut na portu 5000");
});
