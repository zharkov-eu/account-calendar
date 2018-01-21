const errors = require('../error');

function errorController(error, req, res) {
  if (error instanceof errors.RequiredPropsError) {
    return res.status(400).json({
      message: error.message,
      type: 'RequiredPropsError',
    });
  } else if (error instanceof errors.EntityNotFoundError) {
    return res.status(404).json({
      message: error.message,
      type: 'EntityNotFoundError',
    });
  }
  return res.status(500).json({
    message: 'Internal Server Error',
    type: 'UnknownError',
  });
}

module.exports = errorController;
