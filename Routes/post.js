const express = require('express');
const router = express.Router();

const post = require('../Models/posts');

const { upload, dest} = require('../Config/upload');

const {check, validationResult } = require('express-validator');

const encode = require('ent/encode');

// Save post 

router.post('/add/:imageType', upload.single('postImage'), [

    check('title')
        .not().isEmpty()
        .withMessage('Enter title')
        .isLength({min: 2, max: 20})
        .withMessage('The full name must be at least 2 and less than 20 characters long'),
    check('subTitle')                
        .isLength({min: 2, max: 100})
        .withMessage('The full name must be at least 2 and less than 20 characters long'),
    check('category')
        .not().isEmpty()
        .withMessage('Select category'),
    check('postBody')
        .not().isEmpty()
        .withMessage('Say something in body')

], (req, res) => {
    
    const errors = validationResult(req);
    let { title, subTitle, category, postBody } = req.body;

    if(!req.user) res.statut(500).send();

    if(!errors.isEmpty())
    {
        errors.array().forEach( error => req.flash('error', error.msg));
        res.render('addCategory', { 
            title,
            subTitle,
            category,
            postBody,
            layout: 'postLayout'});
    }
    else
    {
        if(dest.some( destination => destination == req.params.imageType)){

            if(req.file) urlImage = req.file.filename;
            else urlImage = "defaultImage.jpg";   

            let newPost = new post({
                title: encode(title),
                subTitle: encode(subTitle),
                category: encode(category),
                body: encode(postBody),
                urlImage,
                author: req.user._id
            });

            newPost.save()
                    .then( post => {
                        req.flash('success', 'Post added');
                        res.redirect('/addPost');
                    })
                    .catch(err => console.log(err))                        

        }
    }
} );

module.exports = router;