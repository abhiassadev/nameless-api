const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: String,
    position: String,
    social: String,
    photo: String,
});

const User = mongoose.model('user', userSchema);

module.exports = User;