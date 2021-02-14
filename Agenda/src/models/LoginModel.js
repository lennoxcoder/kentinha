const validator = require('validator');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const LoginSchema = new mongoose.Schema({
  email: { type: String, required: true },
  password: { type: String, required: true },
});

const LoginModel = mongoose.model('Login', LoginSchema);

class Login {
  
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.user = null;    
  }


  async login() {

    if (!(await this.validate(false))) return false;
    if (!(await this.userExists())) {
          
      this.errors.push('User does not exists.');  
      return false;
    }
    
    this.user = await LoginModel.findOne({email: this.body.email});

    if(!bcrypt.compareSync(this.body.password, this.user.password)) {

      this.errors.push("Invalid password");
      this.user = null;
      return false;

    };
    
    return true;

  }


  async register() {

    // Form data validation    
    if (!(await this.validate())) return false;

    const salt = bcrypt.genSaltSync();
    this.body.password = bcrypt.hashSync(this.body.password, salt);  
    
    try {
    
      this.user = await LoginModel.create(this.body); 
      return true;
    
    } catch(e) {
      console.log(e);
      return false;
    }          
  }


  
  
  // Precheck
  async validate(register=true) {
    
    this.cleanUp();
    if (!validator.isEmail(this.body.email)) this.errors.push('Invalid email.')
    if(this.body.password.length < 3) this.errors.push('Password too short.')
    if(this.errors.length > 0) return false;

    if(register) {
      if (await this.userExists()) {
        this.errors.push('User exists.')        
      }      
    } else {
      console.log('validating login...')
    } 

    return this.errors.length > 0 ? false : true;
    
  }
  

  
  async userExists() {

    const user = await LoginModel.findOne({email:this.body.email});
    return ( !!user && Object.keys(user).length > 0) ? true : false;  

  }


  cleanUp() {

    this.errors = [];
    // Assim eu garanto que nada mais é "injetado" na requisicao 
    this.body = {
      email: this.body.email,
      password: this.body.password
    };
  }
}

module.exports = Login;
