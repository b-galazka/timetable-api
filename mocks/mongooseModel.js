module.exports = () => ({
        
    insertMany(data) {

        return new Promise((resolve, reject) => {

            setImmediate(() => {

                const { collection } = this;

                if (!Array.isArray(data)) {

                    return reject();
                }

                if (!Array.isArray(collection.data)) {

                    collection.data = [];
                }

                this.collection.data.push(...data);

                resolve(data);
            });
        });
    },

    collection: {

        data: null,

        drop(callback) {

            setImmediate(() => {

                this.data = null;

                callback();
            });
        }
    }
});