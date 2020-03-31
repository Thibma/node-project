import mongoose, { Schema } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

class User {

  initSchema() {
    const schema = new Schema({
      nom:{
        type: String,
        required: true,
    },
    prenom:{
        type: String,
        required: true,
    },
    mail:{
        type: String,
        required: true, 
    }
}, { timestamps: true });
    schema.plugin(uniqueValidator);
    mongoose.model("users", schema);
  }

  getInstance() {
    this.initSchema();
    return mongoose.model("users");
  }
}

export default User;
