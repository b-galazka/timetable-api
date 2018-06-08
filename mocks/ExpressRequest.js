class ExpressRequest {

    constructor({
        headers = {}
    } = {}) {

        this._headers = headers;
    }

    header(headerName) {

        return this._headers[headerName];
    }
}

module.exports = ExpressRequest;