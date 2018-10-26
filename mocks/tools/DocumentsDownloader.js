const {
    documentsDownloaderUrls,
    documentsDownloaderListSelector
} = require('../../config');

class DocumentsDownloader {

    constructor({ urls, listSelector }) {

        this.baseUrl = urls.base;
        this.listUrl = urls.list;
        this.listSelector = listSelector;
    }

    download() {

        if (
            this.baseUrl === documentsDownloaderUrls.base &&
            this.listUrl === documentsDownloaderUrls.list &&
            this.listSelector === documentsDownloaderListSelector
        ) {

            return Promise.resolve([ 'document1', 'document2' ]);
        }

        console.error('Invalid DocumentsDownloader config has been provided');
    }
}

module.exports = DocumentsDownloader;