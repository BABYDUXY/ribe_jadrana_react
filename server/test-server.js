// app.js (Vaš test-server.js kod)
const express = require("express");
const cors = require("cors");
const mysql = require("mysql");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createPool({
  connectionLimit: 15,
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  acquireTimeout: 60000,
  timeout: 60000,
  reconnect: true,
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
    if (err) {
      console.error("Database error (GET /plave):", err);
      return res.json(err);
    }
    return res.json(data);
  });
});

app.get("/bijele", (req, res) => {
  const sql = "SELECT * FROM riba WHERE vrsta = 'bijela' ";
  db.query(sql, (err, data) => {
    if (err) {
      console.error("Database error (GET /bijele):", err);
      return res.json(err);
    }
    return res.json(data);
  });
});

app.get("/otrovne", (req, res) => {
  const sql = "SELECT * FROM riba WHERE otrovna = 1";
  db.query(sql, (err, data) => {
    if (err) {
      console.error("Database error (GET /otrovne):", err);
      return res.json(err);
    }
    return res.json(data);
  });
});

app.get("/objave/ulovi", (req, res) => {
  const sql = `
  SELECT 
  objava.ID,
  objava.hash,
  objava.status,
  objava.datum_kreiranja,
  objava.naslov,
  objava.sadrzaj AS opis,

  korisnik.korisnicko_ime AS autor,

  ulov.tezina,
  ulov.slika_direktorij,
  ulov.mjesto,

 riba.ID AS id_ribe,
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

const PORT = process.env.PORT || 3001;

if (require.main === module) {
  app.listen(PORT, async () => {
    console.log(`Server sluša na http://localhost:${PORT}`);
  });
}
module.exports = app;
