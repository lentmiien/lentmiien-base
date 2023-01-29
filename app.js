require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const PORT = process.env.PORT | 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ limit: '2mb', extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => res.render("index"));

io.on('connection', (socket) => {
  console.log('user connected');
  
  socket.on('disconnect', function () {
    console.log('user disconnected');
  });
})

server.listen(PORT, () => {
  console.log(`Listening on port ${PORT}\nhttp://127.0.0.1:${PORT}`);
});
