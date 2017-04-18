const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const UserSchema = new Schema({
  name: String,
  password: String,
  cart: [
    {
      id: String,
      count: Number,
    },
  ],
});

module.exports = mongoose.model('User', UserSchema);
// module.exports = UserSchema;
