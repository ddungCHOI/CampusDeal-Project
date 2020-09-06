const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = mongoose.Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    content: {
        type: String,
        required : true
    },
    at: {
        type: Date,
        required: true
    }

}, { timestamps: { currentTime: () => Date.now() + 3600000 * 9 } });


const Message = mongoose.model('Message', messageSchema);

module.exports = { Message }