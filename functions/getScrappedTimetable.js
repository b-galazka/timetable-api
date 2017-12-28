const {
    scraperSelectors,
    documentsDownloaderUrls,
    documentsDownloaderListSelector
} = require('../config');

const TimetableScraper = require('../classes/TimetableScraper');
const DocumentsDownloader = require('../classes/DocumentsDownloader');

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