/**
 *
 * @param {number} status
 * @param {Error} error
 * @param {express.Request} req
 * @param {express.Response} res
 */
function errorResponse(status, error, req, res) {
  return res.format({
    'application/json': () => res.status(status).json(error),
    default: () => res.status(406).send('Not Acceptable'),
  });
}

const errorController = {
  get: async (req, res) => errorResponse(404, new Error('Not Found'), req, res),
};

exports.errorController = errorController;
exports.errorResponse = errorResponse;
