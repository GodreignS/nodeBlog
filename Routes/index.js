// Express
const express = require('express');
const router = express.Router();

// Models
const Category = require('../Models/categories');
const Post = require('../Models/posts');
const Comment = require('../Models/comments')

// E-Mail

const nodemailler = require('nodemailer');

// Authentication and validation
const { ensureAuthentication } = require('../Config/auth');
const {check, validationResult } = require('express-validator');

const contactValidators = [

    check('name')
        .not().isEmpty()
        .withMessage('Name can not be empty')
    ,check('email')
        .not().isEmpty()
        .withMessage('Email can not be empty')
    ,check('message')
        .not().isEmpty()
        .withMessage('Message can not be empty')
];

router.get('/', (req, res) => {

    Post.find({})
        .populate('author')
        .exec((err, articles ) => {
        
        if(err) throw err;                                              
        
        res.render('home', { articles })

        });
    
});
router.get('/about', (req, res) => res.render('about'));

router.get('/contact', ensureAuthentication, (req, res) => res.render('contact', { userName: req.user.fullname, userEmail: req.user.email }) );

router.post('/contact/send', contactValidators ,(req, res) => {
    const errors = validationResult(req);

    let { name, email, message } = req.body;

    if(req.user)
    {
        if(!errors.isEmpty())
        {
            errors.array().forEach(error => req.flash('error',error.msg))        
            res.render('contact', 
                {
                    userName: req.user.fullname,
                    userEmail: req.user.email                         
                }
            );

        }
        else
        {
            const transporter = nodemailler.createTransport({
                service: 'gmail',
                auth: {
                    user: 'example@gmail.com',
                    pass:  'test'
                },
                tls: {
                    rejectUnauthorized: false
                }
            });

            const mailOptions = {
                from: email,
                to: `"${name}" <example>`,
                subject: 'Test blog message',
                html: message
            }

            transporter.sendMail(mailOptions, (err, info) => {

                if(err) return console.log(err);

                console.log(info);
                req.flash('success', 'Your message have been sent');
                res.redirect('/contact');
            })
        }
    }
    else res.redirect('/');
});

router.get('/myProfile/:id', ensureAuthentication, (req, res) => {
    if(req.params.id){
        switch(req.params.id){
            case 'postList':
                Post.find({author: req.user._id})
                    .then( articles => {
                        res.render('myProfile', { 
                            layout: 'postLayout',
                            tab_pane: 'postList', 
                            articles
                        })
                    })
                    .catch(err => console.log(err))                
                break;
            case 'category':
                Category.find({author: req.user._id})
                    .then(categories => {
                        res.render('myProfile', { 
                            layout: 'postLayout',
                            tab_pane: 'category',
                            categories
                        })
                    })
                    .catch(err => console.log(err))
                break;
            case 'editProfile':
                res.render('myProfile', { layout: 'postLayout', tab_pane: 'editProfile'})
                break;
            default: 
                res.render('myProfile', { layout: 'postLayout', tab_pane: 'profile'})       
                break;
        }
    }
    else res.render('myProfile', { layout: 'postLayout', tab_pane: 'profile'})
});

router.get('/post/:id', (req, res) => {
    if(req.params.id){
        Post.findOne({ _id: req.params.id})
            .then( post => {
                if(post)
                {
                    Comment.find({ postId: post._id })
                            .populate('author')
                            .exec((err, comments) => {
                                if(err) return console.log(err);
                                res.render('post', { post, comments })
                            })
                    
                }
                else res.render('notFound')
            })
            .catch( err => console.log(err))
    }
});

router.get('/addPost', ensureAuthentication, (req, res) => {
    
    Category.find({ author: req.user._id })
        .then( categories => {
            console.log(categories);
            res.render('addPost', 
              { 
                categories,
                layout: 'postLayout'
                }
            );
        })
        .catch(err => console.log(err));
    
    

});
router.get('/addCategory', ensureAuthentication, (req, res) => res.render('addCategory', { layout: 'postLayout'}));

router.post('/comments/:id', ensureAuthentication, (req, res) => {
    if(req.params.id){
        Post.findOne({ _id: req.params.id })
            .then(post => {
                if(post){
                    const comments = new Comment({
                        author: req.user._id,
                        postId: post._id,
                        body: req.body.body,
                    });

                    comments.save(err => {
                        if (err) return handleError(err)
                    });

                    res.redirect(`/post/${post._id}`);

                } else res.render('notFound')
            })
            .catch(err => console.log(err))
    }
    
})

router.get('/login', (req, res) => res.render('login', { layout: 'formLayout'}));
router.get('/register', (req, res) => res.render('register', { layout: 'formLayout'}));



module.exports = router;