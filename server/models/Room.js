const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const roomSchema = mongoose.Schema({
    _id: {
        type: Schema.Types.ObjectId,
        ref: 'Book'
    },
    title: {
        type: String,
        required : true
    },
    seller: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    buyers: [{
        type: Schema.Types.ObjectId, //HERE
        ref: 'User'
      }],
    messages: [{
        type: Schema.Types.ObjectId, //HERE
        ref: 'Message'
      }],

}, { timestamps: { currentTime: () => Date.now() + 3600000 * 9 } });


roomSchema.methods.addBuyer = function (buyer, cb) {
    // 중복 제거 바람.
    this.buyers.indexOf(buyer) === -1 && buyer !== this.seller.toString() && this.buyers.push(buyer);
    return this.save(function(err, roomInfo) {
        if(err) return cb(err);
        cb(null, roomInfo);
    });
};

roomSchema.methods.addMessage = function (message, cb) {
    this.messages.push(message);
    return this.save(function(err, roomInfo) {
        if(err) return cb(err);
        cb(null, roomInfo);
    });
};

const Room = mongoose.model('Room', roomSchema);

module.exports = { Room }