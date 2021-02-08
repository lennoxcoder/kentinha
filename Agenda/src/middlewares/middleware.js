exports.checkCsrfError = (err, req, res, next) => {
  if(err) {
    return res.render('404', {messages:'CSRF error'});
  } 
  next();
};

exports.csrfMiddleware = (req, res, next) => {
  
  res.locals.error = req.flash('error'); 
  res.locals.messages = req.flash('messages'); 
  res.locals.csrfToken = req.csrfToken();
  res.locals.user = req.session.user; 
  next();
  
};
