const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const connection = require('./config/database');
const Article = require('./articles/Article');
const Category = require('./categories/Category');
const session = require('express-session');

const categoriesControllers = require('./categories/CategoriesController');
const articleControllers = require('./articles/ArticlesControllers');
const usersControllers = require('./user/UserController');
const User = require('./user/User');

// Engines
app.set('view engine', 'ejs');

// Session
app.use(session({
    secret: "MinhaPalavraSecreta",
     cookie: {maxAge: 30000000000},
    resave: true,
     saveUninitialized: true
})
);

// Static
app.use(express.static('public'));

// Body Parser
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

app.use('/', usersControllers);
app.use('/', categoriesControllers);
app.use('/', articleControllers);


app.get('/session', (req, res) => {
    req.session.treinamento = "Formação NodeJS"
    req.session.ano = 2019
    req.session.email = 'bernardo@email.com'
    req.session.user = {
        username: 'devberna',
        email: 'bernardo@email.com',
        id: 10
    }
    res.send('Sessão Gerada!');
});

app.get('/leitura', (req, res) => {
    res.json({
        treinamento: req.session.treinamento,
        ano: req.session.ano,
        email: req.session.email,
        user: req.session.user
    })
})


// Database
connection
    .authenticate()
    .then(() => {
        console.log('Conexão feita com sucesso!');
    }).catch((error) => {
        console.log(error);
    })

app.use('/', categoriesControllers);
app.use('/', articleControllers);

app.get('/', (req, res) => {
    Article.findAll({
        order: [
            ['id', 'DESC']
        ],
        limit: 4
    }).then(articles => {

        Category.findAll().then(categories => {
            res.render('index', {articles: articles, categories: categories});
        });

    });
});

app.get('/:slug', (req, res) => {
    var slug = req.params.slug;
    Article.findOne({
        where:{
            slug: slug
        }
    }).then(article => {
        

        if(article != undefined){
            Category.findAll().then(categories => {
                res.render('article', {article: article, categories: categories});
            });
        }else{
            res.redirect('/');
        }
    }).catch(err => {
        res.redirect('/');
    })
})

app.get('/category/:slug', (req, res) => {
    var slug = req.params.slug;
    Category.findOne({
        where: {
            slug: slug
        },
        include: [{model: Article}]
    }).then(category => {
        if(category != undefined){
            Category.findAll().then(categories => {
                res.render('index', {articles: category.articles, categories: categories});    
            })
        }else{
            res.redirect('/');
        }
    }).catch(err => {
        res.redirect('/');
    })
})

app.listen(3000, (req, res) => {
    console.log("Servidor em execução!");
    console.log('http://localhost:3000');
})