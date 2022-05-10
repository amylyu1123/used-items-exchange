// Admin routes
const log = console.log

const express = require('express');
const router = express.Router(); // Express Router

const { User } = require('../models/user')
const { Admin } = require('../models/admin')
const { ObjectID } = require('mongodb')

// middlewares
const { mongoChecker, isMongoError } = require("./helpers/mongo_helpers");
const { sessionChecker, authenticate } = require('./helpers/authentication');

let temp

// a GET route to get all users from the database
router.get('/user', mongoChecker, authenticate, async (req, res) => {
	try {
		const user = await User.find()
		res.send(user)
	} catch(error) {
		log(error)
		res.status(500).send("Internal Server Error")
	}
})

// a GET route to get one user from the database
router.get('/user/:name', mongoChecker, authenticate, async (req, res) => {
	const name = req.params.name

	try {
		const user = await User.findOne({username: name})
		temp = user
		res.send({user})
	} catch(error) {
		log(error)
		res.status(500).send("Internal Server Error")
	}
})

// a GET route to get one user from the database
router.get('/detail', mongoChecker, authenticate, async (req, res) => {

	try {
		if (!temp){
			res.status(400).send('User is not exists')
		} else{
			res.send({temp})
		}
	} catch(error) {
		log(error)
		res.status(500).send("Internal Server Error")
	}
})

// a PATCH route to update the infos of a user
router.patch('/update/:id', mongoChecker, authenticate, async (req, res) => {
	const id = req.params.id

	const fieldsToUpdate = {}
	for (var key in req.body) {
		fieldsToUpdate[key] = req.body[key]
	}

	try {
		const name = fieldsToUpdate.username
		if (name){
			const check = await User.findOne({username: name})
			if (check){
				if (id != check._id){
					res.status(400)
				}
			}
		}
		const user = await User.findOneAndUpdate({_id: id}, {$set:fieldsToUpdate}, {new: true, useFindAndModify: false})
		res.send({user})

	} catch(error) {
		log(error)
		res.status(500).send("Internal Server Error")
	}
})

// a DELETE route to remove a user by their id.
router.delete('/user/:id', mongoChecker, authenticate, async (req, res) => {
	const id = req.params.id

	try {
		const user = await User.findByIdAndRemove(id)
		if (!user) {
			res.status(404).send()
		} else {   
			res.send(user)
		}
	} catch(error) {
		log(error)
		res.status(500).send()
	}
})


// add new user
router.post('/user/add', mongoChecker, authenticate, async (req, res) => {
	const username = req.body.name

    try {
		const user = await User.findOne({username: username});
		if (user) {
            // username already exists
            res.status(400).send('User name already exists')
        } else {
        	const newUser = new User({
        		username: username,
        		password: req.body.password,
        		email: req.body.email,
        		status: req.body.status,
        		method: req.body.method,
        		building: req.body.building
        	})

        	await newUser.save()
        	res.send()
        }
    } catch (error) {
    	if (isMongoError(error)) { 
			res.status(500).redirect('/admin_page');
		} else {
			log(error)
			res.status(400).redirect('/admin_page');
		}
    }
})

// function for admin signup
router.post('/signups', mongoChecker, async (req, res) => {
	const username = req.body.username

    try {
		const admin = await Admin.findByUsername(username);
		if (admin) {
			// username already exists
            res.status(400).send('Admin name already exists')
        } else {
			const newAdmin = new Admin({
				username: username,
				password: req.body.password,
			})
            await newAdmin.save()
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

// admin user login
router.post('/logins', mongoChecker, async (req, res) => {
	const username = req.body.username
    const password = req.body.password

    try {
		const user = await Admin.findByUsernamePassword(username, password);
		if (!user) {
            res.status(400).send();
        } else {
            req.session.user = user._id;
            res.redirect('/admin_page');
        }
    } catch (error) {
    	if (isMongoError(error)) { 
			res.status(500).redirect('/admin_login');
		} else {
			log(error)
			res.status(400).send();
		}
    }
})

module.exports = router