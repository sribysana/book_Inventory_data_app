const mongoose = require('mongoose');

const Schema = mongoose.Schema;
const AuthorSchema = new Schema({
  name: String,
  rating: Number,
  biography: String,
  avatar: {
    img: {
      data: Buffer,
      contentType: String,
    },
  },
  books: [
    {
      name: String,
      id: String,
    },
  ],
  img: String,
});

module.exports = mongoose.model('Author', AuthorSchema);

// module.exports = AuthorSchema;
