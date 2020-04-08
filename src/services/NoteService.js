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
        message: error.message || "Not able to create item",
        // message: error.errmsg || "Not able to create item",
        errors: error.errors
      };
    }
  }

  async getNotes(data) {
    const token = data['x-access-token'];
    var user = "";
    if (token == null) {
      return { 
        error : 'Utilisateur non connecté',
        statusCode : 401
      };
    }

    try{
      let decoded = jwt.verify(token, jwtKey);
      user = decoded.username;
    }catch(err){
      return {
        error: 'Utilisateur non connecté',
        statusCode: 401
      };
    }

    try{
      let dbUser = await mongoose.model('users').findOne({ username: user });
      console.log("user is authentified :", dbUser.username);

      let notes = await this.model.find({ userId: (await dbUser).id} )
      .skip(0)
      .limit(10);
      //let total = await this.model.countDocuments();

      return {
        error : null,
        notes,
        statusCode : 200
      };

    }catch(error){
        return {
          error : error.message,
          statusCode : 500
        }
    }
  }

  async createNotes(header, data) {
    const token = header['x-access-token'];
    var user = "";
    if (token == null) {
      response.status(401);
      return { 
        error : 'Utilisateur non connecté',
        statusCode : 401
      };
    }

    try{
      let decoded = jwt.verify(token, jwtKey);
      user = decoded.username;
    }catch(err){
      return {
        error: 'Utilisateur non connecté',
        statusCode: 401
      };
    }

    try {
      let dbUser = await mongoose.model('users').findOne({ username: user });
      console.log("user is authentified :", dbUser.username);
  
      data.userId = new mongoose.mongo.ObjectId((await dbUser)._id);
      data.createdAt = Date.now();
      data.lastUpdateAt = Date.now();

      let note = await this.model.create(data);
      if (note)
      response.status(201);
        return {
          error: null,
          note,
          statusCode : 201
        };
    } catch (error) {
      console.log("error", error);
      response.status(500);
      return {
        error: error.message || "Not able to create item",
        statusCode: 500 
      };
    }
  }

/**
 * UPDATE Documents based on the ID
 */
  async update(id, idToken, data) {
    const token = idToken['x-access-token'];
    var user = "";
    if (token == null) {
      return { 
        error : 'Utilisateur non connecté', 
        statusCode : 401
      };
    }

    try{
      let decoded = jwt.verify(token, jwtKey);
      user = decoded.username;
    }catch(err){
      return {
        error: 'Utilisateur non connecté',
        statusCode: 401
      };
    }
    
    if(data.content == null || data.content == ""){
      return {
        error: 'Contenu de la requête vide',
        statusCode: 400
      }
    }

    try {
      let note = await this.model.findByIdAndUpdate(id, { content: data.content });
      note = await this.model.findOne({ _id: id });

      let dbUser = await mongoose.model('users').findOne({ username: user });
      console.log("user is authentified :", dbUser.username);

      if(note.userId.toString() == dbUser._id.toString()){
        return {
          error : null,
          statusCode : 202,
          note
        };
      }else{
        return {
          error: "Accès non autorisé à cette note",
          statusCode: 403
        }
      }

    } catch (error) {
      return {
        error : error.stack,
        statusCode : 500
      };
    }
  }
/**
 * DELETE the Document
 */
  async delete(id, tokenId) {
    const token = tokenId['x-access-token'];
    var user = "";
    if (token == null) {
      return { 
        error : 'Utilisateur non connecté',
        statusCode : 401
      };  
    }

    try{
      let decoded = jwt.verify(token, jwtKey);
      user = decoded.username;
    }catch(err){
      return {
        error: 'Utilisateur non connecté',
        statusCode: 401
      };
    }
    
    try {
      let note = await this.model.findById(id);
      if(!note){
        return {
          error: "item not found",
          statusCode: 404,
        };
      }
      let dbUser = await mongoose.model('users').findOne({ username: user });
      console.log("user is authentified :", dbUser.username);

      if(note.userId.toString() != dbUser._id.toString()){
        return {
          error: "Accès non autorisé à cette note",
          statusCode: 403
        }
      }
      let deleted = await this.model.deleteOne(note)

      console.log("removed item", note);

      if (deleted.path) {
        console.log("unlink item", deleted.path);
        fs.unlink(deleted.path, function(err) {
          if (err) {
            console.log("error deleting file");
            throw err;
          }
          console.log("File deleted!");
        });
      }
      return {
        error: null,
        statusCode: 202,
      };

    } catch (error) {
      return {
        error: error.message,
        statusCode: 500,
      };
    }
  }
}

export default Service;
