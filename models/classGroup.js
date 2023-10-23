const mongoose = require('mongoose');

const classGroupSchema = new mongoose.Schema({
  className: {
    type: String,
    required: true,
    unique: true
  },
  students: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]
});

module.exports = mongoose.model('ClassGroup', classGroupSchema);
