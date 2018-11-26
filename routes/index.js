const router = require('express').Router();

const homeRoutes = require('./home');
const timetableRoutes = require('./timetable');
const teachersRoutes = require('./teachers');
const classesRoutes = require('./classes');
const classroomsRoutes = require('./classrooms');
const hoursRoutes = require('./hours');
const mobileAppRoutes = require('./mobileApp');
const notFoundRoutes = require('./notFound');

router.use(homeRoutes);
router.use('/timetable', timetableRoutes);
router.use('/teachers', teachersRoutes);
router.use('/classes', classesRoutes);
router.use('/classrooms', classroomsRoutes);
router.use('/hours', hoursRoutes);
router.use('/mobile-app', mobileAppRoutes);
router.use(notFoundRoutes);

module.exports = router;