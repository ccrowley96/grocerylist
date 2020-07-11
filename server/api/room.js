const express = require('express');
const router = express.Router();
const randomstring = require('randomstring');
const {Item, Room } = require('../db/db_index');
const {validateRoom, validateItem, updateExpireTime, secondsUntilExpire} = require('./middleware');

var ObjectId = require('mongoose').Types.ObjectId; 

/* --------------- ROOM ROUTING --------------- */
// Create Room
router.post('/', async (req, res, next) => {
    // Find unique room code
    let roomCodeCheck = null;
    let roomCode = null;
    do{
        roomCode = randomstring.generate({
            length: 6,
            charset: 'alphabetic',
            readable: true,
            capitalization: 'lowercase'
        }).toLowerCase();
        roomCodeCheck = await Room.find({roomCode: roomCode});
    } while(roomCodeCheck.length !== 0);

    // Set expire time to 60 seconds
    let expireAt = new Date(Date.now() + secondsUntilExpire);
    let room = new Room({roomCode, expireAt});

    // Save new room using roomCode
    try {
        let roomCreated = await room.save();
        res.status(200);
        res.json({
            name: roomCreated.roomName,
            roomCode: roomCode,
            id: roomCreated._id
        });
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

// Delete Room
router.delete('/:id', async (req, res, next) => {
    let roomId;
    try{
        roomId = req.params.id;
    } catch(err){
        res.status(400);
        res.send('Missing or incorrect id query parameter');
    }

    try{
        await Room.deleteOne({'_id': new ObjectId(roomId)});
        res.sendStatus(200);
    } catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});

// Fetch room - (used to fetch rooms by id stored in local storage)
router.post('/getMatchingIds', async (req, res, next) => {
    // pull ids from body id []
    let ids;
    try{
        ids = req.body.ids;
    } catch(err){
        res.status(400);
        res.send('Missing or incorrect ids in body');
    }
    
    let matchingRooms = [];
    // fetch matching ids from db and return those rooms
    try{
        for(let id of ids){
            let match = await Room.findById(new ObjectId(id))
            if(match) matchingRooms.push(match);
        }

        // Update expireAt on all matching rooms to current time + expireTime
        for(let room of matchingRooms){
            let expireAt = new Date(Date.now() + secondsUntilExpire);
            await Room.updateOne({"_id": new ObjectId(room._id.toString())}, {expireAt: expireAt});
        }

        res.status(200);
        res.json({
            title: 'Rooms',
            matchingRooms
        });
    } catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});

// Fetch room by room code - (used to fetch rooms by room code stored in local storage)
router.post('/getRoomByCode', async (req, res, next) => {
    // pull ids from body id []
    let roomCode;
    try{
        roomCode = req.body.roomCode;
    } catch(err){
        res.status(400);
        res.send('Missing or incorrect roomCode in body');
    }
    
    let matchingRooms = [];
    // fetch matching ids from db and return those rooms
    try{
        let match = await Room.findOne({roomCode})
        if(match){
            res.status(200);
            res.json({
                title: 'Rooms',
                match
            });
        } else{
            res.status(404);
            res.json({
                title: 'Rooms',
                match: null
            })
        }
    } catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});

// Update Room Name
router.post('/:id/changeName', updateExpireTime, async (req, res, next) => {
    let roomId;
    let roomName;
    try{
        roomId = req.params.id;
    } catch(err){
        res.status(400);
        res.send('Missing or incorrect id query parameter');
    }

    let room = await Room.findById(new ObjectId(roomId));
    if(room){
        if(!req.body.roomName){
            res.status(400);
            res.send('Incorrect request body (see roomName)');
            return;
        }
        roomName = req.body.roomName;

        await Room.findByIdAndUpdate(new ObjectId(roomId),
            {$set: {"roomName": roomName}}
        )
        res.sendStatus(200);
    } else{
        res.status(404);
        res.send(`Room ID: ${roomId} not found`)
    }
})

/* --------------- LIST ROUTING --------------- */
//GET all list items from room
router.get('/:id/list', validateRoom, async (req, res, next) => {
    let roomId = req.params.id;
    let room = await Room.findById(new ObjectId(roomId));
    let list = room.roomList;

    res.status(200);
    res.json({
        title: 'List',
        list
    });
});

//POST new list item
router.post('/:id/list', validateRoom, async (req, res, next) => {
    let roomId = req.params.id;;
    
    if(!req.body.content || !req.body.category){
        res.status(400);
        res.send('Incorrect request body (see category and content)');
        return;
    }
        
    // Create new item
    const item = new Item({
        content: req.body.content,
        category: req.body.category
    });
    try {
        await Room.findByIdAndUpdate(new ObjectId(roomId),
            {$push: {roomList: item}}
        )
        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

// UPDATE item by ID
router.put('/:id/list/:item_id', validateRoom, validateItem, async (req, res, next) => {
    let roomId = req.params.id;
    let itemId = req.params.item_id;
    
    if(!req.body.content || !req.body.category){
        res.status(400);
        res.send('Incorrect request body (body needs category and content)');
        return;
    }
    try{
        await Room.findOneAndUpdate({'_id': new ObjectId(roomId), 'roomList._id': new ObjectId(itemId)},
            {$set: {
                "roomList.$.content": req.body.content, 
                "roomList.$.category": req.body.category,
                "roomList.$.edited": true,
                "roomList.$.date": new Date(),
            }}
        )
        res.sendStatus(200);
    } catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});

//toggle 'checked' on item id
router.post('/:id/list/:item_id/check', validateRoom, validateItem, async (req, res, next) => {
    let roomId = req.params.id;
    let itemId = req.params.item_id;
    
    if(typeof req.body.checked != 'boolean'){
        res.status(400);
        res.send('Incorrect request body (checked: boolean) must be in body');
        return;
    }

    // Toggle checked
    try{
        await Room.findOneAndUpdate({'_id': new ObjectId(roomId), 'roomList._id': new ObjectId(itemId)},
            {$set: {"roomList.$.checked": req.body.checked}}
        )
        res.sendStatus(200);
    } catch(err){
        console.log(err);
        res.sendStatus(500);
    }
})

//toggle 'check all' on room
router.post('/:id/list/checkAll', validateRoom, async (req, res, next) => {
    let roomId = req.params.id;

    if(req.body.checked === undefined || typeof req.body.checked != 'boolean'){
        res.status(400);
        res.send('Incorrect request body (checked: boolean) must be in body');
        return;
    }

    try{
        await Room.updateMany({'_id': new ObjectId(roomId)},
            {$set: {"roomList.$[].checked": req.body.checked}});
            res.sendStatus(200);
    } catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});

// DELETE multiple items (used to delete selected items)
router.delete('/:id/list/deleteChecked', /* validateRoom ,*/ async (req, res, next) => {
    let roomId = req.params.id;
    
    try{
        await Room.updateMany({'_id': new ObjectId(roomId)},
                {
                    $pull: { 
                        roomList: {
                            checked: true
                        }
                    }
                }
        );
            res.sendStatus(200);
    } catch(err){
        console.log(err);
        res.sendStatus(500);
    }
})

//DELETE item by ID
router.delete('/:id/list/:item_id', validateRoom, async (req, res, next) => {
    let roomId = req.params.id;
    let itemId = req.params.item_id;

    try{
        await Room.updateOne({"_id": new ObjectId(roomId)}, {
            "$pull": {"roomList" : {"_id": new ObjectId(itemId)}}
        })
        res.sendStatus(200);
    } catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});

//DELETE all items (clear list)
router.delete('/:id/list', validateRoom, async (req, res, next) => {
    let roomId = req.params.id;
    try{
        await Room.updateOne({"_id": new ObjectId(roomId)}, {
            "$set": {"roomList" : []}
        })
        res.sendStatus(200);
    } catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});

// Move item to new list
router.post('/moveItem/:id/list/:item_id', validateRoom, validateItem, async (req, res, next) => {
    let roomCode;
    try{
        roomCode = req.body.code;
    } catch(err){
        res.status(400);
        res.send('Missing or incorrect roomCode in body');
    }
    
    let roomId = req.params.id;
    let itemId = req.params.item_id;

    // Copy item from source room
    let sourceRoom = await Room.findOne({'_id': new ObjectId(roomId), 'roomList._id': new ObjectId(itemId)});
    let sourceItem = null;
    sourceRoom.roomList.forEach(item => {
        console.log(item);
        if(String(item._id) == itemId)
            sourceItem = item;
    })
    
    // Create new item
    const item = new Item({
        content: sourceItem.content,
        category: sourceItem.category,
        date: sourceItem.date,
        edited: sourceItem.edited,
        checked: sourceItem.checked
    });

    // Delete source item
    try{
        await Room.updateOne({"_id": new ObjectId(roomId)}, {
            "$pull": {"roomList" : {"_id": new ObjectId(itemId)}}
        })
    } catch(err){
        console.log(err);
        res.sendStatus(500);
    }

    // Save to target list
    try {
        let match = await Room.findOne({roomCode})
        if(match){
            await Room.findByIdAndUpdate(new ObjectId(match._id),
                {$push: {roomList: item}}
            )
            res.sendStatus(200);
            return;
        } else{
            throw new Error('Target room code not found');
        }
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
    res.sendStatus(500);
});

module.exports = router;