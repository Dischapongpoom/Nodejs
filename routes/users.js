const express = require('express')
const router = express.Router()
const bcrypt = require("bcryptjs")
const passport = require('passport')

// User model
const User = require('../models/User')

//Login Page
router.get('/login', (req,res) => res.render('login'))


// Register page
router.get('/register', (req,res) => res.render('register'))

// Register Handle
router.post('/register', (req,res) => {
    const {username ,password, password2  } = req.body;
    let errors = [];

    if (!username  || !password || !password2) {
        errors.push({ msg: 'Please enter all fields' });
    }

    if (username.length > 12) {
        errors.push({ msg: 'username Up to 12 characters in length' });
    }

    if (password != password2) {
        errors.push({ msg: 'Passwords do not match' });
    }

    if (password.length < 6 &&  password) {
        errors.push({ msg: 'Password must be at least 6 characters' });
    }

    if (errors.length > 0) {
        res.render('register', {
        errors,
        username,
        password,
        password2
        });
    }else{
        // Validation passed
        User.findOne({ username: username })
            .then(user => {
                if(user) {
                    // User exists
                    errors.push({ msg: 'Username is already register'})
                    res.render('register', {
                    errors,
                    username,
                    password,
                    password2
                    });
                } else{
                    const newUser = new User({
                        username,
                        password
                    })
                    console.log("newUser: ",newUser);
                    // Hash password
                    bcrypt.genSalt(10, (err, salt) => 
                        bcrypt.hash(newUser.password, salt, (err, hash) =>{
                            if(err) throw err
                            // set password to hash
                            newUser.password = hash
                            newUser.passwordhistory.push(hash)
                            //save user
                            newUser.save()
                            .then(user => {
                                req.flash('success_msg', 'You are now registered and can log in')
                                res.redirect('/users/login')
                            })
                            .catch(err => console.log(err))
                    }))
                }
            })
    }
})

// Login Handle
router.post('/login', (req, res, next) =>{
    // console.log('login: ',req.body)
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req, res, next)
})

// logout Handle
router.get('/logout', (req, res) =>{
    req.logout();
    req.flash('success_msg', ' You are logged out')
    res.redirect('/users/login')
})



module.exports = router