// Items routes
const log = console.log

const express = require('express');
const router = express.Router(); // Express Router

const { Item } = require('../models/item')
const { User } = require('../models/user')
const { ObjectId } = require('mongodb')

// middlewares
const { mongoChecker, isMongoError } = require("./helpers/mongo_helpers");
const { sessionChecker, authenticate } = require('./helpers/authentication');

const multipart = require('connect-multiparty');
const multipartMiddleware = multipart();

const cloudinary = require('cloudinary');
cloudinary.config({
    cloud_name: 'dsycaqzm4',
    api_key: '114614349513557',
    api_secret: 'ZcThjovRcaxA7dSYMLigWtf2lUc'
});

var selectedItem;
let temp

// add an item to the database
router.post('/item', mongoChecker, multipartMiddleware, async (req, res) => {
    cloudinary.uploader.upload(
        req.files.image.path,
        function (result) {
            var item = new Item({
                itemImageId: result.public_id,
                itemImageUrl: result.url,
                owner: req.session.user,
                category: req.body.category,
                description: req.body.description
            })

            item.save().then(
                saveRes => {
                    res.send(saveRes);
                },
                error => {
                    res.status(400).send(error)
                }
            )
        }
    )
})

// get all the items from datababse
router.get('/items', mongoChecker, authenticate, async (req, res) => {
    Item.find().then(
        items => {
            res.send(items)
        },
        error => {
            res.status(500).send(error)
        }
    )
})

// get all items posted by current user
router.get('/currItems', mongoChecker, authenticate, async (req, res) => {
    try {
		const id = req.session.user
		const items = await Item.find({owner: id})
		if (!items) {
			res.status(404).send('Item not found')
		} else {
			res.send(items)
		}
	} catch(error) {
		log(error)
		res.status(500).send('Internal server error')
	}
})

// given item id, get owner's information
router.get('/itemToUser/:id', mongoChecker, authenticate, async (req, res) => {
    const itemId = req.params.id

    if (!ObjectId.isValid(itemId)) {
		res.status(404).send()
		return;
	}

    try {
        const item = await Item.findOne({_id: itemId})
        const ownerId = item.owner
        const user = await User.findOne({_id: ownerId})
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

router.patch('/item/:myItemId/:otherItemId', mongoChecker, authenticate, async (req, res) => {
    const myItemId = req.params.myItemId
    const otherItemId = req.params.otherItemId

    const fieldsToUpdate = {}
    for (var key in req.body) {
        fieldsToUpdate[key] = req.body[key]
    }

    try {
        //update two items with _id myItemId and otherItemId status to 'Confirmed'
        if (req.body.status){
             fieldsToUpdate['exchangedItem'] = otherItemId
             const myItem = await Item.findOneAndUpdate({_id: myItemId}, {$set:fieldsToUpdate}, {new: true, useFindAndModify: false})
             fieldsToUpdate['exchangedItem'] = myItemId
             const otherItem = await Item.findOneAndUpdate({_id: otherItemId}, {$set:fieldsToUpdate}, {new: true, useFindAndModify: false})
        }
        //update item with _id otherItemId potentialItems with myItemId added(no duplicate)
        else{
            const otherUpdate = await Item.findOne({_id: otherItemId})

            //check if duplicate
            if (!otherUpdate.potentialItems.includes(myItemId))
                otherUpdate.potentialItems.push(myItemId)

            fieldsToUpdate['potentialItems'] = otherUpdate.potentialItems
            const otherItem = await Item.findOneAndUpdate({_id: otherItemId}, {$set: otherUpdate}, {new: true, useFindAndModify: false})
        }

        res.send()
    } catch(error) {
        log(error)
        if (isMongoError(error)) {
            res.status(500).send('Internal server error')
        } else {
            res.status(400).send('Bad request')
        }
    }
})

// get item by category
router.get('/items/:category', mongoChecker, authenticate, async (req, res) => {
    const category = req.params.category

    try {
        const item = await Item.find({category: category})
        if (!item) {
            res.status(404).send('Item not found')
        } else {
            res.send(item)
        }
    } catch(error) {
        log(error)
        res.status(500).send('Internal server error')
    }
})

// get item by id
router.get('/item/:id', mongoChecker, authenticate, async (req, res) => {
    const id = req.params.id

    try {
        const item = await Item.find({_id: id})
        if (!item) {
            res.status(404).send('Item not found')
        } else {
            temp = item
            res.send(item)
        }
    } catch(error) {
        log(error)
        res.status(500).send('Internal server error')
    }
})

// get detail of item stored in temp
router.get('/itemsDetail', mongoChecker, authenticate, async (req, res) => {

    try {
        if (!temp) {
            res.status(404).send('Item not found')
        } else {
            res.send(temp)
        }
    } catch(error) {
        log(error)
        res.status(500).send('Internal server error')
    }
})

router.get('/requestItem/:id', mongoChecker, authenticate, async (req, res) => {
    try{
        selectedItem = req.params.id
        const item = await Item.find({_id: selectedItem})
        res.send(item)
    }catch(error) {
        log(error)
        res.status(500).send('Internal server error')
    }
})

router.get('/requestItem', mongoChecker, authenticate, async (req, res) => {
    try{
        if (!selectedItem){
            res.status(400).send('Item has not been selected')
        } else{
            const item = await Item.find({_id: selectedItem})
            selectedItem = null;
            res.send(item)
        }
    }catch(error) {
        log(error)
        res.status(500).send('Internal server error')
    }
})
    
// a DELETE route to remove an image by its id.
router.delete('/delete/:imageId', mongoChecker, authenticate, async (req, res) => {
    const imageId = req.params.imageId;

    cloudinary.uploader.destroy(imageId, function (result) {
        Item.findOneAndRemove({ itemImageId: imageId })
            .then(img => {
                if (!img) {
                    res.status(404).send();
                } else {
                    res.send(img);
                }
            })
            .catch(error => {
                res.status(500).send(); // server error, could not delete.
            })
    })
})

module.exports = router