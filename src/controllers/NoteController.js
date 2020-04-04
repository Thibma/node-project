import Controller from  './Controller';
import NoteService from  "../services/NoteService";
const noteService = new NoteService();

class NoteController extends Controller {

  constructor(service) {
    super(service);
    this.getNotes = this.getNotes.bind(this);
    this.createNote = this.createNote.bind(this);
  }
  
  async getNotes(req, res) {
    let response = await this.service.getNotes(req.headers);
    console.log(response);
    res.send(response);
  }

  async createNote(req, res) {
    let response = await this.service.createNotes(req.headers, req.body);
    console.log(response);
    res.send(response);
  }

}

export default new NoteController(noteService);
