export default function errorHandler(error, req, res, next) {
  console.error(`[ERROR] ${req.method} ${req.path}:`, error.message, error.details || '');
  const statusCode = error.statusCode || 500;
  res.status(statusCode).json({
    message: error.message || 'Server error',
    details: error.details,
  });
}
