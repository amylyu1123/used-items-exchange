const mongoose = require('mongoose')

const itemSchema = mongoose.Schema({
    itemImageId: {
        type: String,
        required: true
    },

    itemImageUrl: {
        type: String,
        required: true
    },

    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },

    potentialItems: {
        type: [mongoose.Schema.Types.ObjectId]
    },

    exchangedItem: {
        type: mongoose.Schema.Types.ObjectId
    },

    category: {
        type: String
    },

    description: {
        type: String,
        required: true
    },

    status: {
        type: String,
        default: 'Active',
        enum: ['Active', 'Confirmed']
    }
})

const Item = mongoose.model('Item', itemSchema)

module.exports = { Item }