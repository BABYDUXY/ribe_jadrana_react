const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return res.status(401).json({ poruka: "Token nije poslan." });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.TAJNI_KLJUC, (err, decoded) => {
    if (err) {
      return res.status(403).json({ poruka: "Nevažeći token." });
    }

    req.user = decoded;
    next();
  });
};

module.exports = verifyToken;
