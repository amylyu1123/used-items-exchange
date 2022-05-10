/* Admin model */
'use strict';

const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')


// model for a admin user
const AdminSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        minlength: 3
    },
	password: {
		type: String,
		required: true,
		minlength: 6
	}
})

AdminSchema.statics.findByUsernamePassword = function(username, password) {
	const admin = this 

	return admin.findOne({ username: username }).then((user) => {
		if (!user) {
			return Promise.reject()
		}
		// if the user exists, make sure their password is correct
		return new Promise((resolve, reject) => {
			bcrypt.compare(password, user.password, (err, result) => {
				if (result) {
					resolve(user)
				} else {
					reject()
				}
			})
		})
	})
}

const Admin = mongoose.model('Admin', AdminSchema)
module.exports = { Admin }