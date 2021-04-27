const mongoose = require('mongoose');
const Joi = require('joi');

const customersSchema = new mongoose.Schema({
    isGold:{
        type: Boolean,
        default: false
    }, 
    name:{
        type: String
    },
    phone: {
        type:String,
        required: true
    }
});

function validateCustomer(customer){
    const schema = {
        name: Joi.string().min(5).max(50).required(),
        phone: Joi.string().min(5).max(50).required(),
        isGold: Joi.boolean()
    };
    return Joi.validate(customer,schema);
}
const Customer = mongoose.model('Customer', customersSchema);
exports.Customer = Customer;
exports.validate = validateCustomer;