const db = require('mysql');
const express = require('express');
const bcrypt = require('bcrypt');
const app = express();
var autoinc = 1;
var table = []
app.set('view-engine', 'ejs');
app.use(express.urlencoded({ extended: false }));

//create DataBase for Store and Manipulated Chat App Data
const con = db.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'registration',
});

const tableCreate = "create table if not exists reguser (userId INT AUTO_INCREMENT primary key,Contact varchar(11) unique KEY,Name varchar(30),Profile varchar(30) unique key,Password varchar(30))";
const create = con.query(tableCreate, function (err, result) { if (err) throw err });

// routes start
app.get('/', (req, res) => {
    res.render('Register.ejs', { regi: 'this is register page' });
});

app.get('/Register', (req, res) => {
    res.render('Register.ejs', { regi: 'this is register page' });
});

app.post('/login', async (req, res) => {
    console.log(req.body)
    try {
        var sql = 'SELECT * FROM reguser WHERE Profile = ? AND Password = ?';
        con.query(sql, [req.body.profile, req.body.pwd], function (err, result) {
            if (err) throw err;
            console.log(result)
            result.forEach(element => {
                console.log(element);
                console.log(element.Contact);
            });
            if (result.length > 0) {
                res.redirect('/chat')
            } else {
                res.redirect('/login?invalid=1')
            }
        })
    }
    catch (error) {
        console.log(error);
        res.redirect('/login')
    }

});

app.get('/login', (req, res) => {
    res.render('login.ejs', { login: 'this is login page' })
});

// Register page post
app.post('/Register', async (req, res) => {
    try {
        // const hashpassword = await bcrypt.hash(req.body.password, 10)
        console.log(req.session);
        table.push({
            id: autoinc++,
            name: req.body.name,
            profile: req.body.profile,
            contact: req.body.contact,
            password: req.body.password
        })
        //console.log(table);
        const insertData = "Insert Into reguser(contact,Name,Profile,Password) values('" + req.body.contact + "','" + req.body.name + "','" + req.body.profile + "','" + req.body.password + "')";
        const insertOperation = con.query(insertData, function (err, result) { if (err) throw err })
        res.redirect('/login')

    }
    catch (error) {
        console.timeLog(error)
        res.redirect('/Register')
        console.log(req.body.name + " catch");
    }
});

app.get('/chat', (req, res) => {
    res.render('chat.ejs', { login: 'this is login page' })
});
// routes end

app.listen(3000);