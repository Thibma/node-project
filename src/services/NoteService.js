/** Fichier contenant tous le code gérant chaque routes pour les notes */

require('dotenv').config();
import mongoose from 'mongoose';
import Note from './../models/Note';

// Token JWT
const jwt = require('jsonwebtoken');
const jwtKey = process.env.JWT_KEY;
//console.log("noteservice jwtkey :", jwtKey);

class Service {
  constructor() {
    this.model = new Note().getInstance();
    this.getNotes = this.getNotes.bind(this);
    this.createNote = this.createNote.bind(this);
    this.updateNote = this.updateNote.bind(this);
    this.deleteNote = this.deleteNote.bind(this);
  }

  // get('/api/notes')
  async getNotes(header) {
    let user = await this.verifiedToken(header['x-access-token']); // Vérification du token

    if (user == null) {
      return {
        error : 'Utilisateur non connecté',
        statusCode : 401
      };
    }

    // Utilisateur authentifiés
    try {
      let dbUser = await mongoose.model('users').findOne({ username: user });
      console.log('Utilisateur authentifié :', dbUser.username);

      let notes = await this.model.find({ userId: dbUser.id} ).sort( {createdAt: -1} );

      return {
        error : null,
        notes
      };

    }

    // Erreurs internes
    catch(error) {
      return {
        error : error.message,
        statusCode : 500
      };
    }
  }

  // put('/api/notes')
  async createNote(header, data) {
    let user = await this.verifiedToken(header['x-access-token']); // Vérifications du Token

    if (user == null) {
      return {
        error : 'Utilisateur non connecté',
        statusCode : 401
      };
    }

    // Utilisateur authentifiés
    try {
      let dbUser = await mongoose.model('users').findOne({ username: user });
      console.log('Utilisateur authentifié :', dbUser.username);

      data.userId = new mongoose.mongo.ObjectId(dbUser._id);
      data.createdAt = new Date().getTime() + (2 * 60 * 60 * 1000);
      data.lastUpdateAt = null;

      let note = await this.model.create(data);

      return {
        error : null,
        note
      };
    }

    // Erreurs internes
    catch (error) {
      console.log('Erreur : ', error);
      return {
        error : error.message || 'Impossible de créer la note',
        statusCode : 500
      };
    }
  }

  // patch('/api/notes/:id')
  async updateNote(id, header, data) {
    // Vérifications du Token
    let user = await this.verifiedToken(header['x-access-token']);
    console.log(data.content);
    if (user == null) {
      return {
        error : 'Utilisateur non connecté',
        statusCode : 401
      };
    }

    // Vérification de la data entrante
    if (data.content == null || data.content == '') {
      return {
        error: 'Contenu de la requête vide',
        statusCode: 400
      };
    }

    // Vérification si la note est bien possédée par l'utilisateur
    let verifNote = await this.model.findOne( { _id: id } );
    let dbUser = await mongoose.model('users').findOne( { username: user } );

    if (verifNote.userId.toString() == dbUser._id.toString()) {

      // Utilisateur connecté
      try {
        let note = await this.model.findByIdAndUpdate(id, { content: data.content } );
        let date = new Date().getTime() + (2 * 60 * 60 * 1000);
        note = await this.model.findByIdAndUpdate(id, { lastUpdateAt: date });
        note = await this.model.findOne( { _id: id } );
        console.log('Utilisateur authentifié :', dbUser.username);

        return {
          error : null,
          note
        };

      }

      // Erreurs internes
      catch (error) {
        return {
          error : error.stack,
          statusCode : 500
        };
      }
    }

    // Note non possédée par l'user
    else {
      return {
        error: 'Accès non autorisé à cette note',
        statusCode: 403
      };
    }
  }

  // delete('/api/notes/:id')
  async deleteNote(id, header) {
    // Vérifications du Token
    let user = await this.verifiedToken(header['x-access-token']);
    if (user == null) {
      return {
        error : 'Utilisateur non connecté',
        statusCode : 401
      };
    }

    // Vérification de l'ID de la note.
    try {
      let note = await this.model.findById(id);
      if(!note){
        return {
          error: 'Cet identifiant est inconnu',
          statusCode: 404,
        };
      }

      // Vérification si la note est bien possédée par l'utilisateur
      let dbUser = await mongoose.model('users').findOne({ username: user });
      console.log('Utilisateur authentifié :', dbUser.username);
      if (note.userId.toString() != dbUser._id.toString()) {
        return {
          error: 'Accès non autorisé à cette note',
          statusCode: 403
        };
      }

      // Suppression de la note
      let deleted = await this.model.deleteOne(note);
      console.log('Note supprimée : ', note);

      return {
        error : null
      };
    }

    // Erreurs internes
    catch (error) {
      return {
        error: error.message,
        statusCode: 500
      };
    }
  }

  // Fonction vérifiant les Token entrant
  async verifiedToken(token) {
    var user = '';
    // Vérification du Token
    if (token == null) {
      return user = null;
    }

    // Décodage du token
    try{
      let decoded = jwt.verify(token, jwtKey);
      return user = decoded.username;
    }
    catch(err) {
      return user = null;
    }
  }
}

// Utilisé dans /src/controllers/NoteController.js
export default Service;
