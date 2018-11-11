const {
    scraperSelectors,
    documentsDownloaderUrls,
    documentsDownloaderListSelector
} = require('../config');

const TimetableScraper = require('../tools/TimetableScraper');
const DocumentsDownloader = require('../tools/DocumentsDownloader');

// TODO: add tests
module.exports = async () => {

    const downloader = new DocumentsDownloader({
        urls: documentsDownloaderUrls,
        listSelector: documentsDownloaderListSelector
    });

    const documents = await downloader.download();

    const timetableScraper = new TimetableScraper({
        documents,
        selectors: scraperSelectors
    });

    return await timetableScraper.scrap();
};