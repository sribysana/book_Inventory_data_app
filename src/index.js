const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const logger = require('./utils/logger');
const bookRoutes = require('./routes/bookRoutes');
const authorRoutes = require('./routes/authorRoutes');
const userRoutes = require('./routes/userRoutes');

const app = express();

// const urlencodedParser = bodyParser.urlencoded({ extended: false });

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());

logger.info('App Started');
bookRoutes.init(app);
authorRoutes.init(app);
userRoutes.init(app);
logger.info('-------------------- done ----------------------- ');
app.listen(2020, () => {
  /* eslint-disable no-console */
  console.log('Example app listening on port 2020!');
  /* eslint-enable no-console */
});
