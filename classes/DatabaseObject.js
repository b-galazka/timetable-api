class DatabaseObject {

    static _applyNewData(data, targetObj) {

        Object.keys(data).forEach((key) => {

            const information = data[key];

            if (information !== undefined) {

                targetObj[key] = information;
            }
        });
    }

    _isDataProvided() {

        const { data } = this;

        return Object.values(data).some(value => value !== undefined);
    }
}

module.exports = DatabaseObject;