require('dotenv').config();
const express = require('express');
const path = require('path');
var cookieParser = require('cookie-parser');
var session = require('express-session');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);
const pp = require('./passport_init');

const {} = require('./sequelize');

const PORT = process.env.PORT | 3000;

const indexRouter = require('./routes/indexRoute');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ limit: '2mb', extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cookieParser());
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false, cookie: { maxAge: 8640000000 } }));
app.use(pp.passport.initialize());
app.use(pp.passport.session());

app.use('/login', requireNotAuthenticated, pp.router);
app.use('/', requireAuthenticated, indexRouter);

app.get('/logout', (req, res) => {
  req.logOut();
  res.redirect('/');
});

io.on('connection', (socket) => {
  console.log('user connected');

  // socket.disconnect(true);
  
  socket.on('disconnect', function () {
    console.log('user disconnected');
  });
});

// Autenthication checks
function requireAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.locals.role = 'guest';
  res.locals.name = 'Guest';
  res.redirect('/login');
}
function requireNotAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return res.redirect('/');
  }
  res.locals.role = 'guest';
  res.locals.name = 'Guest';
  next();
}

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}\nhttp://127.0.0.1:${PORT}`);
});
