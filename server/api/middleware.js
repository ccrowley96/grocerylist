const {Room } = require('../db/db_index');
var ObjectId = require('mongoose').Types.ObjectId; 

const secondsUntilExpire = 1000 * 60 * 60 * 24 * 30; // 30 days in seconds
exports.secondsUntilExpire = secondsUntilExpire;

// Validate that room exists (Middleware)
exports.validateRoom = async (req, res, next) =>{
    let roomId;
    try{
        roomId = req.params.id;
    } catch(err){
        res.status(400);
        res.send('Missing or incorrect id query parameter');
        return;
    }
    let room = await Room.findById(new ObjectId(roomId));
    if(room){
        // Update via expireAt middleware
        exports.updateExpireTime(req, res, () => {});
        next();
    }
    else{
        res.status(404);
        res.send(`Room ID: ${roomId} not found`);
        return;
    }
};

// Validate that item_id exists and is present in room
exports.validateItem = async (req, res, next) => {
    let itemId;
    let roomId;
    try{
        roomId = req.params.id;
        itemId = req.params.item_id;
    } catch(err){
        res.status(400);
        res.send('Missing or incorrect itemId query parameter');
        return;
    }
    let room = await Room.findById(new ObjectId(roomId));
    let item = room.roomList.map(el => el._id = String(el._id)).indexOf(itemId);
    
    if(item != -1){
        next();
    } else{
        res.status(404);
        res.send(`Item ID: ${itemId} not found`);
        return;
    }
};

exports.updateExpireTime = async (req, res, next) => {
    let expireAt = new Date(Date.now() + secondsUntilExpire);
    let roomId;
    try{
        roomId = req.params.id;
    } catch(err){
        res.status(400);
        res.send('Missing or incorrect roomId query parameter');
        return;
    }
    // Update expire time
    await Room.updateOne({"_id": new ObjectId(roomId)}, {expireAt: expireAt});
    next();
};
