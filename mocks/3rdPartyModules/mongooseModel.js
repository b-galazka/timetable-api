class MongoCollection {

    constructor() {

        this.data = null;
    }

    drop(callback) {

        setImmediate(() => {

            this.data = null;

            callback();
        });
    }
}

class MongooseModel {

    constructor() {

        this.collection = new MongoCollection();
    }

    insertMany(data) {

        return new Promise((resolve, reject) => {

            setImmediate(() => {

                const { collection } = this;

                if (!Array.isArray(data)) {

                    return reject(new Error());
                }

                if (!Array.isArray(collection.data)) {

                    collection.data = [];
                }

                this.collection.data.push(...data);

                resolve(data);
            });
        });
    }
}

module.exports = () => new MongooseModel();