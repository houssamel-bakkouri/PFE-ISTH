# Gestion des notes des étudiants - Application web

## Description
Ce projet a été réalisé dans le cadre de mon projet de fin d'étude (PFE) au sein de l'Institut Spécialisé en Tourisme et Hôtellerie, une école professionnelle basée à Fès, au Maroc. L'objectif était de concevoir une application web de gestion des notes des étudiants, afin de faciliter la recherche, l'accès et la gestion des différentes données de l'école, et de générer les différents relevés de notes et les bulletins pour chaque étudiant.

## Fonctionnalités
- Gestion des étudiants et de leurs notes
- Recherche et filtrage des données de l'école
- Génération des relevés de notes et des bulletins pour chaque étudiant
- Sécurité renforcée grâce à l'utilisation de JSON web token, bcrypt et httponly cookies
- Base de données MySQL
- API RESTful pour communiquer avec le frontend

## Technologies utilisées
- Backend : Node.js, Express.js, JSON web token, bcrypt, httponly cookies, MySQL
- Frontend : React.js, Bootstrap

## Installation
1. Clonez ce repo sur votre machine
2. Installez les dépendances en exécutant la commande `npm install`
3. Configurez la base de données MySQL en créant une nouvelle base de données et en important le fichier `database.sql`
4. Configurez les variables d'environnement en créant un fichier `.env` à la racine du projet et en y ajoutant les informations de connexion à la base de données ainsi que les informations pour les JSON web token
5. Lancez le serveur en exécutant la commande `npm start`

## Auteur
Ce projet a été réalisé par [votre nom ici].
