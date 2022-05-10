
const log = console.log
const path = require('path')

const express = require('express');
const router = express.Router(); // Express Router

// import the user mongoose model
const { User } = require('../models/user')

const { mongoChecker, isMongoError } = require("./helpers/mongo_helpers");
const { authenticate, sessionChecker } = require("./helpers/authentication");

// route for root: should redirect to index route
router.get('/', sessionChecker, (req, res) => {
	res.redirect('/index')
})

router.get('/index', sessionChecker, (req, res) => {
	res.sendFile(path.join(__dirname, '../public/index.html'))
})

router.get('/admin_login', sessionChecker, (req, res) => {
	res.sendFile(path.join(__dirname, '../public/login_page/admin_login.html'))
})

router.get('/user_login', sessionChecker, (req, res) => {
	res.sendFile(path.join(__dirname, '../public/login_page/user_login.html'))
})

router.get('/main_page', (req, res) => {
	if (req.session.user) {
		res.sendFile(path.join(__dirname, '../public/main_page/main_page.html'))
	} else {
		res.redirect('/user_login')
	}
})

router.get('/post_box_page', (req, res) => {
	if (req.session.user) {
		res.sendFile(path.join(__dirname, '../public/post_box_page/post_box_page.html'))
	} else {
		res.redirect('/user_login')
	}
})

router.get('/display_page', (req, res) => {
	if (req.session.user) {
		res.sendFile(path.join(__dirname, '../public/display_page/display.html'))
	} else {
		res.redirect('/user_login')
	}
})

router.get('/request_exchange', (req, res) => {
	if (req.session.user) {
		res.sendFile(path.join(__dirname, '../public/display_page/request_exchange.html'))
	} else {
		res.redirect('/user_login')
	}
})

router.get('/exchange_page', (req, res) => {
	if (req.session.user) {
		res.sendFile(path.join(__dirname, '../public/exchange_page/exchange.html'))
	} else {
		res.redirect('/user_login')
	}
})

router.get('/admin_page', (req, res) => {
	if (req.session.user) {
		res.sendFile(path.join(__dirname, '../public/admin_view/admin_page.html'))
	} else {
		res.redirect('/admin_login')
	}
})

router.get('/admin_item', (req, res) => {
	if (req.session.user) {
		res.sendFile(path.join(__dirname, '../public/admin_view/admin_item.html'))
	} else {
		res.redirect('/admin_login')
	}
})

router.get('/user_add', (req, res) => {
	if (req.session.user) {
		res.sendFile(path.join(__dirname, '../public/admin_view/user_add.html'))
	} else {
		res.redirect('/admin_login')
	}
})

router.get('/user_detail', (req, res) => {
	if (req.session.user) {
		res.sendFile(path.join(__dirname, '../public/admin_view/user_detail.html'))
	} else {
		res.redirect('/admin_login')
	}
})

router.get('/user_update', (req, res) => {
	if (req.session.user) {
		res.sendFile(path.join(__dirname, '../public/admin_view/user_update.html'))
	} else {
		res.redirect('/admin_login')
	}
})

router.get('/item_detail', (req, res) => {
	if (req.session.user) {
		res.sendFile(path.join(__dirname, '../public/admin_view/item_detail.html'))
	} else {
		res.redirect('/admin_login')
	}
})

module.exports = router
