const errHandler = function (err, req, res, next) {
  if (err) {
    console.log(err.name)
    switch (err.name) {
      case "SequelizeValidationError":
        temporary = [];
        for (let i = 0; i < err.errors.length; i++) {
          temporary.push(err.errors[i].message);
        }
        res.status(400).json({ msg: temporary });
        break;

      case "invalid email/password":
        res.status(401).json({ msg: "invalid email/password" });
        break;

      case "invalid email/password":
        res.status(401).json({ msg: "invalid email/password" });
        break;

      case "SequelizeUniqueConstraintError":
        res.status(401).json({ msg: "Email has been used" });
        break;

      case "Unauthorized":
        res.status(403).json({ msg: "Unauthorized" });
        break;

      case "jwt must be provided":
        res.status(401).json({ msg: "jwt must be provided" });
        break;

      case "Forbidden":
        res.status(403).json({ msg: "Forbidden" });
        break;

      case "SequelizeUniqueConstraintError":
        res.status(400).json({ msg: "SequelizeUniqueConstraintError" });
        break;

      case "SequelizeDatabaseError":
        res.status(400).json({ msg: "SequelizeDatabaseError" });
        break;

      default:
        res.status(500).json({ msg: `Internal Server Error` });
    }
  }
};

module.exports = errHandler;
