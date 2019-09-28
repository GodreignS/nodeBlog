const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const passport = require('passport');

const encode = require('ent/encode');

// Upload file
const { upload, dest  } = require('../Config/upload'); 

const User = require('../Models/users');
const { check, validationResult } = require('express-validator');

// User validations

const userValidators =  [

    check('fullname')
        .not().isEmpty()
        .withMessage('Name is required')
        .isLength({ min: 3})
        .withMessage('Full name must be at least 3 chars long'),

    check('email')
        .not().isEmpty()
        .withMessage('Email is required')
        .isEmail()
        .withMessage('Email is not valid'),

    check('password')
        .not().isEmpty()
        .withMessage('Password is required')
        .isLength({ min: 5})
        .withMessage('Password must be at least 5 chars long'),

    check('password2')      
        .not().isEmpty()
        .withMessage('Enter the password again')
        .custom((value, {req, loc, path}) => {
            if( value !== req.body.password ) {
                // trow error if passwords do not match
                throw new Error("Passwords don't match");
            } else {
                return value;
            }
        })        

    ];

//  Register handle

router.post('/register/:imageType', upload.single('userImage'), userValidators, (req, res) => {

    const errors = validationResult(req);
    let { fullname, email, password, gender} = req.body;
    let role = "user", urlImage;
    if(!errors.isEmpty()){                

        errors.array().forEach(error => req.flash('error',error.msg))        
        res.render('register', {
            fullname,
            email,
            password,            
            layout: 'formLayout'});

    } else {

        User.findOne({ email }).then( user => {

            if(user){

                req.flash('error', 'Email already exits');
                res.render('register', {
                    fullname,
                    email,
                    password,
                    layout: 'formLayout'});

            } else {

                if(dest.some( destination => destination == req.params.imageType)){

                    if(req.file) urlImage = req.file.filename;
                    else urlImage = "defaultImage.png";                

                    let newUser = new User({ 
                        fullname: encode(fullname), 
                        email: email, 
                        password: password, 
                        gender: encode(gender), 
                        urlImage, 
                        role 
                    });

                    // Hash password
                    bcrypt.genSalt(10, (err, salt) => {

                        if(err) throw err;  

                        bcrypt.hash(newUser.password, salt, (err, hash) => {
                            if(err) throw err;
                            //  set password to hash
                            newUser.password = hash;
                            //  save user
                            newUser.save()
                                        .then(user => {
                                            req.flash('success', 'You are registered now and can log in');
                                            res.redirect('/login');
                                        })
                                        .catch(err => console.log(err))
                        });

                    })
                }

            }

        })        

    }    

});

//  log in handle

router.post('/login', (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })(req, res, next)
});

// log out handle

router.get('/logout', (req, res) => {
    req.logOut();
    req.flash('success', 'You are logged out');
    res.redirect('/login');
});

module.exports = router;