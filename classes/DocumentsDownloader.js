const cheerio = require('cheerio');

const request = require('../functions/request');

class DocumentsDownloader {

    constructor({ urls, listSelector }) {

        this.baseUrl = urls.base;
        this.listUrl = urls.list;
        this.listSelector = listSelector;

        this.documents = null;
    }

    download() {

        return (async () => {

            const urls = await this._downloadList();
            const promises = urls.map(url => request(this.baseUrl + url));
            const documents = await Promise.all(promises);

            this.documents = documents;

            return documents;
        })();
    }

    _downloadList() {

        return (async () => {

            const html = await request(this.listUrl);
            const $ = cheerio.load(html);
            const urls = [];

            $(this.listSelector).each((index, elem) => {
                
                urls.push(elem.attribs.href);
            });

            return urls;
        })();
    }
}

module.exports = DocumentsDownloader;