'use strict';

const auth = require('basic-auth');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const jsonminify = require('jsonminify');
const register = require('./register.js');
const login = require('./login.js');
const user = require('./user.js');
var randomstring = require("randomstring");

 
module.exports = router => {

	router.get('/', (req, res) => res.status(200).send("Okay, So this is working."));

	router.post('/login', (req, res) => {
		
		async function checking(){
			const credentials = req.body.email;
                const cred = await user.collection.findOne({email:credentials},{email: 1 , _id:0});
                if (cred.email == credentials) {
                    const pwd = req.body.password;
                        
                    const veri = await user.collection.findOne({email: credentials, password: pwd },{password:1 , _id:0});
                        if(veri.password == pwd) {
                            res.status(201).json({message: 'User Authenticated !'});
                            var key = randomstring.generate();
                            user.collection.update(
                                {email: credentials},
                                {
                                    $set: {
                                        "token": key
                                    }
                                }
                            );
                            } else {
                                res.status(401).json({message: 'Nopsi'});
                            }
                    
                } else {
    
                    res.status(400).json({ message: 'Invalid Request !' });	
                }
            
			
		
        }	
		checking();

		});
		
			/* login.loginUser(credentials.name, credentials.pass)

			.then(result => {

				const token = jwt.sign(result, config.secret, { expiresIn: 1440 });

				res.status(result.status).json({ message: result.message, token: token });

			})

			.catch(err => res.status(err.status).json({ message: err.message }));
		} */
	

	router.post('/signup', (req, res) => {

		const name = req.body.name;
		const email = req.body.email;
        const password = req.body.password;
        const token = req.body.token;

		if (!name || !email || !password || !name.trim() || !email.trim() || !password.trim()) {

			res.status(400).json({message: 'Invalid Request !'});

		} else {

			register.registerUser(name, email, password, token)

			.then(result => {

				res.setHeader('Location', '/users/'+email);
				res.status(result.status).json({ message: result.message })
			})

			.catch(err => res.status(err.status).json({ message: err.message }));
		}
	});	
};