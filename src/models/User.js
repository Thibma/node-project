/** Modèle pour les User */

import mongoose, { Schema } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

class User {

  // Schéma de User pour mongodb
  initSchema() {
    const schema = new Schema({
      username:{
        type: String,
        required: true,
      },
      password:{
        type: String,
        required: true,
      }
    }, { timestamps: true });
    schema.plugin(uniqueValidator);
    mongoose.model('users', schema);
  }

  getInstance() {
    this.initSchema();
    return mongoose.model('users');
  }
}

// Utilisé dans /src/services/UserService.js
export default User;
