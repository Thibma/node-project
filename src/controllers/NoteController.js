/** Controller de la partie Notes */

// Importation des Services
import NoteService from  '../services/NoteService';
const noteService = new NoteService();

class NoteController {

  constructor(service) {
    this.service = noteService;
    this.getNotes = this.getNotes.bind(this);
    this.createNote = this.createNote.bind(this);
    this.updateNote = this.updateNote.bind(this);
    this.deleteNote = this.deleteNote.bind(this);
  }

  // get('/api/notes')
  async getNotes(req, res) {
    let response = await this.service.getNotes(req.headers);
    console.log(response);
    if (response.statusCode) {
      res.status(response.statusCode).send(response);
    }
    else {
      res.send(response);
    }
  }

  // put('/api/notes')
  async createNote(req, res) {
    let response = await this.service.createNote(req.headers, req.body);
    console.log(response);
    if (response.statusCode) {
      res.status(response.statusCode).send(response);
    }
    else {
      res.send(response);
    }
  }

  // patch('/api/notes/:id')
  async updateNote(req, res) {
    let response = await this.service.updateNote(req.params.id, req.headers, req.body);
    console.log(response);
    if (response.statusCode) {
      res.status(response.statusCode).send(response);
    }
    else {
      res.send(response);
    }
  }

  // delete('/api/notes/:id')
  async deleteNote(req, res) {
    let response = await this.service.deleteNote(req.params.id, req.headers);
    console.log(response);
    if (response.statusCode) {
      res.status(response.statusCode).send(response);
    }
    else {
      res.send(response);
    }
  }

}

// Utilisé dans /config/routes.js
export default new NoteController();
