const path = require('path');
const express = require('express');
const routes = require('./controllers/api');
const sequelize = require('./config/connection');
const session = require('express-session');

const SequelizeStore = require('connect-session-sequelize')(session.Store);

const sess = {
    secret: 'YOU SHALL NOT PASS!, i am so seriously not a wizard',
    cookie: {},
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize
    })
};

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session(sess));
//turn on routes
app.use(routes);
app.use(express.static(path.join(__dirname, 'public')));

// turn on connection to db and server
sequelize.sync({ force: false })
  .then(() => {
    app.listen(PORT, () => console.log('Now listening'));
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });



// Compare this snippet from w14\config\connection.js:

const exphbs = require('express-handlebars');
const hbs = exphbs.create({});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');




