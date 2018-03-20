const TimetableObject = require('./TimetableObject');

class Teacher extends TimetableObject {

    constructor(slug, name = null) {

        super();

        this.slug = slug.trim();
        this.name = name && name.trim();
    }
}

module.exports = Teacher;