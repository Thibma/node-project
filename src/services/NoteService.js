import mongoose from "mongoose";
import Note from "./../models/Note";
import { response } from "express";

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const jwtExpirySeconds = 300;
const jwtKey="mySecretKey";

class Service {
  constructor() {
    this.model = new Note().getInstance();
    this.getAll = this.getAll.bind(this);
    this.getByAuthor = this.getByAuthor.bind(this);
    this.insert = this.insert.bind(this);
    this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
    this.getNotes = this.getNotes.bind(this);
  }

  async getNotes(data) {
    const token = data['x-access-token'];
    var user = "";
    if (token == null) {
      return response.sendStatus(401);
    }

    jwt.verify(token, jwtKey, (err, username) => {
      if (err) return response.sendStatus(401)
      user = username;
    })
    let dbUser = mongoose.model('users').findOne({ username: user.username });

    console.log(dbUser);

    let items = await this.model.find({ userId: (await dbUser).id} )
    .skip(0)
    .limit(10);
    let total = await this.model.countDocuments();

    return {
      items,
      total
    };
  }

  async createNotes(header, data) {
    const token = header['x-access-token'];
    var user = "";
    if (token == null) {
      return response.sendStatus(401);
    }

    jwt.verify(token, jwtKey, (err, username) => {
      if (err) return response.sendStatus(401)
      user = username;
    })

    let dbUser = mongoose.model('users').findOne({ username: user.username });

    data.userId = new mongoose.mongo.ObjectId((await dbUser)._id);
    data.createdAt = Date.now();
    data.lastUpdateAt = Date.now();

    try {
      let item = await this.model.create(data);
      if (item)
        return {
          error: false,
          item
        };
    } catch (error) {
      console.log("error", error);
      return {
        error: true,
        statusCode: 500,
        message: error.errmsg || "Not able to create item",
        errors: error.errors
      };
    }

  }


  /**
   * GET All Notes
   */
  async getAll(query) {
    let { skip, limit } = query;

    skip = skip ? Number(skip) : 0;
    limit = limit ? Number(limit) : 10;

    delete query.skip;
    delete query.limit;

    if (query._id) {
      try {
        query._id = new mongoose.mongo.ObjectId(query._id);
      } catch (error) {
        console.log("not able to generate mongoose id with content", query._id);
      }
    }

    try {
      let items = await this.model
        .find(query)
        .skip(skip)
        .limit(limit);
      let total = await this.model.count();

      return {
        error: false,
        statusCode: 200,
        data: items,
        total
      };
    } catch (errors) {
      return {
        error: true,
        statusCode: 500,
        errors
      };
    }
  }

  /**
   * GET Notes By Author
   */
  async getByAuthor(authorId){
    let { skip, limit } = query;

    skip = skip ? Number(skip) : 0;
    limit = limit ? Number(limit) : 10;

    delete query.skip;
    delete query.limit;

    if (query._id) {
      try {
        query._id = new mongoose.mongo.ObjectId(query._id);
      } catch (error) {
        console.log("not able to generate mongoose id with content", query._id);
      }
    }

    try {
      let items = await this.model
        .find({author: authorId})
        .skip(skip)
        .limit(limit)
      let total = await this.model.count();

      return {
        error: false,
        statusCode: 200,
        data: items,
        total
      };
    } catch (errors) {
      return {
        error: true,
        statusCode: 500,
        errors
      };
    }

  }

/**
 * INSERT Data in collection 
 */  
  async insert(data) {
    try {
      let item = await this.model.create(data);
      if (item)
        return {
          error: false,
          item
        };
    } catch (error) {
      console.log("error", error);
      return {
        error: true,
        statusCode: 500,
        message: error.errmsg || "Not able to create item",
        errors: error.errors
      };
    }
  }
/**
 * UPDATE Documents based on the ID
 */
  async update(id, data) {
    try {
      let item = await this.model.findByIdAndUpdate(id, data, { new: true });
      return {
        error: false,
        statusCode: 202,
        item
      };
    } catch (error) {
      return {
        error: true,
        statusCode: 500,
        error
      };
    }
  }
/**
 * DELETE the Document
 */
  async delete(id) {
    try {
      let item = await this.model.findByIdAndDelete(id);
      if (!item)
        return {
          error: true,
          statusCode: 404,
          message: "item not found"
        };

      console.log("removed item", item);

      if (item.path) {
        console.log("unlink item", item.path);
        fs.unlink(item.path, function(err) {
          if (err) {
            console.log("error deleting file");
            throw err;
          }
          console.log("File deleted!");
        });
      }

      return {
        error: false,
        deleted: true,
        statusCode: 202,
        item
      };
    } catch (error) {
      return {
        error: true,
        statusCode: 500,
        error
      };
    }
  }
}

export default Service;
