const express = require('express')
const bodyParser = require('body-parser')
const expressLayouts = require('express-ejs-layouts')
const mongoose = require('mongoose')
const flash = require('connect-flash')
const session = require('express-session')
const passport = require('passport');
const multer = require('multer')
const path = require('path');
const crypto = require('crypto')
const { GridFsStorage }= require('multer-gridfs-storage')
const Grid = require('gridfs-stream')
const methodOverride = require('method-override')


const app = express()

// Middleware
app.use(bodyParser.json());
app.use(methodOverride('_method'));
app.set('view engine', 'ejs');

// Mongo URI
const mongoURI = 'mongodb+srv://Admin:Admin123456@cluster0.1utcf.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

// DB Config
const db = require('./config/keys').mongoURI

// Create mongo connection
const conn = mongoose.createConnection(mongoURI);

// Passpoer config
require('./config/passport')(passport)

conn.once('open', () => {
  // Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  // console.log("gfs: ", gfs);
});

// connect to Mongo
mongoose
  .connect(
    db,
    { useNewUrlParser: true ,useUnifiedTopology: true}
  )
  .then(() => console.log('MongoDB Connected'))
  .catch(err => console.log(err))


//EJS 
app.use(expressLayouts)
app.set('view engine', 'ejs')

//Public Folder
app.use(express.static('./public'))

//Bodyparser
app.use(express.urlencoded({ extended: false}))

// Express sesion
app.use(session({
  secret: 'secret',
  resave: true,
  saveUninitialized: true
}))

// Passport middleware
app.use(passport.initialize())
app.use(passport.session())

// Connect flash
app.use(flash())

// Global vars
app.use(function(req,res, next) {
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  next()
})

// Routes
app.use('/', require('./routes/index'))
app.use('/users', require('./routes/users'))


const PORT = process.env.PORT || 5000;

app.listen(PORT, console.log(`Server started on Port ${PORT}`))