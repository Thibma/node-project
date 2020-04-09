/** Controller de la partie Users */

// Importation des services
import UserService from  "../services/UserService";
const userService = new UserService();

class UserController {

  constructor() {
    this.service = userService;
    this.signUp = this.signUp.bind(this);
    this.signIn = this.signIn.bind(this);

    // A VERIFIER
    this.getAll = this.getAll.bind(this);
    this.get = this.get.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
    this.getByAuthor = this.getByAuthor.bind(this);
  }

  // post('/api/signup')
  async signUp(req, res) {
    let response = await this.service.signUp(req.body);
    console.log(response);
    if (response.statusCode) {
      res.status(response.statusCode).send(response);
    }
    else {
      res.send(response);
    }
  }

  // post('/api/signin')
  async signIn(req, res) {
    let response = await this.service.signIn(req.body);
    console.log(response);
    if (response.statusCode) {
      res.status(response.statusCode).send(response);
    }
    else {
      res.send(response);
    }
  }

  async getAll(req, res) {
    return res.status(200).send(await this.service.getAll(req.query));
  }

  async getByAuthor(req, res){
    const { id } = req.params;
    let response = await this.service.getByAuthor(req.query,id)
    return res.status(response.statusCode).send(response);  }

  async get(req, res) {
    let response = await this.service.get(req.params)
    return res.status(response.statusCode).send(response);
  }

  async update(req, res) {
    const { id } = req.params;

    let response = await this.service.update(id, req.body);

    return res.status(response.statusCode).send(response);
  }

  async delete(req, res) {
    let response = await this.service.delete(req.params.id);
    return res.status(response.statusCode).send(response);
  }

}

// Utilisé dans /config/routes.js
export default new UserController();
