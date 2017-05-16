var mongoose = require('mongoose');

module.exports = mongoose.model('UserLocal',{
	name: String,
	salary: Number
});