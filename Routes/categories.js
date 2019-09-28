const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

const encode = require('ent/encode');

const category = require('../Models/categories');

// access controler
const ac = require('../Config/accessControler');

// Save article
router.post('/add',[
    check('title')
        .not().isEmpty()
        .withMessage('Please enter title')
        .isLength({min: 2, max: 15})
        .withMessage('The full name must be at least 2 and less than 15 characters long')  
]
,(req, res) => {    
    
    const errors = validationResult(req);
    let  title  = req.body.title;

    if(!req.user) res.statut(500).send();

    if(!errors.isEmpty()){
        errors.array().forEach( error => req.flash('error', error.msg));
        res.render('addCategory', { title, layout: 'postLayout'});
    } else {
        let newCategory = new category();
        newCategory.title = encode(title);
        newCategory.author = req.user._id;

        newCategory.save()
                    .then(category => {
                        req.flash('success', 'Category added');
                        res.redirect('/addCategory');
                    })
                    .catch(err => console.log(err))
    }
});

//  Edit category
router.put('/edit/:id', [

    check('title')
        .not().isEmpty()
        .withMessage('Title can not be empty')
        .isLength({min: 2, max: 15})
        .withMessage('The full name must be at least 2 and less than 15 characters long')  

], (req, res) => {    

    if(!req.user) res.statut(500).send();

    let title = req.body.title
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        errors.array().forEach( error => req.flash('error', error.msg));
        res.render('/addCategory', {title, layout: 'postLayout'});
    }else{

        let category = {};
        category.title = title;
        category.author = req.user._id;

        let query = { _id: req.params.id};

        const persmission = ac.can(req.user.role).updateOwn('category');
        
        if(persmission.granted){    
            category.updateOne(query, category)
                    .then(category => {
                        req.flash('success', 'Category updated');
                        res.redirect('/');
                    })
                    .catch(err => console.log(err))
        }
    }
});

module.exports = router;