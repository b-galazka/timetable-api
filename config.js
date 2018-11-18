const configureEnv = require('./functions/configureDotenv');

configureEnv();

const { HASH_SECRET, PORT, IP, MONGO_URL, DOMAINS_WHITELIST } = process.env;

module.exports = {

    hashSecret: HASH_SECRET || 'hash secret',
    port: +PORT || 3000,
    ip: IP || '127.0.0.1',
    mongoUrl: MONGO_URL || 'mongodb://localhost/timetable_api',
    domainsWhitelist: DOMAINS_WHITELIST ? DOMAINS_WHITELIST.split(',') : [],

    scraperSelectors: {
        row: '.tabela tr',
        lesson: 'td.l',
        schoolClass: 'span.tytulnapis',
        teacher: 'span.n, span.p + span.p',
        subject: 'span.p',
        classroom: 'span.s',
        hour: '.tabela td.g'
    },

    documentsDownloaderUrls: {
        base: 'http://80-sochaczew.pl/dla_uczniow/plan/',
        list: 'http://80-sochaczew.pl/dla_uczniow/plan/lista.html'
    },

    documentsDownloaderListSelector: 'ul a',

    userUpdateRequestTimeLimit: 3600000
};