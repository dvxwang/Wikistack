'use strict';

var Sequelize = require('sequelize');
var db = new Sequelize('postgres://localhost:5432/wikistack');

var Page = db.define('page', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    urlTitle: {
        type: Sequelize.STRING,
        allowNull: false,
    },
    content: {
        type: Sequelize.STRING,
        allowNull: false
    },
    status: {
        type: Sequelize.ENUM('open', 'closed')
    },
    date: {
        type: Sequelize.DATE
    },
    tags: {
        type: Sequelize.ARRAY(Sequelize.TEXT)
    }
},
{
    hooks: {
    	beforeValidate: function(title) {
			var tempTitle=title['dataValues']['title'];
			if (tempTitle) {
				title.urlTitle = tempTitle.toString().replace(/\s+/g, '_').replace(/\W/g, '');
			} else {
				title.urlTitle = Math.random().toString(36).substring(2, 7);
			}
		}
	},
	 getterMethods: {
    	routePath: function(){return ("/wiki/"+this.urlTitle);}
    }
});

var User = db.define('user', {
    name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    email: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

Page.belongsTo(User, { as: 'author' });

module.exports = {
  Page: Page,
  User: User
};