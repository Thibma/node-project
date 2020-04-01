import mongoose, { Schema } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

class Note {

  initSchema() {
    const schema = new Schema({
    userId:{
        type: mongoose.Types.ObjectId,
        required: true,
    },
    content:{
        type: String,
        required: true, 
    },
    createdAt:{
      type: Date,
      required: true,
    },
    lastUpdateAt:{
        type: Date,
        required: true,
    }
}, { timestamps: true });
    schema.plugin(uniqueValidator);
    mongoose.model("notes", schema);
  }
//Similaire à ce qu'on a fait avec Briatte on renvoie une instance du model
  getInstance() {
    this.initSchema();
    return mongoose.model("notes");
  }
}

export default Note;
