jest.setTimeout(30000);

const mongoose = require('mongoose');
const keys = require('../config/keys');
// require user model so mongoose knows user collection exists
require('../models/User');

mongoose.Promise = global.Promise;
mongoose.connect(keys.mongoURI, { useNewUrlParser: true });
