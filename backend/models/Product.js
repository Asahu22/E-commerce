const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  image: {
    type: String,
    required: true
  },
  imageType: {
    type: String,
    default: 'url' // 'url' for file path or 'base64' for base64 encoded
  },
  category: {
    type: String,
    required: false,
    default: 'Uncategorized',
    trim: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Product', productSchema);
