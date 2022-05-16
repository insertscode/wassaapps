// Main Routes 
const express = require('express'); 
const router = express.Router();

const FlashData = require('../models/FlashData');
const User = require('../models/User');

// Rendered pages
router.get('/', (req, res) => res.render('welcome'));
router.get('/register', (req, res) => res.render('register'));
router.get('/login', (req, res) => res.render('login'));

// RegisterUser Handler
router.post('/register', (req, res) => {
    const { name, email, background, password, password2 } = req.body;
    let errors = [];
    if (!name || !email || !password || !password2) errors.push({msg:'You must fill in all required fields'});
    if (password.length < 5) errors.push({msg:'Password should be atleast 5 characters long'});    
    if (password !== password2) errors.push({msg:'Passwords do not match'});
    if (errors.length > 0) res.render('register', {errors, name, email, password, password2});
    else {
        User.findOne({email:email}).then( user => {
            if (user) {
                errors.push({msg:"Email is already in use."})
                res.render('register', { errors, name, email, password, password2 });
            } else {
                // Create the new user
                const newUser = new User({name, email, password});
                const newData = new FlashData({ name, email, background, flashcards:{question: "Whats round, brown, and sticky?", answer:"A stick!", set:"Example", color:"Peru"}, categories: ['Example']});
                // Hashing the pass
                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, passhash) => {
                        if (err) throw err;
                        newUser.password = passhash;
                        newUser.save().then(user => {
                            newData.save().then().catch(err => console.log(err));
                            req.flash('success_msg', 'You are registered and ready to login.');
                            res.redirect('/login');
                        }).catch(err => console.log(err));
                    })
                })
            }
        })
        .catch()
    }
});

// Logout Handler
router.get('/logout', (req, res) => {
    req.logout(); 
    req.flash('success_msg', 'Logout Successful'); 
    res.redirect('/');
});

module.exports = router;