/** Fichier exécuté en premier par Node
 * Permet d'éxécuter le serveur
 */

import './config/database';
import server from './config/server';

const PORT = process.env.PORT || 5000;

// Démarrage du serveur sur : "localhost:5000"
server.listen(PORT, () => {
  console.log(`app running on port ${PORT}`);
});