const TimetableObject = require('./TimetableObject');

class SchoolClass extends TimetableObject {

    constructor(slug) {

        super();

        this.slug = slug;
    }
}

module.exports = SchoolClass;