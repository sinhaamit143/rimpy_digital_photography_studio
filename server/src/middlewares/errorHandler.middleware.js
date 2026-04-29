const errorHandler = (err, req, res, next) => {
  console.error('Error Stack:', err.stack);

  let status = err.statusCode || 500;
  let message = err.message || 'Internal Server Error';

  // Handle Multer Errors specifically
  if (err.code === 'LIMIT_FILE_SIZE') {
    status = 413;
    message = 'Image is too large. Max size is 5MB.';
  }

  res.status(status).json({
    success: false,
    message,
    // Only show stack in development
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
};

module.exports = errorHandler;
