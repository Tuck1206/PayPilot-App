const express = require('express')
const router = express.Router()

const User = require('../models/user.js')


router.post('/', async (req, res) => {
    try {
        const { startDate, endDate } = req.body;
        console.log(req.body)
        if (!startDate || !endDate) {
            return res.status(400).json({ message: 'startDate and endDate are required.' });
        }

        const startDateTime = new Date(startDate);
        const endDateTime = new Date(endDate);

        if (isNaN(startDateTime) || isNaN(endDateTime)) {
            return res.status(400).json({ message: 'Invalid date format provided.' });
        }


        const user = await User.findById(req.session.user._id);

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }


        const filteredBills = user.bills.filter(bill => {
            const billDate = new Date(bill.date);
            return billDate >= startDateTime && billDate <= endDateTime;
        });


        filteredBills.sort((a, b) => a.date - b.date);

        res.render('bills/bills-by-date.ejs', { bills: JSON.stringify(filteredBills) });

    } catch (error) {
        console.error('Error fetching bills by date range:', error);
        res.status(500).json({ message: 'Server error fetching bills.' });
    }
});
















module.exports = router;