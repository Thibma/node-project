import noteController from './../src/controllers/NoteController';
import userController from './../src/controllers/UserController';

export default (app) => {

  // note routes

  /**
   * - POST /signup
   * - POST /signin
   * - GET /notes
   * - PUT /notes
   * - PATCH /notes/:id
   * - DELETE /notes/:id
   */
  app.get(`/api/notes`, noteController.getAll);
  app.put(`/api/note`, noteController.insert);
  app.patch(`/api/notes/:id`, noteController.update);
  app.delete(`/api/note/:id`, noteController.delete);



  // user routes
  app.post(`/api/signup`, userController.insert)
  app.post('/api/signin', userController.signIn)
  app.put(`/api/user/:id`, userController.update);
  app.delete(`/api/user/:id`, userController.delete);
}
