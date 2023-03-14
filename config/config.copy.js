module.exports = {

  Type: "", // 1 = WHMCS / 2 = Azuriom

  ServeurID: "", // l'ID DU SERVEUR

  Prefix: "?", // INUTILISÉ

  Url: "https://localhost/api/index.php", // URL POUR ATTEINDRE LE FICHIER PHP

  Users: {
    OWNERS: ["aa"] // INUTILISÉ
  },

  Client: {
    TOKEN: "", // Token du bot^^
    ID: "" // ID du Bot
  },

  Bdd: {
    host: "", // IP de connexion
    password: "",
    user: "",
    port: "3306",
    database: "",
  },

  Divers: {
    activité: "Système d'économie WHMCS",
    version: "1.8 - Dernière Maj",
  }
}