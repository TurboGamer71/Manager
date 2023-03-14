const { EmbedBuilder, Collection, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events } = require("discord.js");
const math = require('mathjs');
const config = require('../../../config/config.js');

const mysql = require('mysql');

//////////////////////////
//         CODE        //
////////////////////////
var connection = mysql.createConnection(config.Bdd);
module.exports = {
    name: "login",
    description: "Se connecter avec son compte sur le manager",
    type: 1,
    options: [
                {
                    "name": "email",
                    "description": "Email précisée sur le manager",
                    "type": 3,
                    "required": true,
                    "min_value": 1,
                    "max_value": 100,
                },
            ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config) => {
       
        if(config.Type == "1"){
            const mail = interaction.options.get('email').value
            var checkifexist = `SELECT * FROM tblclients WHERE email = "${mail}"`

            connection.query(checkifexist, function(error, results, fields) {
                if(error){
                    console.log(error)
                    return interaction.reply({
                        content: `<@${interaction.user.id}>`,
                        embeds:[
                            new EmbedBuilder()
                                .setDescription(`:x: | Une erreur à été rencontrée lors de la connexion avec la base de données.`)
                                .setColor('Red')
                        ],
                        ephemeral: false,
                    })
                }
                if(results.length == 0){
                    return interaction.reply({
                        content: `<@${interaction.user.id}>`,
                        embeds:[
                            new EmbedBuilder()
                                .setDescription(`:x: | Aucun compte avec cette adresse mail n'a été trouvé.`)
                                .setColor('Red')
                        ],
                        ephemeral: false,
                    })
                }else{
                    var verifmultiplesconnexions = `SELECT * FROM botadminconfig`
                    connection.query(verifmultiplesconnexions, function(error, result, fields) {
                        var verifmultiplesconnexions = `SELECT * FROM users WHERE email = "${interaction.options.get('email').value}"`
                        connection.query(verifmultiplesconnexions, function(error, resultssss, fields) {
                            // Vérifier si le compte discord est dans la bdd
                            var verififexist = `SELECT * FROM users WHERE id = "${interaction.user.id}"`
                            connection.query(verififexist, function(error, results, fields) {
                                if(resultssss.length > 0 && result[0].multiplesconnexions == "no"){
                                    return interaction.reply({
                                        content: `<@${interaction.user.id}>`,
                                        embeds:[
                                            new EmbedBuilder()
                                                .setDescription(`:x: | Les connexions multiples sont désactivées!`)
                                                .setColor('Red')
                                        ],
                                        ephemeral: false,
                                    })
                                }else{
                                    // Erreur
                                    if(error){
                                        console.log(error)
                                        return interaction.reply({
                                            content: `<@${interaction.user.id}>`,
                                            embeds:[
                                                new EmbedBuilder()
                                                    .setDescription(`:x: | Une erreur à été rencontrée lors de la connexion avec la base de données.`)
                                                    .setColor('Red')
                                            ],
                                            ephemeral: false,
                                        })
                                    }
                                    // Verif si existe
                                    if(results.length == 0){
                                        // Existe pas
                                        var importuser = `INSERT INTO users(id, email, balance, autotransfert) VALUES ("${interaction.user.id}", "${interaction.options.get('email').value}", "0", "off")`
                                        connection.query(importuser, function(error, results, fields) {
                                            // Erreur
                                            if(error){
                                                console.log(error)
                                                return interaction.reply({
                                                    content: `<@${interaction.user.id}>`,
                                                    embeds:[
                                                        new EmbedBuilder()
                                                            .setDescription(`:x: | Une erreur à été rencontrée lors de la connexion avec la base de données.`)
                                                            .setColor('Red')
                                                    ],
                                                    ephemeral: false,
                                                })
                                            }else{
                                                return interaction.reply({
                                                    content: `<@${interaction.user.id}>`,
                                                    embeds:[
                                                        new EmbedBuilder()
                                                            .setDescription(`:white_check_mark: | Compte connecté!`)
                                                            .setColor('Green')
                                                    ],
                                                    ephemeral: false,
                                                })
                                            }
                                        })
                                    }else{
                                        //existe
                                        var updateuser = `UPDATE users SET email="${interaction.options.get('email').value}" WHERE id="${interaction.user.id}"`

                                        connection.query(updateuser, function(error, results, fields) {
                                            // Erreur
                                            if(error){
                                                console.log(error)
                                                return interaction.reply({
                                                    content: `<@${interaction.user.id}>`,
                                                    embeds:[
                                                        new EmbedBuilder()
                                                            .setDescription(`:x: | Une erreur à été rencontrée lors de la connexion avec la base de données.`)
                                                            .setColor('Red')
                                                    ],
                                                    ephemeral: false,
                                                })
                                            }else{
                                                return interaction.reply({
                                                    content: `<@${interaction.user.id}>`,
                                                    embeds:[
                                                        new EmbedBuilder()
                                                            .setDescription(`:white_check_mark: | Compte connecté!`)
                                                            .setColor('Green')
                                                    ],
                                                    ephemeral: false,
                                                })
                                            }
                                        })
                                    }
                                }
                            })
                        })
                    })
                }
            })
        }else{
            if(config.Type == "2"){
                const mail = interaction.options.get('email').value
                var checkifexist = `SELECT * FROM users WHERE email = "${mail}"`

                connection.query(checkifexist, function(error, results, fields) {
                    if(error){
                        console.log(error)
                        return interaction.reply({
                            content: `<@${interaction.user.id}>`,
                            embeds:[
                                new EmbedBuilder()
                                    .setDescription(`:x: | Une erreur à été rencontrée lors de la connexion avec la base de données.`)
                                    .setColor('Red')
                            ],
                            ephemeral: false,
                        })
                    }
                    if(results.length == 0){
                        return interaction.reply({
                            content: `<@${interaction.user.id}>`,
                            embeds:[
                                new EmbedBuilder()
                                    .setDescription(`:x: | Aucun compte avec cette adresse mail n'a été trouvé.`)
                                    .setColor('Red')
                            ],
                            ephemeral: false,
                        })
                    }else{
                        var verifmultiplesconnexions = `SELECT * FROM botadminconfig`
                    connection.query(verifmultiplesconnexions, function(error, result, fields) {
                        var verifmultiplesconnexions = `SELECT * FROM users WHERE email = "${interaction.options.get('email').value}"`
                        connection.query(verifmultiplesconnexions, function(error, resultssss, fields) {
                            // Vérifier si le compte discord est dans la bdd
                            var verififexist = `SELECT * FROM users WHERE id = "${interaction.user.id}"`
                            connection.query(verififexist, function(error, results, fields) {
                                if(resultssss.length > 0 && result[0].multiplesconnexions == "no"){
                                    return interaction.reply({
                                        content: `<@${interaction.user.id}>`,
                                        embeds:[
                                            new EmbedBuilder()
                                                .setDescription(`:x: | Les connexions multiples sont désactivées!`)
                                                .setColor('Red')
                                        ],
                                        ephemeral: false,
                                    })
                                }else{
                                    // Erreur
                                    if(error){
                                        console.log(error)
                                        return interaction.reply({
                                            content: `<@${interaction.user.id}>`,
                                            embeds:[
                                                new EmbedBuilder()
                                                    .setDescription(`:x: | Une erreur à été rencontrée lors de la connexion avec la base de données.`)
                                                    .setColor('Red')
                                            ],
                                            ephemeral: false,
                                        })
                                    }
                                    // Verif si existe
                                    if(results.length == 0){
                                        // Existe pas
                                        var importuser = `INSERT INTO botusers(id, email, balance, autotransfert) VALUES ("${interaction.user.id}", "${interaction.options.get('email').value}", "0", "off")`
                                        connection.query(importuser, function(error, results, fields) {
                                            // Erreur
                                            if(error){
                                                console.log(error)
                                                return interaction.reply({
                                                    content: `<@${interaction.user.id}>`,
                                                    embeds:[
                                                        new EmbedBuilder()
                                                            .setDescription(`:x: | Une erreur à été rencontrée lors de la connexion avec la base de données.`)
                                                            .setColor('Red')
                                                    ],
                                                    ephemeral: false,
                                                })
                                            }else{
                                                return interaction.reply({
                                                    content: `<@${interaction.user.id}>`,
                                                    embeds:[
                                                        new EmbedBuilder()
                                                            .setDescription(`:white_check_mark: | Compte connecté!`)
                                                            .setColor('Green')
                                                    ],
                                                    ephemeral: false,
                                                })
                                            }
                                        })
                                    }else{
                                        //existe
                                        var updateuser = `UPDATE botusers SET email="${interaction.options.get('email').value}" WHERE id="${interaction.user.id}"`

                                        connection.query(updateuser, function(error, results, fields) {
                                            // Erreur
                                            if(error){
                                                console.log(error)
                                                return interaction.reply({
                                                    content: `<@${interaction.user.id}>`,
                                                    embeds:[
                                                        new EmbedBuilder()
                                                            .setDescription(`:x: | Une erreur à été rencontrée lors de la connexion avec la base de données.`)
                                                            .setColor('Red')
                                                    ],
                                                    ephemeral: false,
                                                })
                                            }else{
                                                return interaction.reply({
                                                    content: `<@${interaction.user.id}>`,
                                                    embeds:[
                                                        new EmbedBuilder()
                                                            .setDescription(`:white_check_mark: | Compte connecté!`)
                                                            .setColor('Green')
                                                    ],
                                                    ephemeral: false,
                                                })
                                            }
                                        })
                                    }
                                }
                            })
                        })
                    })
                }
            })
        }
    }
    },
};