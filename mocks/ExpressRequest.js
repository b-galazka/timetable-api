class ExpressRequest {

    constructor({
        headers = {},
        body = {}
    } = {}) {

        this.headers = headers;
        this.body = body;
    }

    header(headerName) {

        return this.headers[headerName];
    }
}

module.exports = ExpressRequest;