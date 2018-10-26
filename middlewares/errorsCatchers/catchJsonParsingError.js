module.exports = (err, req, res, next) => {

    console.error(err);

    res.status(400).send({
        message: 'invalid JSON format'
    });
};