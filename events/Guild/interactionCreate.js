const { EmbedBuilder, Collection, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, StringSelectMenuBuilder } = require("discord.js");
const client = require("../../index");
const config = require("../../config/config.js");
const mysql = require('mysql');
const math = require('mathjs');
var db = mysql.createConnection(config.Bdd);
var connection = mysql.createConnection(config.Bdd);

module.exports = {
  name: "interactionCreate"
};

client.on('interactionCreate', async (interaction) => {
  if (interaction.isChatInputCommand()) {
    const command = client.slash_commands.get(interaction.commandName);
    if (!command) return;

    try {
      command.run(client, interaction, config, db);
    } catch (e) {
      console.error(e)
    };
  };

  if (interaction.isUserContextMenuCommand()) { // User:
    const command = client.user_commands.get(interaction.commandName);

    if (!command) return;

    try {
      command.run(client, interaction, config, db);
    } catch (e) {
      console.error(e)
    };
  };

  if (interaction.isMessageContextMenuCommand()) { // Message:
    const command = client.message_commands.get(interaction.commandName);

    if (!command) return;

    try {
      command.run(client, interaction, config, db);
    } catch (e) {
      console.error(e)
    };
  };

  if (interaction.isModalSubmit()) { // Modals:
    const modal = client.modals.get(interaction.customId);

    if (!modal) return interaction.reply({
      embeds: [
        new EmbedBuilder()
          .setDescription('Something went wrong... Probably the Modal ID is not defined in the modals handler.')
          .setColor('Red')
      ],
      ephemeral: true
    });

    try {
      modal.run(client, interaction, config, db);
    } catch (e) {
      console.error(e)
    };
  }

  function entierAleatoire(min, max){
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  if(interaction.customId == "yellow" || interaction.customId == "red" || interaction.customId == "green" || interaction.customId == "blue"){
    function lost(){
      return interaction.message.edit({
        embeds: [
          new EmbedBuilder()
            .setDescription('Perdu!')
            .setColor('Red')
        ],
        ephemeral: true,
        components: [],
      });
    }
    function win(){
      if(config.Type == "1"){
        var connection = mysql.createConnection(config.Bdd);
      
        let verififautotransfert = `SELECT * FROM users WHERE id=${interaction.user.id}`
          connection.query(verififautotransfert, function (error, results, fields) {
            var autotransfert = results[0].autotransfert
            var add = entierAleatoire(10, 100)
            if(autotransfert == "off"){
              givecredits("discord", add)
            }else{
                givecredits("manager", add)
            }

            function givecredits(endroit, nombre){
              if(endroit == "discord"){
                  var getcredits = `SELECT * FROM users WHERE id='${interaction.user.id}'`
                  connection.query(getcredits, function (error, results, fields) {
                      var creditsActuels = results[0].balance
                      var Newcredits = math.chain(creditsActuels)
                                          .add(nombre)
                          var setCredits = `UPDATE users SET balance='${Newcredits}' WHERE id='${interaction.user.id}'`       
                          connection.query(setCredits, function (error, results, fields) {
                              return interaction.update({
                                  content: `<@${interaction.user.id}>`,
                                  embeds:[
                                      new EmbedBuilder()
                                          .setDescription(`:white_check_mark: | Vous venez de gagner ${nombre} (discord)`)
                                          .setColor('Green')
                                  ],
                                  ephemeral: false,
                                  components: [],
                              })
                          })      
                  })
              }else if(endroit == "manager"){
                      var getcredits = `SELECT * FROM users WHERE id='${interaction.user.id}'`
                      connection.query(getcredits, function (error, result, fields) {
                          var actualmail = result[0].email
                          var getcredits = `SELECT * FROM tblclients WHERE email='${actualmail}'`
                          connection.query(getcredits, function (error, results, fields) {
                          var creditsActuels = results[0].credit
                          var Newcredits = math.chain(creditsActuels)
                                              .add(nombre)
                              var setCredits = `UPDATE tblclients SET credit='${Newcredits}' WHERE email='${actualmail}'`       
                              connection.query(setCredits, function (error, results, fields) {
                                  return interaction.update({
                                      content: `<@${interaction.user.id}>`,
                                      embeds:[
                                          new EmbedBuilder()
                                              .setDescription(`:white_check_mark: | Vous venez de gagner ${nombre} (manager)`)
                                              .setColor('Green')
                                      ],
                                      ephemeral: false,
                                      components: [],
                                  })
                              })   
                          })
                      })
              }
          }
        })
      }else{
        if(config.Type == "2"){
          var connection = mysql.createConnection(config.Bdd);
        
          let verififautotransfert = `SELECT * FROM botusers WHERE id=${interaction.user.id}`
            connection.query(verififautotransfert, function (error, results, fields) {
              var autotransfert = results[0].autotransfert
              var add = entierAleatoire(10, 100)
              if(autotransfert == "off"){
                givecredits("discord", add)
              }else{
                  givecredits("manager", add)
              }
  
              function givecredits(endroit, nombre){
                if(endroit == "discord"){
                    var getcredits = `SELECT * FROM botusers WHERE id='${interaction.user.id}'`
                    connection.query(getcredits, function (error, results, fields) {
                        var creditsActuels = results[0].balance
                        var Newcredits = math.chain(creditsActuels)
                                            .add(nombre)
                            var setCredits = `UPDATE botusers SET balance='${Newcredits}' WHERE id='${interaction.user.id}'`       
                            connection.query(setCredits, function (error, results, fields) {
                                return interaction.update({
                                    content: `<@${interaction.user.id}>`,
                                    embeds:[
                                        new EmbedBuilder()
                                            .setDescription(`:white_check_mark: | Vous venez de gagner ${nombre} (discord)`)
                                            .setColor('Green')
                                    ],
                                    ephemeral: false,
                                    components: [],
                                })
                            })      
                    })
                }else if(endroit == "manager"){
                        var getcredits = `SELECT * FROM botusers WHERE id='${interaction.user.id}'`
                        connection.query(getcredits, function (error, result, fields) {
                            var actualmail = result[0].email
                            var getcredits = `SELECT * FROM users WHERE email='${actualmail}'`
                            connection.query(getcredits, function (error, results, fields) {
                            var creditsActuels = results[0].credit
                            var Newcredits = math.chain(creditsActuels)
                                                .add(nombre)
                                var setCredits = `UPDATE users SET money='${Newcredits}' WHERE email='${actualmail}'`       
                                connection.query(setCredits, function (error, results, fields) {
                                    return interaction.update({
                                        content: `<@${interaction.user.id}>`,
                                        embeds:[
                                            new EmbedBuilder()
                                                .setDescription(`:white_check_mark: | Vous venez de gagner ${nombre} (manager)`)
                                                .setColor('Green')
                                        ],
                                        ephemeral: false,
                                        components: [],
                                    })
                                })   
                            })
                        })
                }
            }
          })
        }
      }
    } // aa
    var colornb = entierAleatoire(1, 4);
    if(interaction.customId == "yellow" && colornb == "1"){
      win()
    }else{
      if(interaction.customId == "red" && colornb == "2"){
        win()
      }else{
        if(interaction.customId == "green" && colornb == "3"){
          win()
        }else{
          if(interaction.customId == "green" && colornb == "4"){
            win()
          }else{
            lost()
          }
        }
      }
    }

  }
  if(interaction.customId == "SelectPreferences"){
    const sélectionné = interaction.values[0];
    
    const autotransfert = new EmbedBuilder()
      .setTitle(`Transfert automatique`)
      .setDescription(`La fonctionnalité de transfert automatique envoie directement vos coins gagnés sur votre compte sur le manager.`)

        const activerow = new ActionRowBuilder()
			    .addComponents(
            new ButtonBuilder()
              .setCustomId('activeautotransfert')
              .setLabel('Activer')
              .setStyle(ButtonStyle.Success),
            new ButtonBuilder()
              .setCustomId('back')
              .setLabel('Retour')
              .setStyle(ButtonStyle.Secondary),
          );
          const desarow = new ActionRowBuilder()
			    .addComponents(
            new ButtonBuilder()
              .setCustomId('disableautotransfert')
              .setLabel('Désactiver')
              .setStyle(ButtonStyle.Danger),
            new ButtonBuilder()
              .setCustomId('back')
              .setLabel('Retour')
              .setStyle(ButtonStyle.Secondary),
          );
          
    if(sélectionné == "autotransfert"){
      if(config.Type == "1"){
        let verififitsenabled = `SELECT * FROM users WHERE id=${interaction.user.id}`
          
        connection.query(verififitsenabled, function (error, results, fields) {
          var ifenabled = results[0].autotransfert

          if(ifenabled == "off"){
            interaction.update({
              embeds: [autotransfert],
              components: [activerow],
            })
          }else{
            interaction.update({
              embeds: [autotransfert],
              components: [desarow],
            })
          }
        })
      }else{
        if(config.Type == "2"){
          let verififitsenabled = `SELECT * FROM botusers WHERE id=${interaction.user.id}`
            
          connection.query(verififitsenabled, function (error, results, fields) {
            var ifenabled = results[0].autotransfert
  
            if(ifenabled == "off"){
              interaction.update({
                embeds: [autotransfert],
                components: [activerow],
              })
            }else{
              interaction.update({
                embeds: [autotransfert],
                components: [desarow],
              })
            }
          })
        }
      }
    }
  }

  const colors = new ActionRowBuilder()
  .addComponents(
    new StringSelectMenuBuilder()
      .setCustomId('SelectPreferences')
      .setPlaceholder('Clique moi dessus!')
      .addOptions(
        {
          label: 'Transfert automatique',
          description: 'Activez/Désactivez le transfert automatique',
          value: 'autotransfert',
        },
        /* {
          label: 'You can select me too',
          description: 'This is also a description',
          value: 'second_option',
        }, */
      ),
  );

    const embeddrop = new EmbedBuilder()
      .setTitle(`Configurations des préférences`)
      .setDescription(
        `Salut :wave:! Moi, c'est le bot d'économie. Je suis en version **${config.Divers.version}**
        

        Sélectionne l'une des propositions ci-dessous pour configurer celle-ci!
        `
     )

  if(interaction.customId == "back"){
    interaction.update({ embeds: [embeddrop], components: [colors], ephemeral: true, });
  }

  if(interaction.customId == "disableautotransfert"){
    if(config.Type == "1"){
      let verififitsenabled = `UPDATE users SET autotransfert='off' WHERE id=${interaction.user.id}`
      connection.query(verififitsenabled, function (error, results, fields) {
        const embeddisabletransfert = new EmbedBuilder()
        .setTitle(`Configurations des préférences`)
        .setDescription(
          `:white_check_mark: | Le transfert automatique a correctement été désactivé!
          `
       )

        interaction.update({ embeds:[embeddisabletransfert], components: [], ephemeral: true})
      })
    }else{
      if(config.Type == "2"){
        let verififitsenabled = `UPDATE botusers SET autotransfert='off' WHERE id=${interaction.user.id}`
        connection.query(verififitsenabled, function (error, results, fields) {
          const embeddisabletransfert = new EmbedBuilder()
          .setTitle(`Configurations des préférences`)
          .setDescription(
            `:white_check_mark: | Le transfert automatique a correctement été désactivé!
            `
         )
  
          interaction.update({ embeds:[embeddisabletransfert], components: [], ephemeral: true})
        })
      }
    }
  }

  if(interaction.customId == "activeautotransfert"){
    if(config.Type == "1"){
      let verififitsenabled = `UPDATE users SET autotransfert='on' WHERE id=${interaction.user.id}`
      connection.query(verififitsenabled, function (error, results, fields) {
        const embeddisabletransfert = new EmbedBuilder()
        .setTitle(`Configurations des préférences`)
        .setDescription(
          `:white_check_mark: | Le transfert automatique a correctement été activé!
          `
       )

        interaction.update({ embeds:[embeddisabletransfert], components: [], ephemeral: true})
      })
    }else{
      if(config.Type == "2"){
        let verififitsenabled = `UPDATE botusers SET autotransfert='on' WHERE id=${interaction.user.id}`
        connection.query(verififitsenabled, function (error, results, fields) {
          const embeddisabletransfert = new EmbedBuilder()
          .setTitle(`Configurations des préférences`)
          .setDescription(
            `:white_check_mark: | Le transfert automatique a correctement été activé!
            `
         )
  
          interaction.update({ embeds:[embeddisabletransfert], components: [], ephemeral: true})
        })
      }
    }
  }

  if(interaction.customId == "SelectAdminConfig"){
    const sélectionné = interaction.values[0];

    if(sélectionné == "multiplesconnexions"){
      const activerow = new ActionRowBuilder()
			  .addComponents(
          new ButtonBuilder()
            .setCustomId('activemultiplesconnexions')
            .setLabel('Interdir')
            .setStyle(ButtonStyle.Success),
          new ButtonBuilder()
            .setCustomId('back')
            .setLabel('Retour')
            .setStyle(ButtonStyle.Secondary),
          );
      const desarow = new ActionRowBuilder()
			  .addComponents(
          new ButtonBuilder()
            .setCustomId('disablemultiplesconnexions')
            .setLabel('Accepter')
            .setStyle(ButtonStyle.Danger),
          new ButtonBuilder()
            .setCustomId('back')
            .setLabel('Retour')
            .setStyle(ButtonStyle.Secondary),
        );
      var VerifSiMultipleConnexionsIsEnabled = `SELECT * FROM botadminconfig`
      connection.query(VerifSiMultipleConnexionsIsEnabled, function (error, results, fields) {
        var multiplesconnexions = results[0].multiplesconnexions

        if(multiplesconnexions == "yes"){
            interaction.update({
              embeds: [
              new EmbedBuilder()
                  .setDescription('Acceptez/Désactivez le fait que plusieurs personnez peuvent être connectés sur le même compte')
              ],
              ephemeral: true,
              components: [activerow],
          })
        }else{
          interaction.update({
            embeds: [
            new EmbedBuilder()
                .setDescription('Acceptez/Désactivez le fait que plusieurs personnez peuvent être connectés sur le même compte')
            ],
            ephemeral: true,
            components: [desarow],
        })
        }
      })
    }
  }

  if(interaction.customId == "activemultiplesconnexions"){

    const embeddrop = new EmbedBuilder()
    .setTitle(`Configurations des préférences`)
    .setDescription(`:white_check_mark: | Les paramètres ont bien été sauvegardés!`)
    .setColor('Green')

    var Interdir = "UPDATE botadminconfig SET multiplesconnexions='no' WHERE multiplesconnexions='yes'"
    connection.query(Interdir, function (error, results, fields) {
      interaction.update({embeds: [embeddrop], components: []})
    })
  }
  if(interaction.customId == "disablemultiplesconnexions"){

    const embeddrop = new EmbedBuilder()
    .setTitle(`Configurations des préférences`)
    .setDescription(`:white_check_mark: | Les paramètres ont bien été sauvegardés!`)
    .setColor('Green')

    var Interdir = "UPDATE botadminconfig SET multiplesconnexions='yes' WHERE multiplesconnexions='no'"
    connection.query(Interdir, function (error, results, fields) {
      interaction.update({embeds: [embeddrop], components: []})
    })
  }
});

