// Imports 
const express = require('express'); 
const expressLayouts = require('express-ejs-layouts');
const flash = require('connect-flash');
const passport = require('passport');
const session = require('express-session');

// const morgan = require('morgan')
// const methodOverride = require('method-override')

// Database configuration
const MongoStore = require('connect-mongo')
const connectDB = require('./config/db')
const dotenv = require('dotenv')
dotenv.config({path : './config/.env'})
require('./config/passport')(passport)
connectDB()

const app = express();

// Passport configuration
require('./config/passport')(passport);

// EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');

// BodyParser middleware
app.use(express.urlencoded({extended:false}));

// Express Session Middleware
app.use(session({
    secret: 'nfpoi3n',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ 
        mongoUrl: process.env.MONGO_URI, 
        useNewUrlParser: true, 
        useUnifiedTopology: true 
    })
}));

// Passport MiddleWare
app.use(passport.initialize());
app.use(passport.session());

// Connect flash middleware
app.use(flash());

// Global Vars
app.use((req, res, next)=>{
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    next();
});

// Routes
app.use(express.static("public"));
app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/user', require('./routes/user'));
// app.use('/guest', require('./routes/guest'));

// App specific routes
app.use('/flash', require('./routes/flash'));

// Server
const port = process.env.PORT || 3000;
app.listen(port, console.log(`Server started on port ${port}`));