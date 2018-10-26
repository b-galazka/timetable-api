class HttpConnection {

    static get(url) {

        return new Promise((resolve, reject) => {

            setImmediate(() => {

                if (url === 'domain/docs_list') {

                    resolve(`
                        <a href="doc1"></a>
                        <a href="doc2"></a>
                        <a href="doc3"></a>
                        <a href="doc4"></a>
                        <a href="doc5"></a>
                    `);

                } else if (url.startsWith('domain/doc')) {

                    resolve(url + ' document');
                }
            });
        });
    }
}

module.exports = HttpConnection;