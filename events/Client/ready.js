const client = require("../../index");
const index = require("../../index.js");
const colors = require("colors");
const config = require('../../config/config.js')
const mysql = require('mysql');
const fetch = require('node-fetch');
const https = require('https');
const remind = require('../../remind.js')
const httpsAgent = new https.Agent({
      rejectUnauthorized: false,
    });
var connection = mysql.createConnection(config.Bdd);

try {
  if(config.Type == "1"){
    console.log("\n" + `[WHMCS] Vous avez choisit WHMCS`);
  }else{
    if(config.Type == "2"){
      console.log("\n" + `[Azuriom] Vous avez choisit Azuriom`);
    }else{
      if(config.Type == ""){
        console.log("\n" + `[Erreur] Vous n'avez pas précisé sur quelle plateforme vous voulez que le bot agisse.`.red);
        process.exit();
      }else{
        console.log("\n" + `[Erreur] Le type précisé est invalide.`.red);
        process.exit();
      }
    }
  }
  if(config.Type == "1"){
    TestConnexion = "SELECT * FROM tbladdons"
    connection.query(TestConnexion, function (error, results, fields) {
      if(error){
        console.log("Vérifiez les informations de connexion à la base de données.".red, "\nVérifiez également que vous avez correctement installé votre CMS.".red)
        process.exit();
      }
    })
  }else{
    if(config.Type == "2"){
      TestConnexion = "SELECT * FROM users"
      connection.query(TestConnexion, function (error, results, fields) {
        if(error){
          console.log("Vérifiez les informations de connexion à la base de données.".red, "\nVérifiez également que vous avez correctement installé votre CMS.".red)
          process.exit();
        }
      })
    }
  }

}catch{}

module.exports = {
  name: "ready.js"
};

client.once('ready', async () => {
  console.log("\n" + `[READY] ${client.user.tag} est prêt.`.brightGreen);

  if(config.Type == "1"){
    GetRequestIfAlreadyInstalled = "SELECT * FROM users"
    connection.query(GetRequestIfAlreadyInstalled, function (error, results, fields) {
      if(error && error.message == "ER_NO_SUCH_TABLE: Table '"+ config.Bdd.database +".users' doesn't exist"){
        console.log("\n" + `[INSTALLATION-AUTOMATIQUE] La base de données n'est pas encore installée, je vais donc l'installer.`.red)
        ImportUsersTable = "CREATE TABLE users ( id varchar(255) NOT NULL PRIMARY KEY, email text NOT NULL, balance text NOT NULL, time text NOT NULL, autotransfert text NOT NULL, dailytime text NOT NULL, weeklytime text NOT NULL, monthlytime text NOT NULL, dailyremind text NOT NULL, weeklyremind text NOT NULL, monthlyremind text NOT NULL, daily text NOT NULL, weekly text NOT NULL, monthly text NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=latin1;"
        connection.query(ImportUsersTable, function (error, results, fields) {
          ImportConfigTable = "CREATE TABLE botadminconfig ( multiplesconnexions text NOT NULL DEFAULT 'yes') ENGINE=InnoDB DEFAULT CHARSET=latin1;"
          connection.query(ImportConfigTable, function (error, results, fields) {
            if(error){
              console.log("\n" + `[INSTALLATION-AUTOMATIQUE] Erreur rencontrée lors de l'installation de la base de données.`.red)
              console.log("\n" + error.message);
            }else{
              InsertConfigTable = `INSERT INTO botadminconfig (multiplesconnexions) VALUES ("yes")`
              connection.query(InsertConfigTable, function (error, results, fields) {
                if(error){
                  console.log(error)
                }
              })
              console.log("\n" + `[INSTALLATION-AUTOMATIQUE] Base de données installée!`.green)
            }
          })
        })
      }
    })
  }else{
    if(config.Type == "2"){
      GetRequestIfAlreadyInstalledAzuriom = "SELECT * FROM botusers"
      connection.query(GetRequestIfAlreadyInstalledAzuriom, function (error, results, fields) {
        if(error && error.message == "ER_NO_SUCH_TABLE: Table '"+ config.Bdd.database +".botusers' doesn't exist"){
          console.log("\n" + `[INSTALLATION-AUTOMATIQUE] La base de données n'est pas encore installée, je vais donc l'installer.`.red)
          ImportUsersTableAzuriom = "CREATE TABLE botusers ( id varchar(255) NOT NULL PRIMARY KEY, email text NOT NULL, balance text NOT NULL, time text NOT NULL, autotransfert text NOT NULL, dailytime text NOT NULL, weeklytime text NOT NULL, monthlytime text NOT NULL, dailyremind text NOT NULL, weeklyremind text NOT NULL, monthlyremind text NOT NULL, daily text NOT NULL, weekly text NOT NULL, monthly text NOT NULL) ENGINE=InnoDB DEFAULT CHARSET=latin1;"
        connection.query(ImportUsersTableAzuriom, function (error, results, fields) {
          ImportConfigTableAzuriom = "CREATE TABLE botadminconfig ( multiplesconnexions text NOT NULL DEFAULT 'yes') ENGINE=InnoDB DEFAULT CHARSET=latin1;"
          connection.query(ImportConfigTableAzuriom, function (error, results, fields) {
            if(error){
              console.log("\n" + `[INSTALLATION-AUTOMATIQUE] Erreur rencontrée lors de l'installation de la base de données.`.red)
              console.log("\n" + error.message);
            }else{
              console.log("\n" + `[INSTALLATION-AUTOMATIQUE] Base de données installée!`.green)
            }
          })
        })
        }
      })
    }
  } 

  setInterval(index.Remind, 60000); 

})