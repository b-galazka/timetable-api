const TimetableObject = require('./TimetableObject');

class Teacher extends TimetableObject {

    // name cannot be undefined, because this object is sent as JSON
    constructor(slug, name = null) {

        super();

        this.slug = slug.trim();
        this.name = name && name.trim();
    }
}

module.exports = Teacher;