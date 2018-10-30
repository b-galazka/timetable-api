module.exports = (guards, resolve) => async (...params) => {

    for (const guard of Array.isArray(guards) ? guards : [guards]) {

        await guard(...params);
    }

    return resolve(...params);
};