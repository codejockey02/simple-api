'use strict';

const user = require('./user');
/* const bcrypt = require('bcryptjs'); */

exports.registerUser = (name, email, password, token) =>
    new Promise((resolve,reject) => {
        /* const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt); */

            const newUser = new user({
                name: name,
                email: email,
                password: password,
                token: token,
                created_at: new Date()
            });

            newUser.save()

            .then(()=> resolve({status: 201, message: 'User Registered Successfully'}))       
            .catch(err => {
                if(err.code == 11000){
                    reject({status: 409, message: 'User Already Registered'});
                } else {
                    reject({status: 500, message: 'Internal Server Error !'});
                }

            });
        });