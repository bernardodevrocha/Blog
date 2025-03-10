const Sequelize = require('sequelize');
const connection = require('../config/database');
const Category = require('../categories/Category');
const { FORCE } = require('sequelize/lib/index-hints');

const Article = connection.define('article', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slug: {
        type: Sequelize.STRING,
        allowNull: false
    },
    body: {
        type: Sequelize.TEXT,
        allowNull: false
    }
});

Category.hasMany(Article); // Um para muitos
Article.belongsTo(Category); // Um artigo pertence a uma categoria



module.exports = Article;