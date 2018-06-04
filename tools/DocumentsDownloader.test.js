const DocumentsDownloader = require('./DocumentsDownloader');

jest.mock('./HttpConnection', () => require('../mocks/HttpConnection'));

describe('DocumentsDownloader.prototype.download', () => {

    let downloader;

    beforeEach(() => {

        downloader = new DocumentsDownloader({
            urls: { base: 'domain/', list: 'domain/docs_list' },
            listSelector: 'a'
        });
    });

    it('should return a promise', () => {

        expect(downloader.download()).toBeInstanceOf(Promise);
    });

    it('should resolve a promise with downloaded documents', async () => {

        expect.assertions(1);

        const result = await downloader.download();
        
        expect(result).toEqual([
            'domain/doc1 document',
            'domain/doc2 document',
            'domain/doc3 document',
            'domain/doc4 document',
            'domain/doc5 document'
        ]);
    });
});