const errorHandler = (error, req, res, next) => {
  switch (error.name) {
    case "Not Found":
      res.status(error.code).json({ message: error.message });
      break;
    default:
      res.status(500).json({ message: "Internal server error" });
      break;
  }
};
module.exports = errorHandler;
