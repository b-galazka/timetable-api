const EventEmitter = require('events');

class Response extends EventEmitter {

    constructor(data, statusCode) {

        super();

        this._data = data;
        this.statusCode = statusCode;
    }

    startSendingData() {

        Array.prototype.forEach.call(this._data, (chunk) => {

            setImmediate(() => this.emit('data', chunk));
        });

        setImmediate(() => this.emit('end'));
    }
}

class Request extends EventEmitter {

    constructor(response) {

        super();

        this._response = response;
    }

    end() {

        if (this._response) {

            this._response.startSendingData();

        } else {

            setImmediate(
                () => this.emit('error', new Error('internal server error'))
            );

        }

        return this;
    }
}

module.exports = {

    get(url, callback) {

        let response;

        if (url !== 'error') {

            const resValue = 'mocked response from server, GET request';

            response = new Response(resValue, (url === 'status error') ? 400 : 200);

            setImmediate(() => callback(response));
        }

        return new Request(response).end();
    }
};