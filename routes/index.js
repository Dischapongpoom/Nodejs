const express = require('express')
const router = express.Router()
const { ensureAuthenticated } = require('../config/auth')
const User = require('../models/User')

// Welcome page
router.get('/', (req,res) => res.render('welcome'))

// Dashboard
router.get('/dashboard', ensureAuthenticated, (req,res) => 
    res.render('dashboard', {
      username: req.user.username,
      usserss: req.user
}))

router.post('/changepassword', (req,res)=>{
  const username = User.findOne({ username: kopanda1107})
  console.log("user5555555555555555555555: ",username.password);
})

module.exports = router