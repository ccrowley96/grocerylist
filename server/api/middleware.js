const {Room } = require('../db/db_index');
var ObjectId = require('mongoose').Types.ObjectId; 

// Validate that room exists (Middleware)
exports.validateRoom = async (req, res, next) =>{
    let roomId;
    try{
        roomId = req.params.id;
    } catch(err){
        res.status(400);
        res.send('Missing or incorrect id query parameter');
    }
    let room = await Room.findById(new ObjectId(roomId));
    if(room){
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
