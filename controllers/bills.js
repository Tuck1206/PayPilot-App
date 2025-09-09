const express = require('express')
const router = express.Router()

const User = require('../models/user.js')

router.get('/', async (req, res) => {
    const user = await User.findById(req.session.user._id)
    res.render('bills/index.ejs', {
        bills: user.bills
    })

})

router.get('/new', async (req, res) => {
    res.render('bills/new.ejs')
})

router.get('/:billId', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id)
        const bill = currentUser.bills.id(req.params.billId)
        const today = new Date()
        let message
        today.setHours(0, 0, 0, 0)
        bill.date.setHours(0, 0, 0, 0)
        if (bill.date.getTime() === today.getTime()) {
            message = "Due Today!"
        } else if (bill.date.getTime() <= today.getTime()) {
            message = "Past Due"
        } else {
            message = "Upcoming Due-Date"
        }
        res.render('bills/bill.ejs', {
            bill: bill,
            message: message
        })
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
})


router.get('/:billId/edit', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id)
        const bill = currentUser.bills.id(req.params.billId)
        res.render('bills/edit.ejs', {
            bill: bill,
        })
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
})

router.post('/', async (req, res) => {
    if (req.body.isPaid === "on") {
        req.body.isPaid = true;
    } else {
        req.body.isPaid = false;
    }
    try {
        const currentUser = await User.findById(req.session.user._id)
        currentUser.bills.push(req.body)
        await currentUser.save()
        res.redirect(`/users/${currentUser._id}/bills`)
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
})


router.put('/:billId', async (req, res) => {
    if (req.body.isPaid === "on") {
        req.body.isPaid = true;
    } else {
        req.body.isPaid = false;
    }


    try {
        const currentUser = await User.findById(req.session.user._id)
        const bill = currentUser.bills.id(req.params.billId)
        bill.set(req.body)
        await currentUser.save()
        res.redirect(
            `/users/${currentUser._id}/bills/${req.params.billId}`
        )
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
})



router.delete('/:billId', async (req, res) => {
    try {
        const currentUser = await User.findById(req.session.user._id)
        currentUser.bills.id(req.params.billId).deleteOne()
        await currentUser.save()
        res.redirect(`/users/${currentUser._id}/bills`)
    } catch (error) {
        console.log(error)
        res.redirect('/')
    }
})




module.exports = router