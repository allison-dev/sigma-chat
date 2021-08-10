const exp = require('constants');
const express = require('express');
const multer = require('multer')
const upload = multer({ dest: 'uploads/' })
const path = require('path');
const axios = require('axios')

const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

const { uploadFile, getFileStream } = require('./s3');

app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'public'));
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.use(express.urlencoded());
app.use(express.json());

app.get('/', (req, res) => {
    res.render('index.html');
});

let messages = [];
var socket_id = 0;

io.on('connection', socket => {
    console.log(`Socket Conectado: ${socket.id}`);

    socket_id = socket.id;

    socket.emit("previousMessages", messages);

    socket.emit("clientId", socket_id);

    socket.on("sendMessage", data => {
        messages.push(data);
        // socket.broadcast.emit("recivedMessage", data);
        axios.post('https://sigmademo.nuvetoapps.com.br/chat/message', data).then((res) => {
            console.log(`statusCode: ${res.status}`);
            console.log(res);
        }).catch((error) => {
            console.error(error)
        });
    });
});

app.get('/images/:key', (req, res) => {
    const key = req.params.key;
    const readStream = getFileStream(key);

    readStream.pipe(res);
});

app.post('/images', upload.single('file'), async (req, res) => {
    const file = req.file;
    console.log(file);
    const result = await uploadFile(file);
    console.log(result);
    res.send(result.Key);
});

app.post('/chat/callback', (req, res) => {
    messages.push(req.body);
    io.sockets.to(req.body.client_id).emit("recivedMessage", req.body);
    res.status(200).json(req.body);
});

server.listen(process.env.PORT || 3000);