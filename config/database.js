/** Fichier source gérant la base de donnée (utilisé une seul fois) */

import mongoose from "mongoose";


/**
 * Singleton: Classe instanciable qu'une fois
 * Il sera automatiquement utiliser par Node lors de son instanciation et donc sera utiliser qu'une fois
 */
// Connexion à la BDD MongoDB en ligne
class Connection {
  constructor() {
    const url =
      process.env.MONGODB_URI || `mongodb+srv://salayna:PraysTheGoblin@nodeapicluster-mushs.mongodb.net/test?retryWrites=true&w=majority`;
    console.log("Establish new connection with database");

    //mongoose.Promise = global.Promise; -> Scope Global peut être appeler à plusieur endroit du code
    mongoose.Promise = global.Promise;
    mongoose.set("useNewUrlParser", true);
    mongoose.set("useFindAndModify", false);
    mongoose.set("useCreateIndex", true);
    mongoose.set("useUnifiedTopology", true);
    mongoose.connect(url);
  }
}

// Utilisé dans /index.js
export default new Connection();
