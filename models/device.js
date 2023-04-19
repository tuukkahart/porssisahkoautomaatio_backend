const mongoose = require('mongoose')



const deviceSchema = new mongoose.Schema({
    name: String,
    temp: Number,
    relay: Boolean,
  });

  
module.exports = mongoose.model('Device', deviceSchema)