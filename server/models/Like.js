const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const likeSchema = mongoose.Schema({
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    sellerId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }

}, { timestamps: { currentTime: () => Date.now() + 3600000 * 9 } });


const Like = mongoose.model('Like', likeSchema);

module.exports = { Like }