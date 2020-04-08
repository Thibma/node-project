  class Controller {

  constructor(service) {
    this.service = service;
    this.getAll = this.getAll.bind(this);
    this.get = this.get.bind(this);
    this.insert = this.insert.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
    this.getByAuthor = this.getByAuthor.bind(this);
  }

  async getAll(req, res) {
    return res.status(response.statusCode).send(await this.service.getAll(req.query));
  }

  async getByAuthor(req, res){
    const { id } = req.params;
    let response = await this.service.getByAuthor(req.query,id)
    return res.status(response.statusCode).send(response);  }

  async get(req, res) {
    let response = await this.service.get(req.params)
    return res.status(response.statusCode).send(response);
  }

  async insert(req, res) {
    let response = await this.service.insert(req.body);
    if (response.error) return res.status(response.statusCode).send(response);
    return res.status(201).send(response);
  }

  async update(req, res) {
    let response = await this.service.update(req.params.id, req.headers, req.body);
    return res.status(response.statusCode).send(response);
  }

  async delete(req, res) {
    let response = await this.service.delete(req.params.id, req.headers);
    return res.status(response.statusCode).send(response);
  }

}

export default Controller;
