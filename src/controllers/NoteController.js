import Controller from  './Controller';
import NoteService from  "../services/NoteService";
const noteService = new NoteService();

class NoteController extends Controller {

  constructor(service) {
    super(service);
  }
  
}

export default new NoteController(noteService);
