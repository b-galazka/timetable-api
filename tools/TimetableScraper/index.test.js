const TimetableScraper = require('./');

const testDocs = require('../../mocks/exampleData/scraperTestDocs');
const hoursTestDocs = require('../../mocks/exampleData/scraperHoursTestDocs');
const teachersTestDocs = require('../../mocks/exampleData/scraperTeachersTestDocs');
const classroomsTestDocs = require('../../mocks/exampleData/scraperClassroomsTestDocs');
const schoolClassesTestDocs = require('../../mocks/exampleData/scraperSchoolClassesTestDocs');

const selectors = {
    row: 'tr',
    lesson: 'td.l',
    schoolClass: 'p',
    teacher: 'span.t',
    subject: 'span.s',
    classroom: 'span.c',
    hour: 'td.h'
};

jest.mock('./teachersHashtags', () => ({ '#J1': 'AB', '#J2': 'BC', '#J3': 'CD' }));
jest.mock('./teachersNames', () => ({ BC: 'BC Lastname' }));

describe('TimetableScraper.prototype.getScrappedTimetable', () => {

    it('should return empty timetable if it has not been scrapped', () => {

        const timetableScraper = new TimetableScraper({ selectors });
        const scrappedTimetable = timetableScraper.getScrappedTimetable();

        expect(scrappedTimetable).toEqual({
            teachers: [],
            classrooms: [],
            schoolClasses: [],
            hours: []
        });
    });

    it('should return scrapped timetable', async () => {

        expect.assertions(1);

        const timetableScraper = new TimetableScraper({
            documents: testDocs,
            selectors
        });

        await timetableScraper.scrap();

        const timetableJson = JSON.parse(
            JSON.stringify(timetableScraper.getScrappedTimetable())
        );

        expect(timetableJson).toEqual({
            hours: [{ start: '1:00', end: '2:00' }],
            teachers: [
                {
                    slug: 'AB',
                    name: null,
                    timetable: [
                        [
                            [{ subject: 'math', class: '3ET', classroom: '300' }]
                        ],
                        [],
                        [],
                        [],
                        []
                    ]
                }
            ],
            schoolClasses: [
                {
                    slug: '3ET',
                    timetable: [
                        [
                            [{
                                subject: 'math',
                                teacherSlug: 'AB',
                                teacherName: null,
                                classroom: '300'
                            }]
                        ],
                        [],
                        [],
                        [],
                        []
                    ]
                }
            ],
            classrooms: [
                {
                    number: '300',
                    timetable: [
                        [
                            [{
                                subject: 'math',
                                teacherSlug: 'AB',
                                teacherName: null,
                                class: '3ET'
                            }]
                        ],
                        [],
                        [],
                        [],
                        []
                    ]
                }
            ]
        });
    });
});

describe('TimetableScraper.prototype.scrap', () => {

    it('should return a promise', () => {

        const timetableScraper = new TimetableScraper({
            documents: [],
            selectors
        });

        expect(timetableScraper.scrap()).toBeInstanceOf(Promise);
    });

    it('should scrap all school classes', async () => {

        expect.assertions(1);

        const timetableScraper = new TimetableScraper({
            documents: schoolClassesTestDocs,
            selectors
        });

        await timetableScraper.scrap();

        const schoolClassesJson = JSON.parse(JSON.stringify(timetableScraper.schoolClasses));

        expect(schoolClassesJson).toEqual([

            {
                slug: '3ET',
                timetable: [
                    [
                        [
                            {
                                subject: 'math',
                                teacherSlug: 'AB',
                                teacherName: null,
                                classroom: '300'
                            },
                            {
                                subject: 'PE',
                                teacherSlug: 'BC',
                                teacherName: 'BC Lastname',
                                classroom: '100'
                            }
                        ],
                        [{
                            subject: 'PE',
                            teacherSlug: 'BC',
                            teacherName: 'BC Lastname',
                            classroom: '100'
                        }]
                    ],

                    [],
                    [],
                    [],
                    []
                ]
            },

            {
                slug: '4ET',
                timetable: [
                    [
                        [
                            {
                                subject: 'PE',
                                teacherSlug: 'BC',
                                teacherName: 'BC Lastname',
                                classroom: '100'
                            },
                            {
                                subject: 'math',
                                teacherSlug: 'AB',
                                teacherName: null,
                                classroom: '300'
                            }
                        ],
                        [{
                            subject: 'math',
                            teacherSlug: 'AB',
                            teacherName: null,
                            classroom: '300'
                        }]
                    ],

                    [],
                    [],
                    [],
                    []
                ]
            }
        ]);
    });

    it('should scrap all classrooms', async () => {

        expect.assertions(1);

        const timetableScraper = new TimetableScraper({
            documents: classroomsTestDocs,
            selectors
        });

        await timetableScraper.scrap();

        const classroomsJson = JSON.parse(JSON.stringify(timetableScraper.classrooms));

        expect(classroomsJson).toEqual([

            {
                number: '300',
                timetable: [
                    [
                        [
                            {
                                subject: 'math',
                                teacherSlug: 'AB',
                                teacherName: null,
                                class: '3ET'
                            },
                            {
                                subject: 'PE',
                                teacherSlug: 'BC',
                                teacherName: 'BC Lastname',
                                class: '4ET'
                            }
                        ],
                        [{
                            subject: 'math',
                            teacherSlug: 'AB',
                            teacherName: null,
                            class: '4ET'
                        }]
                    ],

                    [],
                    [],
                    [],
                    []
                ]
            },

            {
                number: '100',
                timetable: [
                    [
                        null,
                        [{
                            subject: 'PE',
                            teacherSlug: 'BC',
                            teacherName: 'BC Lastname',
                            class: '3ET'
                        }]
                    ],

                    [],
                    [],
                    [],
                    []
                ]
            }
        ]);
    });

    it('should scrap all teachers', async () => {

        expect.assertions(1);

        const timetableScraper = new TimetableScraper({
            documents: teachersTestDocs,
            selectors
        });

        await timetableScraper.scrap();

        const teachersJson = JSON.parse(JSON.stringify(timetableScraper.teachers));

        expect(teachersJson).toEqual([

            {
                slug: 'AB',
                name: null,
                timetable: [
                    [
                        [
                            {
                                subject: 'math',
                                class: '3ET',
                                classroom: '300'
                            },
                            {
                                subject: 'PE',
                                class: '4ET',
                                classroom: '300'
                            }
                        ],
                        [{
                            subject: 'math',
                            class: '4ET',
                            classroom: '300'
                        }]
                    ],

                    [],
                    [],
                    [],
                    []
                ]
            },

            {
                slug: 'BC',
                name: 'BC Lastname',
                timetable: [
                    [
                        null,
                        [{
                            subject: 'PE',
                            class: '3ET',
                            classroom: '100'
                        }]
                    ],

                    [],
                    [],
                    [],
                    []
                ]
            },

            {
                slug: 'CD',
                name: null,
                timetable: [
                    [
                        null,
                        null,
                        [{
                            subject: 'PE',
                            class: '3ET',
                            classroom: '100'
                        }],
                        [{
                            subject: 'PE',
                            class: '4ET',
                            classroom: '100'
                        }]
                    ],

                    [],
                    [],
                    [],
                    []
                ]
            },

            {
                slug: 'DE',
                name: null,
                timetable: [
                    [
                        null,
                        null,
                        [{
                            subject: 'PE',
                            class: '4ET',
                            classroom: '100'
                        }],
                        [{
                            subject: 'PE',
                            class: '3ET',
                            classroom: '100'
                        }]
                    ],

                    [],
                    [],
                    [],
                    []
                ]
            }
        ]);
    });

    it('should scrap hours from the longest day', async () => {

        expect.assertions(1);

        const timetableScraper = new TimetableScraper({
            documents: hoursTestDocs,
            selectors
        });

        await timetableScraper.scrap();

        const hoursJson = JSON.parse(JSON.stringify(timetableScraper.hours));

        expect(hoursJson).toEqual([
            { start: '1:00', end: '2:00' },
            { start: '2:00', end: '3:00' }
        ]);
    });

    it('should resolve promise with scrapped timetable', async () => {

        expect.assertions(1);

        const timetableScraper = new TimetableScraper({
            documents: testDocs,
            selectors
        });

        await timetableScraper.scrap();

        const timetableJson = JSON.parse(
            JSON.stringify(timetableScraper.getScrappedTimetable())
        );

        expect(timetableJson).toEqual({
            hours: [{ start: '1:00', end: '2:00' }],
            teachers: [
                {
                    slug: 'AB',
                    name: null,
                    timetable: [
                        [
                            [{ subject: 'math', class: '3ET', classroom: '300' }]
                        ],
                        [],
                        [],
                        [],
                        []
                    ]
                }
            ],
            schoolClasses: [
                {
                    slug: '3ET',
                    timetable: [
                        [
                            [{
                                subject: 'math',
                                teacherSlug: 'AB',
                                teacherName: null,
                                classroom: '300'
                            }]
                        ],
                        [],
                        [],
                        [],
                        []
                    ]
                }
            ],
            classrooms: [
                {
                    number: '300',
                    timetable: [
                        [
                            [{
                                subject: 'math',
                                teacherSlug: 'AB',
                                teacherName: null,
                                class: '3ET'
                            }]
                        ],
                        [],
                        [],
                        [],
                        []
                    ]
                }
            ]
        });
    });
});