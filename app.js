const path = require('path')
const express = require('express');
const mongoose = require('mongoose')
const dotenv = require('dotenv');
const morgan = require('morgan');
const expressHBS = require('express-handlebars');
const methodOverride = require('method-override')
const passport = require('passport')
const session = require('express-session')
const MongoStore = require('connect-mongo')(session)

const connectDB = require('./config/db')

dotenv.config({ path: './config/config.env' })

require('./config/passport')(passport)

connectDB()

const app = express();

app.use(express.urlencoded({ extended: false }))
app.use(express.json())

app.use(methodOverride((req, res) => {
    if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        let method = req.body._method
        delete req.body._method
        return method
    }
}))

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

const { formatDate, stripTags, truncate, editIcon, select } = require('./helpers/hbs');

app.engine('.hbs', expressHBS({
    helpers: {
        formatDate,
        stripTags,
        truncate,
        editIcon,
        select
    },
    defaultLayout: 'main', extname: '.hbs'
}))
app.set('view engine', '.hbs')

app.use(session({
    secret: process.env.PASSPORT_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
}))

app.use(passport.initialize())
app.use(passport.session())

app.use((req, res, next) => {
    res.locals.user = req.user || null
    next()
})

app.use(express.static(path.join(__dirname, 'public')))

app.use('/', require('./routers/index'))
app.use('/auth', require('./routers/auth'))
app.use('/stories', require('./routers/stories'))

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
})