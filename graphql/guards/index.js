module.exports = (guards, resolve) => async (parentValue, args, context) => {

    for (const guard of Array.isArray(guards) ? guards : [guards]) {

        await guard(parentValue, args, context);
    }

    return resolve(parentValue, args, context);
};