module.exports = {
    ensureAuthentication: function(req, res, next){
        
        if( req.isAuthenticated()) return next();

        req.flash('error', 'Please log in before');
        res.redirect('/login');
    }
}