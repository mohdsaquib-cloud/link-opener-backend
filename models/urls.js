const mongoose = require('mongoose')

const urlsScheme = new mongoose.Schema({
    url:{
        type:[String],
    },    
})
module.exports = mongoose.model('Urls',urlsScheme)
