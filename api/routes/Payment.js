const express = require('express');
const route = express.Router();
const userService = require('../../services/userService')
const MiddleWare = require('../../utils/Middleware_validation')
const stripe = require('stripe')(process.env.Stripe_Secret_key)

const { authenticate } = require('../Middleware/auth')
/***************Routes************/


route.post('/Stripe', MiddleWare.StripeValidation, MiddleWare.validationFunction, authenticate, async (req, res) => {
    console.log("Stripe Hit")

    const CreateUser = await stripe.customers.create({
        email: req.body.Email || 'test@gmail.com',
        name: req.body.Name || "test"
    })

  //  console.log("CreateUser", CreateUser)
    if (CreateUser)
    {   
        try {
            const token = await stripe.tokens.create({ card: {
                number: req.body.CardNumber, exp_month: req.body.ExpMM, exp_year: req.body.ExpYY, cvc: req.body.CVV } })
           // console.log("token", token)
            const AddingCardToUser = await stripe.customers.createSource(CreateUser.id, { source: token.id })
            console.log("AddingCardToUser", AddingCardToUser)

           const charge = await stripe.charges.create({
               amount: req.body.Amount*100,  
                description: 'Online Payment for Booking Order',
                currency: 'USD',
               customer: CreateUser.id,
              
            })
            console.log("Success", charge)
            // const invoice = await stripe.invoices.sendInvoice(charge.id);
            // console.log("invoice", invoice)
            return res.status(200).json({
                success: true, message: "Payment Charged Successfully", charge
            })
        } catch (error) {
            console.log("Error", error)
            return res.status(500).json({
                success: false, message: "Error.Payment Charged Failed", error
            })
        }
        

    }

});



module.exports = route;