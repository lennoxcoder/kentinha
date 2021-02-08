const express = require('express');
const app = express();
const mongoose = require('mongoose');


const connectionString='mongodb+srv://lennox:<pass>@cluster0.xxbnf.mongodb.net/AGENDA?retryWrites=true&w=majority'

mongoose.connect(connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.emit('ready');
  })
  .catch(e => console.log(e));



const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
const flash = require('connect-flash');
const routes = require('./routes');
//const helmet = require('helmet');
const csrf = require('csurf');
const { checkCsrfError, csrfMiddleware } = require('./src/middlewares/middleware');


// Eu percebi que quando estamos no localhost, 
// o helmet bloqueia os scripts de serem importados.
//app.use(helmet());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("./public"));
app.use(flash());


const sessionOptions = session({
  secret: 'secret',
  store: new MongoStore({ mongooseConnection: mongoose.connection }),
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000*60*5,
    httpOnly: true
  }
});


app.use(sessionOptions);

app.set('views', "./src/views")
app.set('view engine', 'ejs');

app.use(csrf());
app.use(checkCsrfError);
app.use(csrfMiddleware);

app.use(routes);


app.on('ready', () => {
  app.listen(3000, () => {
    console.log('Acessar http://localhost:3000');    
  });
});

