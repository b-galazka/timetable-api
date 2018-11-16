const _ = require('lodash');

const { scraperSelectors } = require('../../config');

class TimetableScraper {

    constructor({ documents, selectors }) {

        this.documents = documents;
        this.selectors = selectors;

        this.teachers = [];
        this.classrooms = [];
        this.schoolClasses = [];
        this.hours = [];
    }

    scrap() {

        const areDocumentsValid = _.isEqual(
            this.documents,
            ['document1', 'document2']
        );

        const areSelectorsValid = _.isEqual(this.selectors, scraperSelectors);

        if (!areDocumentsValid || !areSelectorsValid) {

            return Promise.reject('Invalid TimetableScraper config has been provided');
        }

        this.teachers = [{}];
        this.classrooms = [{}];
        this.schoolClasses = [{}];
        this.hours = [{}];

        return Promise.resolve(this.getScrappedTimetable());
    }

    getScrappedTimetable() {

        const { teachers, classrooms, schoolClasses, hours } = this;

        return {
            teachers,
            classrooms,
            schoolClasses,
            hours
        };
    }
}

module.exports = TimetableScraper;