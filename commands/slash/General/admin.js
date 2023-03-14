const { EmbedBuilder, Collection, ActionRowBuilder, StringSelectMenuBuilder,ButtonBuilder, ButtonStyle, Events, PermissionsBitField } = require("discord.js");
const math = require('mathjs');
const config = require('../../../config/config.js');

const mysql = require('mysql');


////////////////////////////
//      COINS DONNÉS     //
//////////////////////////

var coins_daily = "60"
var coins_weekly = "120"
var coins_monthly = "200"

//////////////////////////
//         CODE        //
////////////////////////

module.exports = {
    name: "admin",
    description: "Configurations Admin",
    type: 1,
    options: [
        {
            name: "config",
            description: "Configuration admin",
            type: 1,
        }
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config) => {

        let url = `https://localhost/api/index.php?id=${interaction.user.id}&conf=${config.Type}`;

        if(!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)){
            return;
        }else{
            const colors = new ActionRowBuilder()
                .addComponents(
                    new StringSelectMenuBuilder()
                        .setCustomId('SelectAdminConfig')
                        .setPlaceholder('Clique moi dessus!')
                        .addOptions(
                            {
                                label: 'Connexions multiples',
                                description: 'Activez/Désactivez les connexions multiples',
                                value: 'multiplesconnexions',
                            },
                            /* {
                                label: 'You can select me too',
                                description: 'This is also a description',
                                value: 'second_option',
                            }, */
                        ),
                );
    
            const embeddrop = new EmbedBuilder()
                .setTitle(`Configurations des paramètres`)
                .setDescription(
                    `Menu des préférences d'aministration
                    
                    Vous utilisez la version ${config.Divers.version}`
                )
            interaction.reply({ embeds: [embeddrop], components: [colors], ephemeral: true, });
        }
    },
};