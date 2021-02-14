const Login = require('../models/LoginModel');
const Contact = require('../models/contactModel');


// Start page
exports.index = (req, res) => {
  res.render('index');
};


// Login page
exports.login = (req, res) => {
  res.render('login');
};



exports.register = async function(req, res) {
  // Aqui devemos validar o form
  try {
    
    const login = new Login(req.body);
    if(await login.register()) {
      req.flash('messages', 'User created with success.');
      req.flash('error', 'false');
      res.redirect('/contacts');  
      
    } else {

      console.log(login.errors);
      req.flash('messages', login.errors);
      req.flash('error', 'true');
      req.session.save();      
      res.redirect('back');
    }  

  } catch (error) {
    
    console.log(error);
    res.render('404', {message:'Register error'});

  }
};




exports.enter = async function(req, res) {

  try {
    
    const login = new Login(req.body);
    if(await login.login()) {
      req.flash('messages', 'Login success.');
      req.session.user = login.user;
      req.flash('error', 'false');
      const contact = new Contact('');
      const clist = await contact.readUsers()
      
      req.session.save(() => {
        res.render('contacts', {clist});
      })

        
          
    } else {

      console.log(login.errors);
      req.flash('messages', login.errors);
      req.flash('error', 'true');
      res.redirect('back');
      
    }  

  } catch (error) {
    
    console.log(error);
    res.render('404', {message:'Login error'});

  }
}



exports.logout = (req, res) => {
  req.session.destroy();
  res.redirect('/');
}




exports.createContact = (req, res) => {

  if(!req.session.user) {

    console.log('createContact : User not logged in')
    req.flash('messages', 'User not logged in');
    req.flash('error', 'true');
    req.session.save(function() {
      res.render('index');      
    })

  } else {    

    res.render('createContact');
    
  }
  
}



exports.contacts = async function(req, res) {

  const contact = new Contact('');
  const clist = await contact.readUsers()
  if(!clist) {
    clist = 'Contacts list is empty'    
  }  
  res.render('contacts', {clist});
   
  
}





exports.contactRegister = async function(req, res) {
  
  // Aqui devemos validar o form
  try {
    
    const contact = new Contact(req.body);
    if(await contact.register()) {
      strMsg = 'User created with success.';
      console.log(strMsg);
      req.flash('messages', strMsg);
      req.flash('error', 'false');
      req.session.save(function() {
        res.redirect('/contacts');
      })
      
    } else {

      console.log(contact.errors);
      req.flash('messages', contact.errors);
      req.flash('error', 'true');
      req.session.save(function(err) {
        if(err) console.log(err);
        res.render('createContact');
      })
            
    }  

  } catch (error) {
    
    console.log(error);
    res.render('404', {message:'Contact register error'});

  }
};



exports.deleteContact = async function(req, res) {

  if(!req.params.id) return res.render('404', {message: 'User ID needed.'})
  const contact = new Contact(req.body);
  result = await contact.deleteContact(req.params.id);
  var strMsg = '';

  if(result) {

    strMsg = 'Contact deleted.'
    req.flash('error', 'false');

  } else {

    strMsg = 'Contact does not exists.'
    req.flash('error', 'true');

  }

  console.log(strMsg);
  req.flash('messages', strMsg);
  req.session.save(function() {
    res.redirect('/contacts');
  })

};


