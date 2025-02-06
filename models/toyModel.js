// toyModel.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const toySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  info: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  img_url: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  user_id: {
    type: String,
    required: true
  }
}, { timestamps: true });

const Toy = mongoose.model('Toy', toySchema);

module.exports = Toy;
