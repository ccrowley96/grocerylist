const express = require('express');
const router = express.Router();
const randomstring = require('randomstring');
const {Item, Room } = require('../db/db_index');
const {validateRoom, validateItem} = require('./middleware');

var ObjectId = require('mongoose').Types.ObjectId; 

/* --------------- ROOM ROUTING --------------- */
// Create Room
router.post('/', async (req, res, next) => {
    // Find unique room code
    let roomCodeCheck = null;
    let roomCode = null;
    do{
        roomCode = randomstring.generate(6).toLowerCase();
        roomCodeCheck = await Room.find({roomCode: roomCode});
    } while(roomCodeCheck.length !== 0);

    let room = new Room({roomCode});

    // Save new room using roomCode
    try {
        let roomCreated = await room.save();
        res.status(200);
        res.json({
            title: 'Room',
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

// Update Room Name
router.post('/:id/changeName', async (req, res, next) => {
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

module.exports = router;