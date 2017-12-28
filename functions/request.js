const http = require('http');

module.exports = url => (
    new Promise((resolve, reject) => {

        const request = http.get(url, (res) => {
            
            let data = '';

            res.on('data', (chunk) => { data += chunk });
            res.on('end', () => resolve(data));
        });

        request.on('error', err => reject(err));
    })
);