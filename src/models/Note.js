/**
 * Modèle des notes
 */

import mongoose, { Schema } from "mongoose";
import uniqueValidator from "mongoose-unique-validator";

class Note {

  // Schéma des notes
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
        // required: false,  // Car "null" lors de la création d'une note.
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

// Utilisé dans /src/services/NoteServices.js
export default Note;
