module.exports = resolve => async (...params) => {

    try {

        return await resolve(...params);

    } catch (err) {

        console.error(err);

        throw new Error('something went wrong');
    }
};