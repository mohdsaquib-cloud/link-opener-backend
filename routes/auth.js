const express = require('express')
const router = express.Router()
const passport = require('passport')

router.get('/discord', passport.authenticate('discord'));

router.get('/discord/callback', passport.authenticate('discord', {
    failureRedirect: '/'
}), function(req, res) {    
    res.redirect("http://localhost:3000/bot") // Successful auth
});

module.exports = router