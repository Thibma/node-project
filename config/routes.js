import noteController from './../src/controllers/NoteController';
import userController from './../src/controllers/UserController';

export default (app) => {

  // note routes
  app.get(`/api/note`, noteController.getAll);
  app.get(`/api/note/:params`, noteController.get);
  //-----> WIP ------->
  app.get(`/api/note/author/:params`, noteController.getByAuthor);
  //-----> WIP ------->
  app.post(`/api/note`, noteController.insert)
  app.put(`/api/note/:id`, noteController.update);
  app.delete(`/api/note/:id`, noteController.delete);



  // user routes
  app.get(`/api/user`, userController.getAll);
  app.get(`/api/user/:params`, userController.get);
  app.post(`/api/signup`, userController.insert)
  app.put(`/api/user/:id`, userController.update);
  app.delete(`/api/user/:id`, userController.delete);
}
