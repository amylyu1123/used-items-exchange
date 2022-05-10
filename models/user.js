/* User model */
'use strict';

const mongoose = require('mongoose')
const validator = require('validator')
const bcrypt = require('bcryptjs')


// model for a single user
const UserSchema = new mongoose.Schema({
    username: {
        type: String,
		unique: true,
        require: true,
        minlength: 3
    },
	password: {
		type: String,
		required: true,
		minlength: 1
	},
    email: {
		type: String,
		required: true,
		minlength: 1,
		trim: true,
		unique: true,
		validate: {
			validator: validator.isEmail,   // custom validator
			message: 'Not valid email'
		}
	}, 
	status: {
		type: String,
		default: "Active"
	},
	profileImageId: {
		type: String,
		default: 'k59o7jkm2gajqevhdaow'
	},
	profileImageUrl: {
		type: String,
		default: 'http://res.cloudinary.com/dsycaqzm4/image/upload/v1638836806/k59o7jkm2gajqevhdaow.png'
	},
    preferredMethod: {
        type: String,
		default: 'In-person'
    },
    preferredBuilding: {
        type: String,
		default: 'BA'
    }
}, {database: 'blindbox'})

//FindOneAndUpdate not trig isModified condition in pre-save
//Add pre hood for findOneAndUpdate.
//https://stackoverflow.com/questions/44613790/typeerror-this-ismodified-is-not-a-function-mongoose-models-findoneandupdate
UserSchema.pre('findOneAndUpdate', function(next) {
	if (!this._update.password) {
	  return next()
	}
   
	bcrypt.hash(this._update.password, 10, (err, hash) => {
	  if (err) {
		return next(err)
	  }
	  this._update.password = hash
	  next()
	}) 
})

UserSchema.pre('save', function(next) {
	const user = this; // binds this to User document instance
	// checks to ensure we don't hash password more than once
	if (user.isModified('password')) {
		// generate salt and hash the password
		bcrypt.genSalt(10, (err, salt) => {
			bcrypt.hash(user.password, salt, (err, hash) => {
				user.password = hash
				next()
			})
		})
	} else {
		next()
	}
})


UserSchema.statics.findByUsernamePassword = function(username, password) {
	const User = this 

	// First find the user by their username
	return User.findOne({ username: username }).then((user) => {
		if (!user) {
			return Promise.reject()  // a rejected promise
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

// use for check duplicate suernamt when signup
UserSchema.statics.findByUsername = function(username) {
	const User = this 

	// find the user by their username
	return User.findOne({ username: username }).then((user) => {
		if (!user) {
			return null
		}else{
			return user
		}
	})
}

// use for forget password
UserSchema.statics.findByUsernameEmail = function(username, email) {
	const User = this 

	return User.findOne({ username: username, email: email }).then((user) => {
		if (!user) {
			return null
		}	else{
			return user
		}
	})
}

// make a model using the User schema
const User = mongoose.model('User', UserSchema)
module.exports = { User }