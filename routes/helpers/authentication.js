const { User } = require('../../models/user')
const { Admin } = require('../../models/admin')

module.exports = {
	authenticate: (req, res, next) => {
		if (req.session.user) {
			User.findById(req.session.user).then((user) => {
				if (!user) {
					return Promise.reject()
				} else {
					req.user = user
					next()
				}
			}).catch((error) => {
				Admin.findOne({_id: req.session.user}).then((user) => {
					if (!user) {
						return Promise.reject()
					} else {
						req.user = user
						next()
					}
				}).catch((error) => {
					res.status(401).send("Unauthorized")
				})
			})
		} else {
			res.status(401).send("Unauthorized")
		}
	},
	

    sessionChecker: (req, res, next) => {		
	    if (req.session.user) {
	        res.redirect('/main_page'); 
	    } else {
	        next(); 
	    }    
	}
}