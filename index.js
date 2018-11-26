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

const routes = require('./routes');
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
app.use(routes);
app.use(catchUnknownError);

// connect to DB
mongoose.connect(mongoUrl, { useNewUrlParser: true });

if (isDev) {

    mongoose.set('debug', true);
}

// listen for requests
app.listen(port, ip, () => {

    logger.log(`app is listening for requests at ${ip}:${port}`);
});