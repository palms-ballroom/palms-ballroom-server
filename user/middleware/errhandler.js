const errHandler = function (err, req, res, next) {
  if (err.code === "API_VALIDATION_ERROR") {
    res.status(400).json({ msg: "Error Validating API" });
  }
  switch (err.name) {
    case "SequelizeValidationError":
      temporary = [];
      for (let i = 0; i < err.errors.length; i++) {
        temporary.push(err.errors[i].message);
      }
      res.status(400).json({ msg: temporary });
      break;

    case "invalid email/password":
      res.status(400).json({ msg: "invalid email/password" });
      break;

    case "Transaction id not found":
      res.status(404).json({ msg: "Transaction id not found" });
      break;

    case "SequelizeUniqueConstraintError":
      res.status(400).json({ msg: "Email has been used" });
      break;
    
    case "Payment Fail":
      res.status(400).json({ msg: "Payment Fail" });
      break;

    case "Hotel Id not found":
      res.status(404).json({ msg: "Hotel Id not found" });
      break;

    case "jwt must be provided":
      res.status(401).json({ msg: "jwt must be provided" });
      break;

    case "Forbidden":
      res.status(403).json({ msg: "Forbidden" });
      break;

    case "SequelizeDatabaseError":
      res.status(400).json({ msg: "SequelizeDatabaseError" });
      break;

    default:
      res.status(500).json({ msg: `Internal Server Error` });
  }
};

module.exports = errHandler;
