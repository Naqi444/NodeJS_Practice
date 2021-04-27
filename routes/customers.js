const express = require('express');
const router = express.Router();

//Object de-structure
const {Customer, validate} = require('../models/customer');


//GET request
router.get('/', async (req,res) => {
    const customer = await Customer.find().sort('name');
    res.send(customer);
})

//POST request
router.post('/',async (req,res) =>{
    const {error} = validate(req.body);
    if(error){
        res.status(400).send(error.details[0].message);
        return;
    }
    try{
        const customer = new Customer({isGold: req.body.isGold,
            name: req.body.name,
            phone: req.body.phone });
        await customer.save()
        res.send(customer); 
    }
    catch{
        console.error('Not able to POST')
    }
});

//PUT request

router.put('/:id', async(req,res) => {
    const {error} = validate(req.body)
    if(error){
        res.status(400).send(error.details[0].message)
        return;
    }

    const customer = await Customer.findByIdAndUpdate(req.params.id, {name:req.body.name},{new:true});
    if(!customer) return res.status(404).send('Customer with the given ID was not found');
    res.send(customer);
});

//DELETE request
router.delete('/:id',async (req,res)=>{
    const customer  = await Customer.findByIdAndRemove(req.params.id);
    if (!customer) return res.status(404).send("A customer with the given ID was not found")
    res.send(customer)
});



module.exports = router;
