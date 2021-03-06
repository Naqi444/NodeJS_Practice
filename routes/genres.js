const validateObjectId = require('../middleware/validateObjectId')
const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const {Genre, validate} = require('../models/genre');
const asyncMiddleware = require('../middleware/async');



router.get('/', asyncMiddleware(async (req, res,next) => {
    // throw new Error('Could not get the gneres.')
    const genres = await Genre.find().sort('name');
    res.send(genres);   
}));
  
router.post('/', auth,  asyncMiddleware(async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
    const genre = new Genre({ name: req.body.name });
    await genre.save();
    res.send(genre);
}));
  
router.put('/:id',[auth,validateObjectId], async (req, res) => {
    const { error } = validate(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
  
    const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, {
      new: true
    });
  
    if (!genre) return res.status(404).send('The genre with the given ID was not found.');
    
    res.send(genre);
});
  
router.delete('/:id',[auth,admin,validateObjectId], async (req, res) => {
    const genre = await Genre.findByIdAndRemove(req.params.id);
  
    if (!genre) return res.status(404).send('The genre with the given ID was not found.');
  
    res.send(genre);
});
  
router.get('/:id',validateObjectId, async (req, res) => {
    if(!mongoose.Types.ObjectId.isValid(req.params.id))
        return res.status(404).send('Invalid ID');

    const genre = await Genre.findById(req.params.id);
  
    if (!genre) return res.status(404).send('The genre with the given ID was not found.');
  
    res.send(genre);
});
  
module.exports = router;