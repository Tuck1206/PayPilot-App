const express = require('express')
const router = express.Router()

const User = require('../models/user.js')


router.get('/new', async (req, res) => {
  res.render('bills/new.ejs')
})

router.get('/:billId', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id)
    const bill = currentUser.bills.id(req.params.billId)
    res.render('bills/recipe.ejs', {
      bill: bill,
    })
  } catch (error) {
    console.log(error)
    res.redirect('/')
  }
})


router.get('/:billId/edit', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id)
    const bill = currentUser.bills.id(req.params.foodId)
    res.render('bills/edit.ejs', {
      bill: bill,
    })
  } catch (error) {
    console.log(error)
    res.redirect('/')
  }
})

router.post('/', async (req, res) => {
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
  try {
    const currentUser = await User.findById(req.session.user._id)
    const bill = currentUser.bills.id(req.params.foodId)
    bill.set(req.body)
    await currentUser.save()
    res.redirect(
      `/users/${currentUser._id}/bills/${req.params.foodId}`
    )
  } catch (error) {
    console.log(error)
    res.redirect('/')
  }
})



router.delete('/:billId', async (req, res) => {
  try {
    const currentUser = await User.findById(req.session.user._id)
    currentUser.bills.id(req.params.foodId).deleteOne()
    await currentUser.save()
    res.redirect(`/users/${currentUser._id}/bills`)
  } catch (error) {
    console.log(error)
    res.redirect('/')
  }
})




module.exports = router