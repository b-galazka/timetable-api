module.exports = (callback) => {

    return async (req, res, next) => {

        try {

            await callback(req, res, next);

        } catch (err) {

            console.error(err);

            if (!res.headersSent) {

                res.status(500).send({ message: 'something went wrong' });
            }
        }
    };
};