const validator = require('validator');
const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: false },
  phone: { type: String, required: true }  
});

const ContactModel = mongoose.model('Contact', contactSchema);

class Contact {
  
  constructor(body) {
    this.body = body;
    this.errors = [];
    this.contact = null;    
  }

  

  async register() {

    // Form data validation    
    if (!(await this.validate())) return false;

    
    try {
    
      this.contact = await ContactModel.create(this.body); 
      return true;
    
    } catch(e) {
      console.log(e);
      return false;
    }          
  }


  
  
  // Precheck
  async validate() {
    
    this.cleanUp();
    if(!this.body.email) this.body.email = '';
    if(!this.body.name ) this.errors.push('Please insert name.')        
    if(!this.body.phone ) this.errors.push('Please insert phone.')        
    if(this.errors.length > 0) return false;

    
    if (await this.contactExists()) {
      this.errors.push('Contact exists.')        
    }      
  
    return this.errors.length > 0 ? false : true;
    
  }
  

  
  async contactExists() {

    const contact = await ContactModel.findOne({phone:this.body.phone});
    return ( !!contact && Object.keys(contact).length > 0) ? true : false;  

  }


  cleanUp() {

    
    this.errors = [];
    // Assim eu garanto que nada mais é "injetado" na requisicao 
    this.body = {
      name: this.body.name,      
      email: this.body.email,      
      phone: this.body.phone      
    };
  };


  
  
  async readUsers() {
  
    var contacts = await ContactModel.find().sort({name:1});
    if(!contacts) contacts = ''
    return contacts;

  }

  async deleteContact(id) {

    try {
      
      var result = await ContactModel.deleteOne({_id:id});
      return (result.deletedCount==0) ? false : true

    } catch (error) {
      
      console.log(error)
      return false;

    }

  }


}; // class




module.exports = Contact;
