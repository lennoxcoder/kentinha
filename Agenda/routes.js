const express = require('express');
const route = express.Router();
const controller = require('./src/controllers/controller');

route.get('/', controller.index);
route.get('/login', controller.login);
route.post('/enter', controller.enter);
route.post('/register', controller.register);
route.get('/logout', controller.logout);
route.get('/contacts', controller.contacts)
route.get('/create', controller.createContact);
route.post('/contact/register', controller.contactRegister);
route.get('/contact/delete/:id', controller.deleteContact);


module.exports = route;
