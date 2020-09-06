const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const bookSchema = mongoose.Schema({
    seller: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    title: {
        type: String
    },
    writer: {
        type: String
    },
    publisher: {
        type: String,
    },
    publishDate: {
        type: String,
    },
    grade: {
        type: String,
        default: 'A'
    },
    price: {
        type: Number,
        default: 0
    },
    category: {
        type: String,
    },
    methods: {
        type: Array,
        default: []
    },
    images: {
        type: Array,
        default: []
    },
}, { timestamps: { currentTime: () => Date.now() + 3600000 * 9 } });

bookSchema.index(
    {
        title: 'text',
        category: 'text'
    },
    {
        weights: {
            title: 5,
            category: 1,
        }
    }
)

const Book = mongoose.model('Book', bookSchema);

module.exports = { Book };