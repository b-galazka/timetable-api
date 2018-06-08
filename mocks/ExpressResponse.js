class ExpressResponse {

    constructor() {

        this.headers = {};
    }

    status() {

        return this;
    }

    send() {

        return this;
    }

    setHeader(name, value) {

        this.headers[name] = value;
    }

    getHeader(name) {

        return this.headers[name];
    }
}

module.exports = ExpressResponse;