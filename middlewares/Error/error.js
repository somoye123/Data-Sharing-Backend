import winston from 'winston';

const sendErrorDev = (err, req, res) => {
  winston.error(err.message, err);

  res.status(err.statusCode).json({
    error: err,
    message: err.message,
    stack: err.stack,
  });
};

const sendErrorProd = (err, req, res) => {
  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(err.statusCode).json({
      message: err.message,
    });
  } else {
    // Programming or other unknown error: don't leak error details
    winston.error(err.message, err);
    console.log(
      '🔥🔥🔥🔥🔥______________LOGGING ERROR_______________________🔥🔥🔥🔥🔥🔥',
      { err }
    );
    res.status(500).json({
      status: 'error',
      message: 'Oops! Something went very wrong.',
    });
  }
};

export default (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  } else {
    sendErrorProd(err, req, res);
  }
};
