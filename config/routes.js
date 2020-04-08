import noteController from './../src/controllers/NoteController';
import userController from './../src/controllers/UserController';

export default (app) => {

  // note routes

  // EN COURS //
  app.get(`/api/notes`, noteController.getNotes);

  app.put('/api/notes', noteController.createNote);

  app.get(`/api/note/:params`, noteController.get);
  //-----> WIP ------->
  app.get(`/api/note/author/:params`, noteController.getByAuthor);
  //-----> WIP ------->
  app.post(`/api/note`, noteController.insert)
  app.patch('/api/notes/:id', noteController.update);
  app.delete(`/api/notes/:id`, noteController.delete);



  // user routes
  app.post(`/api/signup`, userController.insert)
  app.post('/api/signin', userController.signIn)
  app.put(`/api/user/:id`, userController.update);
  app.delete(`/api/user/:id`, userController.delete);
}
