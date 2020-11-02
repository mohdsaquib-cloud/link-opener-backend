const mongoose = require('mongoose')

module.exports = mongoose.connect('mongodb://localhost:/discord',{
    useNewUrlParser:true,
    useUnifiedTopology: true
})