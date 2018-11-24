const isDev = (process.env.NODE_ENV === 'development');
const isProd = (process.env.NODE_ENV === 'production');

const sourceMaps = require('source-map-support');

if (isProd) {

    sourceMaps.install();
}

const express = require('express');
const mongoose = require('mongoose');
const expressGraphql = require('express-graphql');
const logger = require('./utils/logger');

const homeRoutes = require('./routes/home');
const timetableRoutes = require('./routes/timetable');
const teachersRoutes = require('./routes/teachers');
const classesRoutes = require('./routes/classes');
const classroomsRoutes = require('./routes/classrooms');
const hoursRoutes = require('./routes/hours');
const mobileApp = require('./routes/mobileApp');
const notFound = require('./routes/notFound');

const catchJsonParsingError = require('./middlewares/errorsCatchers/catchJsonParsingError');
const setCorsHeaders = require('./middlewares/guards/setCorsHeaders');
const catchCorsError = require('./middlewares/errorsCatchers/catchCorsError');
const catchUnknownError = require('./middlewares/errorsCatchers/catchUnknownError');

const GraphqlSchema = require('./graphql/schema');
const formatGraphqlError = require('./graphql/errors/formatError');

// server configuration file
const { port, ip, mongoUrl } = require('./config');

// start express
const app = express();

// configure express
app.disable('x-powered-by');

app.use(setCorsHeaders);
app.use(catchCorsError);

app.use('/graphql', expressGraphql({
    schema: GraphqlSchema,
    graphiql: isDev,
    formatError: formatGraphqlError
}));

app.use(express.json());
app.use(catchJsonParsingError);

// routes
app.use(homeRoutes);
app.use('/timetable', timetableRoutes);
app.use('/teachers', teachersRoutes);
app.use('/classes', classesRoutes);
app.use('/classrooms', classroomsRoutes);
app.use('/hours', hoursRoutes);
app.use('/mobile-app', mobileApp);
app.use(notFound);

app.use(catchUnknownError);

// connect with DB
mongoose.connect(mongoUrl, { useNewUrlParser: true });

if (isDev) {

    mongoose.set('debug', true);
}

// listen for requests
app.listen(port, ip, () => {

    logger.log(`app is listening for requests at ${ip}:${port}`);
});