const errorHandler = (error, req, res, next) => {
  switch (error.name) {
    case "Unauthorized":
      res.status(error.code).json({ message: error.message });
      break;
    case "JsonWebTokenerroror":
      res.status(401).json({ message: error.message });
      break;
    case "Not Found":
      res.status(error.code).json({ message: error.message });
      break;
    case "Forbidden":
      res.status(error.code).json({ message: error.message });
      break;
    case "Bad Request":
      res.status(error.code).json({ message: error.message });
      break;
    default:
      res.status(500).json({ message: "Internal server error" });
      break;
  }
};

module.exports = errorHandler;
