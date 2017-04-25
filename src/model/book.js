const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const bookSchema = new Schema({
  // title: { type: String, required: true },
  title: String,
  description: String,
  tags: Array,
  genres: Array,
  publicationYear: Date,
  publisher: String,
  bookCower: {
    data: Buffer,
    contentType: String,
  },
  price: Number,
  deliveryCharges: Number,
  pages: Number,
  authors: [
    {
      name: { type: String, required: true },
      id: { type: String, required: true },
    },
  ],
  seller: [
    {
      name: { type: String, required: true },
      id: { type: String, required: true },
    },
  ],
  reviews: [
    {
      reviewerName: { type: String },
      reviewerRating: { type: Number },
      reviewerRatingOutof: { type: String, required: true },
      feedback: { type: String, required: false },
      date: { type: Date, default: Date.now() },
    },
  ],
});

module.exports = mongoose.model('Book', bookSchema);
// module.exports = bookSchema;
