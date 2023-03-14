const { EmbedBuilder,  Events, ActionRowBuilder,  StringSelectMenuBuilder } = require("discord.js");
const config = require('../../../config/config.js');
const mysql = require('mysql');

module.exports = {
    name: "config",
    description: "Changez vos préférences!",
    type: 1,
    options: [],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config, db) => {
        var connection = mysql.createConnection(config.Bdd);
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

        if(config.Type == "1"){
            var Verifsiilestconnecté = `SELECT * FROM users WHERE id="${interaction.user.id}"`
            connection.query(Verifsiilestconnecté, function(error, results, fields) {
                var résultats = results.length
                    if(résultats == 0){
                        return interaction.reply({
                            embeds: [
                            new EmbedBuilder()
                                .setDescription(':x: | Vous n\'êtes pas connecté!')
                                .setColor('Red')
                            ],
                            ephemeral: false,
                            components: [],
                        });
                    }else{
                        interaction.reply({ embeds: [embeddrop], components: [colors], ephemeral: true, });
                    }
            })
        }else{
            if(config.Type == "2"){
                var Verifsiilestconnecté = `SELECT * FROM botusers WHERE id="${interaction.user.id}"`
                connection.query(Verifsiilestconnecté, function(error, results, fields) {
                    var résultats = results.length
                        if(résultats == 0){
                            return interaction.reply({
                                embeds: [
                                new EmbedBuilder()
                                    .setDescription(':x: | Vous n\'êtes pas connecté!')
                                    .setColor('Red')
                                ],
                                ephemeral: false,
                                components: [],
                            });
                        }else{
                            interaction.reply({ embeds: [embeddrop], components: [colors], ephemeral: true, });
                        }
                })
            }
        }
    },
};
