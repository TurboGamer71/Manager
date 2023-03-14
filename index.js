const { Client, Partials, Collection, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const config = require('./config/config');
const colors = require("colors");

// Creating a new client:
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent
  ],
  partials: [
    Partials.Channel,
    Partials.Message,
    Partials.User,
    Partials.GuildMember,
    Partials.Reaction
  ],
  presence: {
    activities: [{
      name: config.Divers.activité,
      type: 0
    }],
    status: 'dnd'
  }
});

// Host the bot:
// require('http').createServer((req, res) => res.end('Ready.')).listen(3000);

// Getting the bot token:
const AuthenticationToken = process.env.TOKEN || config.Client.TOKEN;
if (!AuthenticationToken) {
  console.warn("[CRASH] Token non inscrit!".red)
  return process.exit();
};

// Handler:
client.prefix_commands = new Collection();
client.slash_commands = new Collection();
client.user_commands = new Collection();
client.message_commands = new Collection();
client.modals = new Collection();
client.events = new Collection();

module.exports = client;

["prefix", "application_commands", "modals", "events"].forEach((file) => {
  require(`./handlers/${file}`)(client, config);
});

// Login to the bot:
client.login(AuthenticationToken)
  .catch((err) => {
    console.error("[CRASH] Erreur rencontré lors du lancement du bot");
    console.error("[CRASH] Erreur Discord API:" + err);
    return process.exit();
  });

// Handle errors:
process.on('unhandledRejection', async (err, promise) => {
  console.error(`[ANTI-CRASH]: ${err}`.red);
  console.error(promise);
});
const mysql = require('mysql');
var connection = mysql.createConnection(config.Bdd);
const fetch = require('node-fetch');
const https = require('https');
const httpsAgent = new https.Agent({
  rejectUnauthorized: false,
});

module.exports.Remind = function (){
  const GuildList = client.guilds.cache.get(config.ServeurID); 
  GuildList.members.cache.forEach(member => SendRemind(member.id));
};

function SendRemind(userID){

  let url = config.Url + "?id=" + userID + "&conf=" + config.Type

  if(config.Type == "1"){
    VerifSiCo = `SELECT * FROM users WHERE id = ${userID}`
    connection.query(VerifSiCo, function (error, results, fields) {
      if(results.length == 0){ return; }else{
        let settings = { method: "Get", agent: httpsAgent, };     
        fetch(url, settings)
        .then(res => res.json())
        .then((json) => {
            if(json.dailyremind == "true" && json.daily == "true"){
              client.users.cache.get(userID).send({embeds:[
                new EmbedBuilder()
                    .setDescription(`Salut! \nLa commande </economie daily:${client.user.id}> est prête!`)
                    .setFooter({ text:"Envoyé automatiquement " + client.user.tag})
              ],});
              DisableDailyRemind = `UPDATE users SET dailyremind="false"`
              connection.query(DisableDailyRemind, function (error, results, fields) {
                  if(error){
                    client.users.cache.get(userID).send({embeds:[
                      new EmbedBuilder()
                          .setDescription(`Vous risquez de reçevoir un deuxième message, identique à celui ci-dessus car une erreur s'est produite.`)
                          .setFooter({ text:"Envoyé automatiquement " + client.user.tag})
                          .setColor('Red')
                    ],});
                  }
              })
            }
            if(json.weeklyremind == "true" && json.weekly == "true"){
              client.users.cache.get(userID).send({embeds:[
                new EmbedBuilder()
                    .setDescription(`Salut! \nLa commande </economie weekly:${client.user.id}> est prête!`)
                    .setFooter({ text:"Envoyé automatiquement " + client.user.tag})
              ],});
              DisableWeeklyRemind = `UPDATE users SET weeklyremind="false"`
              connection.query(DisableWeeklyRemind, function (error, results, fields) {
                  if(error){
                    client.users.cache.get(userID).send({embeds:[
                      new EmbedBuilder()
                          .setDescription(`Vous risquez de reçevoir un deuxième message, identique à celui ci-dessus car une erreur s'est produite.`)
                          .setFooter({ text:"Envoyé automatiquement " + client.user.tag})
                          .setColor('Red')
                    ],});
                  }
              })
            }
            if(json.monthlyremind == "true" && json.monthly == "true"){
              client.users.cache.get(userID).send({embeds:[
                new EmbedBuilder()
                    .setDescription(`Salut! \nLa commande </economie monthly:${client.user.id}> est prête!`)
                    .setFooter({ text:"Envoyé automatiquement " + client.user.tag})
              ],});
              DisableMonthlyRemind = `UPDATE users SET monthlyremind="false"`
              connection.query(DisableMonthlyRemind, function (error, results, fields) {
                  if(error){
                    client.users.cache.get(userID).send({embeds:[
                      new EmbedBuilder()
                          .setDescription(`Vous risquez de reçevoir un deuxième message, identique à celui ci-dessus car une erreur s'est produite.`)
                          .setFooter({ text:"Envoyé automatiquement " + client.user.tag})
                          .setColor('Red')
                    ],});
                  }
              })
            }
        })
      }
    })
  }else{
    if(config.Type == "2"){
      VerifSiCo = `SELECT * FROM botusers WHERE id = ${userID}`
      connection.query(VerifSiCo, function (error, results, fields) {

      })
    }
  }
}