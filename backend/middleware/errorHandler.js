const errorHandler = (err, req, res, next) => {
  res.status(err.statusCode || 500).json({
    status: "fail",
    message: err.message || "Internal Server Error",
  });
};

export default errorHandler;
