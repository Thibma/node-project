import mongoose, { Schema } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

class Note {

  initSchema() {
    const schema = new Schema({
      titre:{
        type: String,
        required: true,
    },
    contenue:{
        type: String,
        required: true,
    },
    Categorie:{
        type: String,
        required: true, 
    },
    author:{
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    Tag:{
        type: String,
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
