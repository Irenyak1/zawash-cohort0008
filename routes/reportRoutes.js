const express = require('express');
const mongoose = require('mongoose');
const Vehicle = require('../models/Vehicle')
const Washer = require('../models/Washer')
const Expense = require('../models/Expense')
const moment = require('moment');
const router = express.Router();

router.get('/payout', async (req, res) => {
    try {
        // use moment to get selected date and default date
        let selectedDate = moment().format('YYYY-MM-DD')
        if (req.query.searchdate)
            selectedDate = moment(req.query.searchdate).format('YYYY-MM-DD')

        // based on selected date , query to get the count of vehicles per washer,
        //  &  payout per washer.
        let washedVehicles = await Vehicle.aggregate(
            [ {$match: { doa: new Date(selectedDate) }},
            { $group: { _id: '$washer', count: { $sum: 1 }, totalPayout: { $sum: '$washerFee' } } },
            { $lookup: { from: 'washers', localField: '_id', foreignField: '_id', as: "details" } }
            ])
        // get the total payout for all the washers based on the selected date
        let totalPayoutPerDay = await Vehicle.aggregate([
                { $match: { doa: new Date(selectedDate) } },
                { $group: { _id: '$doa', totalPayoutPerDay: { $sum: '$washerFee' } } }
            ])
        // pass the all the relevant data as you render the payout report
        res.render("car_washer_payout", { washers: washedVehicles, 
            title: "List of Car Washers", defaultDate: selectedDate ,
            sumPayout:totalPayoutPerDay[0]})
    }
    catch (err) {
        console.log(err)
        res.send('Failed to retrive payout details');
    }
})

router.get('/expenses-report', async (req, res) => {
    try {
        let selectedDate = moment().format('YYYY-MM-DD')
        if (req.query.searchdate)
            selectedDate = moment(req.query.searchdate).format('YYYY-MM-DD')

        // query for returning all expenses on a day
        let expenseDetails = await Expense.find({ doe: selectedDate })

        // query for total expense on a day
        let totalExpense = await Expense.aggregate([
            { $match: { doe: new Date(selectedDate) } },
            { $group: { _id: '$doe', totalExpense: { $sum: '$amount' } } }
        ])

        res.render("expense_report", {
            expenses: expenseDetails, total: totalExpense[0],
            title: "Expenses", defaultDate: selectedDate
        })
    } catch (err) {
        console.log(err)
        res.send('Failed to retrive Expense details');
    }
})


router.get('/collection', async (req, res) => {
    try {
        let selectedDate = moment().format('YYYY-MM-DD')
        if (req.query.searchdate)
            selectedDate = moment(req.query.searchdate).format('YYYY-MM-DD')

        // query for returning all expenses on a day

        let collectionDetails = await Vehicle.find({ doa: selectedDate })

        // query for total expense on a day
        let totalCollection = await Vehicle.aggregate([
            { $match: { doa: new Date(selectedDate) } },
            { $group: { _id: '$doa', totalCollection: { $sum: '$packagePrice' } } }
        ])

        res.render("collection_report", {
            collections: collectionDetails, total: totalCollection[0],
            title: "Collections", defaultDate: selectedDate
        })

    } catch (err) {
        console.log(err)
        res.send('Failed to retrive collections details');
    }
})


router.get('/washer-details', async (req, res) => {
    try {
        // find all the data in the Washers collection
        let washerDetails = await Washer.find();
        res.render('car_washer_details', { users: washerDetails, title: 'Washer Details' })
    } catch (err) {
        console.log(err)
        res.send('Failed to retrive washer details');
    }
})

module.exports = router;