import mongoose, { Schema } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

class User {

  initSchema() {
    const schema = new Schema({
<<<<<<< HEAD
    username:{
=======
      username:{
>>>>>>> 80435dcf27436ae3d50e7aa00d3f9e933f8e80b8
        type: String,
        required: true,
    },
    password:{
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
