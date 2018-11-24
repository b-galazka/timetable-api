exports.findByUsernameAndPassword = (username, password) => {

    return Promise.resolve(
        (username === 'valid_username' && password === 'valid_password') ?
            { username: 'valid_username' } :
            null
    );
};