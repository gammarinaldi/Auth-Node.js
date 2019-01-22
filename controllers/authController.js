const conn = require('../database');
const Crypto = require('crypto');
const transporter = require('../helpers/mailer');

module.exports = {
    register: (req,res) => {
        var { username, password, fullname, email, phone } = req.body;
        var sql = `SELECT username FROM users WHERE username = '${username}'`;
        conn.query(sql, (err,results) => {
            if(err) { 
                res.send({ status: 'error', message: 'System error' }); //res.send masuknya ke then axios
                res.end();
            }
            if(results.length > 0) res.send({ status: 'error', message: 'Username has been taken.' }); //res.send masuknya ke then axios
            else { 
                var hashPassword = Crypto.createHmac("sha256","password")
                                    .update(password).digest("hex");
                var dataUser = { 
                    username,
                    password: hashPassword,
                    fullname,
                    email,
                    phone,
                    role: 'User',
                    status: 'Unverified',
                    lastlogin: new Date()
                 }
                sql = `INSERT INTO users SET ?`;
                conn.query(sql,dataUser, (err1,result1) => {
                    if(err1) { 
                        res.send({ status: 'error', message: 'System error' }); //res.send masuknya ke then axios
                        res.end();
                    }

                    var mailOptions = {
                        from: 'no-reply <gammarinaldi@yahoo.com>',
                        to: email,
                        subject: 'Email verification',
                        html: `Click this link to verifiy your account: ${verificationLink}`
                    }

                    transporter.sendMail(mailOptions, (err,res1) => {
                        if(err) {
                            res.send({ status: 'Error' });
                        } else {
                            res.send({ status: 'Success' });
                        }
                    });

                });
            }
        });
    },
    login: (req,res) => {

    }
}