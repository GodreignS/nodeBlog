const multer = require('multer');
const crypto = require('crypto');

const { validationResult } = require('express-validator');

const MiME_TYPES = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpg',
    'image/png': 'png'
};

// this variable is used to differentiate the image storage path
const dest = ['userImage','postImage']

const storage = multer.diskStorage({
    destination: function(req, file, cb){

        let imageType = req.params.imageType;
        
        switch(imageType){
            case dest[0] :
                    cb(null, './public/uploads/userImage');
                break;
            case dest[1] :
                    cb(null, './public/uploads/postImage');
                break;
            default : cb('error');        
        }        
    },
    filename: function(req, file, cb){

        const extension = MiME_TYPES[file.mimetype];

        crypto.pseudoRandomBytes(16, (err, raw) => {
            if(err) return cb(err);
            cb(null, raw.toString('hex') + '.' + extension );
        });        
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 1024*1024 }, // 1MO
    fileFilter: (req, file, cb) =>{  
        const errors = validationResult(req);      
        if(!errors) cb(null, true);
        else return cb(null, false);
    }
});

module.exports = {
    upload,
    dest
};