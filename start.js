const mongoose = require('mongoose');
require('dotenv').config({ path: './config/variables.env' });
const debug = require('debug')('myapp');

mongoose.connect(process.env.DATABASE);
mongoose.connection.on('error', (err) => {
  debug(`🗡😢🖍 ${err.message}`);
});

// Import all  models
require('./Model/User');
require('./Model/Post');
require('./Model/Tag');
require('./Model/Like');
// require('./Model/Unlike');
require('./Model/Bookmarks');


// start our app!
const app = require('./app');

app.set('port', process.env.PORT || 7777);
const server = app.listen(app.get('port'), () => {
  debug(`Express running → PORT ${server.address().port}`);
});
