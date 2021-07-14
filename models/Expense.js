const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({
    item: {
      type: String,
      trim: true,
    },
    amount: {
      type: Number,
    },
    doe: {
      type: Date
    },
  });

module.exports = mongoose.model('Expense', expenseSchema);
