const express = require('express');
const mongoose = require('mongoose');
const Washer = require('../models/Washer')
const Vehicle = require('../models/Vehicle')
const Expense = require('../models/Expense')
const Manager = require('../models/Manager')

const router = express.Router();

washPackages = {
    smallcars: { washerFee: 3000, packagePrice: 10000 },
    medium: { washerFee: 4000, packagePrice: 15000 },
    fullwash: { washerFee: 5000, packagePrice: 20000 },
    bodaboda: { washerFee: 1500, packagePrice: 5000 },
    engine: { washerFee: 2000, packagePrice: 10000 }
}

router.get('/washer', (req, res) => {
    res.render('register_washer', { title: "Register Car Washer", alert: req.query.alert
    })
})

router.post("/washer", async (req, res) => {
    try {
        const washer = new Washer(req.body);
        await washer.save()
        res.redirect('washer?alert=success')
    }
    catch (err) {
        res.status(400).render('register_washer', { title: "Register Washer", alert: 'error' })
        console.log(err)
    }
})

router.get('/vehicle', async (req, res) => {
    let washerlist = await Washer.find();
    res.render('register_vehicle', {
        washers: washerlist,
        title: "Register Vehicle", alert: req.query.alert
    })
})

router.post("/vehicle", async (req, res) => {
    try {
        // combine the date and time
        let data = req.body
        let datetimeArrival = Date.parse(data.doa + 'T' + data.toa)
        data.datetimeArrival = datetimeArrival

        //derive the package price and the washer fee
        let packageDetails = washPackages[data.package]

        data.packagePrice = packageDetails['packagePrice']
        data.washerFee = packageDetails['washerFee']

        const vehicle = new Vehicle(data);
        await vehicle.save()
        res.redirect('vehicle?alert=success')
    }
    catch (err) {
        res.status(400).render('register_vehicle', { title: "Register Vehicle", alert: 'error' })
        console.log(err)
    }
})

router.get('/manager', (req, res) => {
    res.render('register_manager', { title: "Register Manager", alert: req.query.alert
    })
})

router.post("/manager", async (req, res) => {
    
    const manager = new Manager(req.body);
    await Manager.register(manager, req.body.password, (err) => {
        if (err) {
            res.status(400).render('register_manager', { title: "Register Manager", alert: 'error' })
            console.log(err)
        } else {
            res.redirect('manager?alert=success')
        }
    })
})

router.get("/expenses", (req, res) => {
    res.render('register_expenses', { title: "Register Expenses", alert: req.query.alert })
})

router.post("/expenses", async (req, res) => {
    try {
        const expense = new Expense(req.body);
        await expense.save()
        res.redirect('expenses?alert=success')
    }
    catch (err) {
        res.status(400).render('register_expenses', { title: "Register Expenses", alert: 'error' })
        console.log(err)
    }
})

router.post('/delete-washer', async (req, res) => {
    try {
        await Washer.deleteOne({ _id: req.body.id })
        res.redirect('back')
    } catch (err) {
        res.status(400).send("Unable to delete item in the database");
    }
})

module.exports = router;