// User routes
const log = console.log

const express = require('express');
const router = express.Router(); // Express Router

const { User } = require('../models/user')
const { Admin } = require('../models/admin')
const { ObjectId } = require('mongodb')

// middlewares
const { mongoChecker, isMongoError } = require("./helpers/mongo_helpers");
const { authenticate } = require("./helpers/authentication");

const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();

const cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: 'dsycaqzm4',
    api_key: '114614349513557',
    api_secret: 'ZcThjovRcaxA7dSYMLigWtf2lUc'
});

/*** Login and Logout routes ***/
// A route to login and create a session
router.post('/login', mongoChecker, async (req, res) => {
	const username = req.body.username
    const password = req.body.password

    try {
		const user = await User.findByUsernamePassword(username, password);
		if (!user) {
            res.status(400).send();
        } else {
            req.session.user = user._id;
            res.redirect('/main_page');
        }
    } catch (error) {
    	if (isMongoError(error)) { 
			res.status(500).redirect('/user_login');
		} else {
			res.status(400).send(); //wrong username or password send back to ajax in user_login
		}
    }
})

router.post('/signup', mongoChecker, async (req, res) => {
	const username = req.body.username

    try {
		const user = await User.findByUsername(username);
		if (user) {
			// username already exists
            res.status(400).send('User name already exists')
        } else {
			const newUser = new User({
				username: username,
				password: req.body.password,
				email: req.body.email
			})
            await newUser.save()
			res.send()
		}
	}catch (error) {
    	if (isMongoError(error)) { 
			res.status(500).send('Internal server error');
		} else {
			log(error)
			res.status(400).send('Bad Request');
		}
    }
})

router.put('/forget_password', mongoChecker, async (req, res) => {
	log(req.body)

	const username = req.body.username
	const email = req.body.email

	const filter = {
		username: username
	}
	const update = {
		password: req.body.newPassword
	}

    try {
		const user = await User.findByUsernameEmail(username, email)
		if (!user) {
            res.status(400).send('Username and Email does not match!');
        } else {
			const newUser = await User.findOneAndUpdate(filter, update, {new: true})
            const result = await newUser.save()
			log(result)
			res.send(result)
        }
    } catch (error) {
    	if (isMongoError(error)) { 
			res.status(500).send('Internal server error');
		} else {
			log(error)
			res.status(400).send('Bad Request');
		}
    }
})

// Logout for both user and admin
router.get('/logout', (req, res) => {
	req.session.destroy((error) => {
		if (error) {
			res.status(500).send(error)
		} else {
			res.redirect('/index')
		}
	})
})

router.get('/users/:id', mongoChecker, authenticate, async (req, res) => {
	const id = req.params.id

	if (!ObjectId.isValid(id)) {
		res.status(404).send()
		return;
	}

	try {
		const user = await User.findOne({_id: id})
		if (!user) {
			res.status(404).send('User not found')
		} else {
			res.send(user)
		}
	} catch(error) {
		log(error)
		res.status(500).send('Internal server error')
	}
})

router.get('/currUser', mongoChecker, authenticate, async (req, res) => {
	try {
		const id = req.session.user
		const user = await User.find({_id: id})
		if (!user) {
			res.status(404).send('User not found')
		} else {
			res.send(user)
		}
	} catch(error) {
		log(error)
		res.status(500).send('Internal server error')
	}
})

router.put('/currUser', mongoChecker, authenticate, async (req, res) => {
	const fieldsToUpdate = {}
	for (var key in req.body) {
		fieldsToUpdate[key] = req.body[key]
	}

	try {
		const id = req.session.user
		const user = await User.findOneAndUpdate({_id: id}, {$set: fieldsToUpdate})
		if (!user) {
			res.status(404).send()
		} else {
			res.send(user)
		}
	} catch(error) {
		log(error)
		if (isMongoError(error)) {
			res.status(500).send('Internal server error')
		} else {
			res.status(400).send('Bad request')
		}
	}
})

router.put('/currUserProfileImg', mongoChecker, authenticate, multipartMiddleware, async (req, res) => {
	cloudinary.uploader.upload(
        req.files.image.path,
        async function (result) {
			const fieldsToUpdate = {}
			fieldsToUpdate['profileImageId'] = result.public_id
			fieldsToUpdate['profileImageUrl'] = result.url

			log(fieldsToUpdate)
			try {
				const user = await User.findOneAndUpdate({_id: req.session.user}, {$set: fieldsToUpdate})
				if (!user) {
					res.status(404).send()
				} else {
					res.send(user)
				}
			} catch(error) {
				log(error)
				if (isMongoError(error)) {
					res.status(500).send('Internal server error')
				} else {
					res.status(400).send('Bad request')
				}
			}
        }
    )
})

//get all users in database
router.get('/users', mongoChecker, authenticate, async (req, res) => {
	try {
		const users = await User.find()
		res.send(users)
	} catch(error) {
		log(error)
		res.status(500).send('Internal server error')
	}
})


module.exports = router
