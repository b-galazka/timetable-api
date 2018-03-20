const TimetableObject = require('./TimetableObject');

class Classroom extends TimetableObject {

    constructor(number) {

        super();

        this.number = number;
    }
}

module.exports = Classroom;