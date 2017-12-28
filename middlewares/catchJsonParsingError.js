module.exports = (err, req, res, next) => {

    if (err) {

        console.error(err);

        return res.status(400).send({
            message: 'invalid JSON format'
        });
    }

    next();
};