const express = require('express');
const router = express.Router();
const Item = require('../db/models/item');
var ObjectId = require('mongoose').Types.ObjectId; 

//GET all list items --> /api/list/
router.get('/', (req, res, next) => {
    Item.find({}, (err, items) => {
        if (err) {
          console.log(err);
          res.sendStatus(500);
        } else {
            res.status(200);
            res.json({
                title: 'List',
                items
            });
        }
      });
});

//POST new list item
router.post('/', async (req, res, next) => {
    const item = new Item({
        content: req.body.content,
        category: req.body.category
    });
    try {
        await item.save();
        res.sendStatus(200);
    } catch (err) {
        console.log(err);
        res.sendStatus(500);
    }
});

// UPDATE item by ID
router.put('/:id', async (req, res, next) => {
    let id = req.params.id;

    const itemUpdate = {
        content: req.body.content,
        category: req.body.category,
        date: new Date(),
        edited: true
    };

    try{
        await Item.findByIdAndUpdate(new ObjectId(id), itemUpdate);
        res.sendStatus(200);
    } catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});

//toggle 'checked' on item id
router.post('/check/:id', async (req, res, next) => {
    
    try{
        let item = await Item.findById(new ObjectId(req.params.id))
        if(!item) throw  new Error()

        await Item.updateOne({'_id': new ObjectId(req.params.id)}, {checked: !item.checked})
        res.sendStatus(200);
    } catch(err){
        console.log(err);
        res.sendStatus(404);
    }
})

//DELETE item by ID
router.delete('/:id', (req, res, next) => {
    try{
        Item.deleteOne({'_id': new ObjectId(req.params.id)}, (err, items) => {
            if(err){
                
            } else{
                res.sendStatus(200);
            }
        })
    } catch(err){
        console.log(err);
        res.sendStatus(500);
    }
});

//DELETE all items (clear list)
router.delete('/', (req, res, next) => {
    Item.deleteMany({}, (err) => {
        if(err)
            res.sendStatus(500);
        else
            res.sendStatus(200);
    });
});

module.exports = router;