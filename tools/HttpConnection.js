const http = require('http');

class HttpConnection {

    static get(url) {

        return new Promise((resolve, reject) => {

            const request = http.get(url, (res) => {

                let data = '';

                const { statusCode } = res;

                if (statusCode >= 400) {

                    const err = new Error(`method: GET, URL: ${url}, status code: ${statusCode}`);

                    return reject(err);
                }

                res.on('data', (chunk) => { data += chunk; });
                res.on('end', () => resolve(data));
            });

            request.on('error', err => reject(err));
        });
    }
}

module.exports = HttpConnection;