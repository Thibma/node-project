import Controller from  './Controller';
import UserService from  "../services/UserService";
const userService = new UserService();

class UserController extends Controller {

  constructor(service) {
    super(service);
    this.signIn = this.signIn.bind(this);
  }

  async signIn(req, res) {
    let response = await this.service.signIn(req.body);
    if (response.error) return res.status(response.statusCode).send(response);
    return res.status(201).send(response);
  }
}

export default new UserController(userService);
