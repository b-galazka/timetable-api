class ExpressRequest {

    constructor({
        headers = {},
        body = {}
    } = {}) {

        this._headers = headers;
        this.body = body;
    }

    header(headerName) {

        return this._headers[headerName];
    }
}

module.exports = ExpressRequest;