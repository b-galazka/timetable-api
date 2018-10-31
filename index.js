const express = require('express');
const mongoose = require('mongoose');
const expressGraphql = require('express-graphql');

const homeRoutes = require('./routes/home');
const updatingRoutes = require('./routes/update');
const teachersRoutes = require('./routes/teachers');
const classesRoutes = require('./routes/classes');
const classroomsRoutes = require('./routes/classrooms');
const hoursRoutes = require('./routes/hours');
const mobileApp = require('./routes/mobileApp');
const notFound = require('./routes/notFound');

const catchJsonParsingError = require('./middlewares/errorsCatchers/catchJsonParsingError');
const setCorsHeaders = require('./middlewares/guards/setCorsHeaders');
const catchCorsError = require('./middlewares/errorsCatchers/catchCorsError');

const GraphqlSchema = require('./graphql/schema');

//server configuration file
const { port, ip, mongoUrl } = require('./config');
const isDev = (process.env.NODE_ENV === 'development');

//start express
const app = express();

//configure express
app.disable('x-powered-by');

app.use(setCorsHeaders);
app.use(catchCorsError);

app.use('/graphql', expressGraphql({
    schema: GraphqlSchema,
    graphiql: isDev
}));

app.use(express.json());
app.use(catchJsonParsingError);

//routes
app.use(homeRoutes);
app.use('/', updatingRoutes);
app.use('/teachers', teachersRoutes);
app.use('/classes', classesRoutes);
app.use('/classrooms', classroomsRoutes);
app.use('/hours', hoursRoutes);
app.use('/mobile-app', mobileApp);
app.use(notFound);

//connect with DB
mongoose.connect(mongoUrl, { useNewUrlParser: true });

if (isDev) {

    mongoose.set('debug', true);
}

//listen for requests
app.listen(port, ip, () => {

    console.log(`app is listening for requests at ${ip}:${port}`);
});