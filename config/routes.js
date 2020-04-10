/** Fichier source affichant toutes les routes disponibles du serveur */

// Importation des Controllers
import noteController from './../src/controllers/NoteController';
import userController from './../src/controllers/UserController';

// Utilisé dans /config/server.js
export default (app) => {

  // user routes
  app.post('/api/signup', userController.signUp);  // POST /api/signup
  app.post('/api/signin', userController.signIn);  // POST /api/signin

  // (Admin routes pour le débuggage)
  app.get('/', function(req, res) {
    res.send("Hello world !")
  })
  app.get('/admin/user/getall', userController.getAll); // Non compris dans le sujet
  app.put('/admin/user/:id', userController.update);  // Non compris dans le sujet
  app.delete('/admin/user/:id', userController.delete); // Non compris dans le sujet


  // notes routes
  app.get('/api/notes', noteController.getNotes); // GET /api/notes
  app.put('/api/notes', noteController.createNote); // PUT /api/notes
  app.patch('/api/notes/:id', noteController.updateNote); // PATCH /api/notes/:id
  app.delete('/api/notes/:id', noteController.deleteNote);  // DELETE /api/notes/:id
  
}
