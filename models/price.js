const mongoose = require('mongoose')



const priceSchema = new mongoose.Schema({
    price: Number,
    startDate: Date,
    endDate: Date,
  });

  
module.exports = mongoose.model('Price', priceSchema)