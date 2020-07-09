# API de gestion de notes personnelles

[Sujet du projet](http://adrienjoly.com/cours-nodejs/05-proj/)

Travaux de groupes réalisés par des étudiants de l'ESGI en troisième année "Mobilité et Objets connectés" :

Groupe 4 :
- BALSAMO Thibault
- DOUKOURE Salayna
- PELLUET Sophie
- VIDAL Leo

## Utilité du projet
Ce projet à pour but d'écrire et de mettre en production une API HTTP de gestion de notes personnelles. Cette API sera le back-end d'une application mobile et d'une application web. (Non compris)

## Fonctionnalités
Chaque utilisateur peut :
- créer un compte en fournissant un identifiant et un mot de passe;
- se connecter à l'aide de son identifiant et mot de passe;
- retrouver ses notes, dans l'ordre anti-chronologique, avec leur date de création et de mise à jour;
- saisir une nouvelle note;
- supprimer n'importe laquelle de ses notes.

## Pré-requis
- [NodeJs](https://nodejs.org/en/)
- Une base de donnée [MongoDB](https://www.mongodb.com/fr)

## Installation
```
$ git clone https://github.com/Thibma/node-project.git
$ cd node-project
$ npm install
```
Si vous souhaitez utiliser le projet en local, :
- Renommez le fichier `.env-deleteThisPartofTheFile` en `.env`
- Inscrivez les valeurs de `PORT` (port du serveur), `MONGODB_URI` (adresse de la base de donnée MongoDB) et `JWT_KEY` (clé pour les token JWT) correspondant à vos souhaits ()

Pour exécuter le serveur :
```
$ npm start
```

## Utilisation du projet :
Rendez-vous à l'addresse `http://localhost:PORT/` (remplacez `PORT` par ce que vous avez entrez dans le fichier `.env`)
Si le serveur fonctionne, le message `Hello World !` devrait apparaître.

## Routes disponibles
- GET `/` : Affiche le message `Hello World !`

- POST `/api/signup` : Permet de créer un utilisateur en renseignant un `username` et un `password` dans le corps de la requête. (Renvoie le Token JWT de l'utilisateur créé)

- POST `/api/signin` : Permet de se connecter à l'aide d'un `username` et d'un `password` déjà enregistré. (Renvoie le Token JWT)

- GET `/api/notes` : Affiche toutes les notes de l'utilisateur connecté dans l'ordre anti-chronologique grâce à son Token rentré dans le header `x-access-token`.

- PUT `api/notes` : Permet de créer une note en rentrant la donnée `content` dans le corps de la requête. L'utilisateur doit être connecté à l'aide de son Token rentré dans le header `x-access-token`. La requête renvoie la note créee.

- PATCH `api/notes/:id` : Permet de modifier une note grâce à son ID rentré en paramètre de la requête. L'utilisateur doit être connecté à l'aide du Token rentré dans le header `x-access-token` pour pouvoir modifier sa note. La requête renvoie la note modifiée.

- DELETE `api/notes/:id` : Permet de supprimer une note grâce à son ID rentré en paramètre de la requête. L'utilisateur doit être connecté à l'aide du Token rentré dans le header `x-access-token` pour pouvoir supprimer sa note.

## Utilisation en production
Le projet peut-être utilisé sur un serveur à distance comme Heroku. Il suffit de créer une application sur le site d'[Heroku](https://www.heroku.com/), suivre les indications et de renseigner les `Config Vars` dans les Settings. (`JWT_JEY` et `MONGODB_URI` seulement)
Lien de l'API en production : 
https://nodejs-group-project.herokuapp.com/
