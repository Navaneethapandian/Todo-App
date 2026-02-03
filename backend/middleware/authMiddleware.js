const jwt = require("jsonwebtoken");
const config = require("../config/db");

const authenticateToken = (req, res, next) => {
  const header = req.headers["authorization"];
  if (!header) return res.status(401).json({ error: "No token" });
  const token = header.split(" ")[1] || header ;
  jwt.verify(token, config.jwtSecret, (err, decoded) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.user = { _id: decoded.userId, role: decoded.role };
    next();
  });
};

const authorizeRole = (roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.role) return res.status(403).json({ error: "Forbidden" });
    if (!roles.includes(req.user.role)) return res.status(403).json({ error: "Forbidden" });
    next();
  };
};

module.exports = { authenticateToken, authorizeRole };
