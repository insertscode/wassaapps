// Creating a flashcard
const mongoose = require('mongoose');
const CardSchema = new mongoose.Schema({
    question:   {type:String, required: true},
    answer:     {type:String, required: true},
    set:        {type:String, required: false},
    color:      {type:String, required: true},
    date:       {type:Date, default:Date.now}
    }, {versionKey:false}
);

const DeckSchema = new mongoose.Schema({
    displayName:    {type:String, required: true},
    email:          {type:String, required: true},
    background:     {type:String, default: 'Papayawhip'},
    flashcards:     [CardSchema], 
    categories:     {type:Array, required: false}
    }, {versionKey:false}
);

module.exports = mongoose.model('FlashData', DeckSchema);