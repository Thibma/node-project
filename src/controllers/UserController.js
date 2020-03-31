import Controller from  './Controller';
import UserService from  "../services/UserService";
const userService = new UserService();

class UserController extends Controller {

  constructor(service) {
    super(service);
  }
  
}

export default new UserController(userService);
