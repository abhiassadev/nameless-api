const mongoose = require('mongoose');

const galleriesSchema = new mongoose.Schema({
    name: String,
    image: String,
    date: String,
});

const Galleries = mongoose.model('galleries', galleriesSchema);

module.exports = Galleries;