const accessControl = require('accesscontrol');

const admin = {

    user: {
        'create:any': ['*'],
        'read:any': ['*', '!password'],        
        'delete:any': ['*']
    },

    post: {
        'create:any': ['*'],
        'read:any': ['*'],        
        'delete:any': ['*']
    },
    category: {
        'create:any': ['*'],
        'read:any': ['*'],        
        'delete:any': ['*']
    },
    comment: {
        'create:any': ['*'],
        'read:any': ['*'],        
        'delete:any': ['*']
    }

};

const user = {
    post: {
        'create:own': ['*'],
        'read:any': ['*', '!id'],
        'update:own': ['*', '!author'],
        'delete:own': ['*']
    },
    category: {
        'create:own': ['*'],
        'read:any': ['*', '!id'],
        'update:own': ['*', '!author'],
        'delete:own': ['*']
    },
    comment: {
        'create:own': ['*'],
        'read:any': ['*', '!id'],
        'update:own': ['*', '!author'],
        'delete:own': ['*']
    }
};

const grantsObject = {
    admin: admin,
    user: user
};

module.exports = new accessControl(grantsObject);;