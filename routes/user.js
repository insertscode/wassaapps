// Main Routes 
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const { ensureAuth, ensureGuest } = require('../middleware/auth')

// User model
const User = require('../models/User');
const FlashData = require('../models/FlashData');

// User dashboard  ->  GET /user_dash
router.get('/user_dash', ensureAuth, (req, res) => {
    FlashData.findOne({id: req.user.flashID}).then( (record) => {
        res.render('user_dash', { 
            name:           req.user.displayName,
            email:          req.user.email,
            flashId:        req.user.flashId,
            background:     record.background
        });
    });
});

router.get('/guest_dash', ensureGuest, (req, res) => {
    res.render('user_dash', { 
        name:           "guest",
        email:          "guest",
        flashId:        "guest_mode",
        background:     "Papaya"
    });
});

module.exports = router;