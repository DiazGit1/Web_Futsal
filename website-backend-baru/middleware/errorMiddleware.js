const notFound = (req, res, next) => {
  const error = new Error(`Tidak Ditemukan - ${req.originalUrl}`);
  res.status(404);
  next(error);
};

const errorHandler = (err, req, res, next) => {
  let statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  let message = err.message;
  res.status(statusCode).json({
    message,
  });
};

module.exports = { notFound, errorHandler };