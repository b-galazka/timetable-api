module.exports = (err) => ({
    message: err.message,
    statusCode: err.originalError && err.originalError.statusCode,
    locations: err.locations,
    path: err.path
});