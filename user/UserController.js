const express = require('express');
const router = express.Router();
const User = require('./User');
const bcrypt = require("bcryptjs");

router.get('/admin/users', (req, res) => {
    User.findAll().then(users => {
        res.render('admin/users/index', {users: users});
    })
});

router.get('/admin/users/create', (req, res) => {
    res.render('admin/users/create');
});

router.post('/users/create', async (req, res) => {
    try {
        var email = req.body.email;
        var password = req.body.password;

        if (!email || !password) {
            console.log("Erro: Campos vazios");
            return res.redirect('/admin/users/create');
        }

        User.findOne({where: {email: email}}).then(user => {
            if(user == undefined){
                var salt = bcrypt.genSaltSync(10);
                var hash = bcrypt.hashSync(password, salt);
        
                User.create({
                    email: email,
                    password: hash
                });
        
            }else{
                res.redirect('/admin/users/create');
            }
        })


    } catch (err) {
        console.error("Erro ao criar usuário:", err);
        res.redirect('/admin/users/create');
    }
});
 
module.exports = router;