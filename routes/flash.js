const express = require('express'); 
const router = express.Router();
const { ensureAuth, ensureGuest } = require('../middleware/auth')
const FlashData = require('../models/FlashData');

// Flashcard Dash  ->  GET /flash_dash
router.get('/flash_dash', ensureAuth, (req, res) => {
    const { displayName, _id, flashId, background } = req.user
    FlashData.findOne({_id: flashId}).then( (record) => {
        res.render('app_pages/flash_dash', { 
            name:           displayName,
            email:          _id,
            flashId:        flashId,
            background:     background,
            items:          record.flashcards, 
            categories:     record.categories
        });
    });
});

// Add or update a flashcard  ->  POST /add-card
router.post('/add-card', ensureAuth, (req, res, done) => {
    const { name, email, flashId, question, answer, set, color, cardId } = req.body;
    if (set === '') set = 'Default';
    
    // Add new card
    if (typeof cardId == 'undefined') {
        FlashData.findById(flashId).then( (record) => {
            record.flashcards.push({ question, answer, set, color });
            if (!record.categories.find( (val) =>  val === set )) record.categories.push(set); 
            record.save().then(i => res.redirect('app_pages/flash_dash')).catch(err => res.status(400).send("unable to save to database"));
        });
    }

    // Update an existing card here
    if (typeof cardId === 'string') {
        FlashData.findById(flashId).then( (record) => {
            let card = record.flashcards.find( (card) => card._id == cardId)
            const old_set = card.set;
            let catindex = record.categories.indexOf(old_set);

            card.question = question
            card.answer = answer
            card.set = set
            card.color = color

            if (card.set != old_set){
                //Check if the category exists
                if (!record.categories.find(cat => cat == card.set)) record.categories.push(card.set)
                // Check if category is empty
                if (!record.flashcards.find( (car) => car.set == old_set))
                    record.categories = record.categories.slice(0, catindex).concat(record.categories.slice((catindex+1), record.categories.length));
            }
            record.save().then(i => res.redirect('app_pages/flash_dash')).catch(err => res.status(400).send("unable to save to database"));
        });
        
    }
});

// Delete a flashcard  ->  POST /del-card
router.post('/del-card', ensureAuth, (req, res, next) => {
    var { flashId, _id } = req.body;
    FlashData.findById(flashId).then( (record) => {
        record.flashcards.filter( (card) => {
            if (card._id == _id) {
                let cardIndex = record.flashcards.indexOf(card);
                let cat = card.set;
                let catIndex = record.categories.indexOf(cat);
                
                record.flashcards = record.flashcards.slice(0, cardIndex).concat(record.flashcards.slice((cardIndex+1), record.flashcards.length));
                if (!record.flashcards.find( (car) => car.set == cat))
                    record.categories = record.categories.slice(0, catIndex).concat(record.categories.slice((catIndex+1), record.categories.length));
            }
        });
        record.save().then(i=>res.redirect('app_pages/flash_dash')).catch(err =>res.status(400).send("unable to save to database"));
    });
});

// ---------------------------------------------------------
// --------------- GUEST PAGE ROUTES BELOW -----------------
// ---------------------------------------------------------
// Flashcard Guest Dash  ->  GET /guest_flash_dash
router.get('/guest_flash_dash', ensureGuest, (req, res) => {
    res.render('app_pages/flash_guest', { 
        name:           "Guest",
        email:          "Guest2",
        flashId:        "guest_mode",
        background:     "Papaya",
        items:          [],
        categories:     []
    });
});

// Add or update a flashcard  ->  POST /guest-add-card
router.post('/guest-add-card', ensureGuest, (req, res, done) => {
    let { name, email, flashId, question, answer, set, color } = req.body;
    let card = {question: question, answer: answer, set: set, color: color}
    console.log(req.body)
    // Add new card
    if (req.body.items == '') {
        res.render('app_pages/flash_guest', { 
            name:           "Guest",
            email:          "Guest2",
            flashId:        "guest_mode",
            background:     "Papaya",
            items:          [card],
            categories:     [set]
        });
    }

    // Update an existing card here
    if (typeof cardId === 'string') {
        FlashData.findById(flashId).then( (record) => {
            let card = record.flashcards.find( (card) => card._id == cardId)
            const old_set = card.set;
            let catindex = record.categories.indexOf(old_set);

            card.question = question
            card.answer = answer
            card.set = set
            card.color = color

            if (card.set != old_set){
                //Check if the category exists
                if (!record.categories.find(cat => cat == card.set)) record.categories.push(card.set)
                // Check if category is empty
                if (!record.flashcards.find( (car) => car.set == old_set))
                    record.categories = record.categories.slice(0, catindex).concat(record.categories.slice((catindex+1), record.categories.length));
            }
            record.save().then(i => res.redirect('app_pages/flash_guest')).catch(err => res.status(400).send("unable to save to database"));
        });
        
    }
});

// Delete a flashcard  ->  POST /guest-del-card
router.post('/guest-del-card', ensureGuest, (req, res, next) => {
    var { flashId, _id } = req.body;
    FlashData.findById(flashId).then( (record) => {
        record.flashcards.filter( (card) => {
            if (card._id == _id) {
                let cardIndex = record.flashcards.indexOf(card);
                let cat = card.set;
                let catIndex = record.categories.indexOf(cat);
                
                record.flashcards = record.flashcards.slice(0, cardIndex).concat(record.flashcards.slice((cardIndex+1), record.flashcards.length));
                if (!record.flashcards.find( (car) => car.set == cat))
                    record.categories = record.categories.slice(0, catIndex).concat(record.categories.slice((catIndex+1), record.categories.length));
            }
        });
        record.save().then(i=>res.redirect('app_pages/flash_guest')).catch(err =>res.status(400).send("unable to save to database"));
    });
});

module.exports = router;