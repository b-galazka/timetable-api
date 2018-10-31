module.exports = (validMethods) => {

    return (req, res) => {

        res.status(405).send({
            message: 'method not allowed',
            allowedMethods: Array.isArray(validMethods) ? validMethods.join(', ') : validMethods
        });
    };
};