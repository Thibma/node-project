/** Fichier contenant tous le code gérant chaque route pour les users */

import mongoose from "mongoose";
import User from "./../models/User";

// Token JWT
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const jwtExpirySeconds = 84500;
const jwtKey="mySecretKey";

class UserWebService {
  constructor() {
    this.model = new User().getInstance();
    this.signUp = this.signUp.bind(this);
    this.signIn = this.signIn.bind(this);

    //A vérifier
    this.getAll = this.getAll.bind(this);
    //this.update = this.update.bind(this);
    this.delete = this.delete.bind(this);
  }

   // post('/api/signup')
  async signUp(data) {

    // Vérification du username et du password
    if (data.password.length < 4) {
      return {
        error: "Le mot de passe doit contenir au moins 4 caractères",
        statusCode: 400
      };
    }
    if (!/^[a-z]+$/.test(data.username)) {
      return {
        error: "Votre identifiant ne doit contenir que des lettres minuscules non accentuées",
        statusCode: 400
      };
    }
    if (data.username.length < 2 || data.username.length > 20) {
      return {
        error: "Votre identifiant doit contenir entre 2 et 20 caractères",
        statusCode: 400
      };
    }
    if (await this.model.findOne({ username: data.username }) != null) {
      return {
        error: "Cet identifiant est déjà associé à un compte",
        statusCode: 400
      };
    }

    // Hashage du mot de passe
    const hashedPassword = bcrypt.hashSync(data.password, 8);
    //console.log("password:", data.password);
    //console.log("hashedPassword:", hashedPassword);
    data.password = hashedPassword;
    //console.log("hashedPassword by data:", data.password);

    // Insertion de l'utilisateur dans la BDD + signature du token
    try {
      let item = await this.model.create(data);
      //console.log("Utilisateur créé");
      let username = data.username;

      const token = jwt.sign({ username }, jwtKey, {
        algorithm: 'HS256',
        expiresIn: jwtExpirySeconds // 24 heures
      });

      //console.log('Token:', token);
        return {
          error: null,
          token
        };
    }

    // Erreurs internes
    catch (error) {
      console.log("Erreur : ", error);
      return {
        error: true,
        statusCode: 500,
        message: error.errmsg || "Impossible de créer l'objet",
        errors: error.errors
      };
    }
  }

  // post('/api/signin')
  async signIn(data){
    //console.log("username : ", data.username);
    //console.log("password : ", data.password);

    // Vérification du username et du password
    if (data.password.length < 4) {
      return {
        error: "Le mot de passe doit contenir au moins 4 caractères",
        statusCode: 400
      };
    }
    if (!/^[a-z]+$/.test(data.username)) {
      return {
        error: "Votre identifiant ne doit contenir que des lettres minuscules non accentuées",
        statusCode: 400
      };
    }
    if (data.username.length < 2 || data.username.length > 20) {
      return {
        error: "Votre identifiant doit contenir entre 2 et 20 caractères",
        statusCode: 400
      };
    }

    let user = await this.model.findOne({ username: data.username });

    try {

      if (user) {

        const hashedPassword = bcrypt.hashSync(data.password, 8);
        //console.log("Mot de passe hash : ", hashedPassword);

        //console.log("User dans la bdd :", user);
        const authenticate = bcrypt.compareSync(data.password, user.password);
        //console.log("Authentifié = ", authenticate);

        if(authenticate) {
          let username = data.username;
          const token = jwt.sign({ username }, jwtKey, {
          algorithm: 'HS256',
          expiresIn: jwtExpirySeconds
          });

          //console.log("Token attribué : ", token);
          return {
            error: null,
            token: token,
          }
 
        }

        else {
          console.log("Mot de passe incorrect.");
          return {
            error: true
          }
        }
        
      }
      else {
        return {
          error: "Cet identifiant est inconnu",
          statusCode: 403
        };
      }
    }
    
    // Erreur internes
    catch (error) {
      console.log("error", error);
      return {
        error: true,
        statusCode: 500,
        message: error.errmsg || "Impossible de créer l'objet",
        errors: error.errors
      };
    }


  }


  // A VERIFIER

  /**
   * GET All User
   */
  async getAll(query) {
    let { skip, limit } = query;

    skip = skip ? Number(skip) : 0;
    limit = limit ? Number(limit) : 50;

    delete query.skip;
    delete query.limit;

    if (query._id) {
      try {
        //Créer un ObjectID à partir de l'ID du Document récupèrer
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
      let total = await this.model.countDocuments();

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
 * UPDATE Documents based on the ID
 */
  /*async update(id, data) {
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
  }*/
/**
 * DELETE the user by his username in parameter
 */
  async delete(username) {
    try {
      let item = await this.model.deleteOne({ username: username });
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

// Clé de sécurité
module.export = jwtKey;

// Utilisé dans /src/controllers/UserControllers.js
export default UserWebService;
