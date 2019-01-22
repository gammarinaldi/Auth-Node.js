const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const Crypto = require('crypto');

var app = express();
var port = process.env.PORT || 1997;

app.use(bodyParser.json());
app.use(cors());

app.get('/',(req,res) => {
    res.send('<h1>Selamat datang di API!</h1>');
});

app.get('/testencrypt', (req,res) => {
    var hashPassword = Crypto.createHmac("sha384","abc123").update(req.query.password).digest("hex");
    console.log(hashPassword);
    res.send(`Password anda <strong>${req.query.password}</strong> panjangnya ${hashPassword.length} di encrypt menjadi ${hashPassword}`);
});

const { authRouter } = require('./routers');

app.use('./auth', authRouter);

app.listen(port, () => console.log('API aktif di port ' + port));