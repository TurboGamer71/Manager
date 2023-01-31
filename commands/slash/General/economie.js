const { EmbedBuilder, Collection, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events } = require("discord.js");
const math = require('mathjs');
const fetch = require('node-fetch');
const config = require('../../../config/config.js');
const cooldownwe = new Collection();
const cooldownda = new Collection();
const cooldownco = new Collection();
const cooldownnum = new Collection();
const { convertMS } = require("discordutility");
let time = 86400000;
let timewe = 604800000;
let timeco = 7200000;
let timenum = 120000;
let timemo = math.chain("86400000").multiply("30.4167");


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
    name: "economie",
    description: "Replies with pong!",
    type: 1,
    options: [
        {
            name: "daily",
            description: "Récupérer votre argent quotidient",
            type: 1,
        },
        {
            name: "weekly",
            description: "Récupérer votre argent hebdomadaire",
            type: 1,
        },
        {
            name: "monthly",
            description: "Récupérer votre argent mensuelles",
            type: 1,
        },
        {
            name: "color",
            description: "Tentez votre chance en choisissant la bonne couleur!",
            type: 1,
        },
        {
            name: "number",
            description: "Tentez votre chance en choisissant le bon numéro!",
            type: 1,
            options: [
                {
                    "name": "nombre",
                    "description": "Nombre choisit",
                    "type": 10,
                    "required": true,
                    "min_value": 1,
                    "max_value": 100,
                },
            ]
        },
        {
            name: "transfert",
            description: "Transférer l'argent de votre compte discord sur le manager",
            type: 1,
        },
        {
            name: "solde",
            description: "Savoir combien de points vous avez sur vos comptes",
            type: 1,
        },
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config) => {

        let url = `http://localhost/api/index.php?id=${interaction.user.id}`;

        var connection = mysql.createConnection(config.Bdd);
        let verififautotransfert = `SELECT * FROM users WHERE id=${interaction.user.id}`

        let settings = { method: "Get" };        
        fetch(url, settings)
        .then(res => res.json())
        .then((json) => {
            // do something with JSON
            connection.query(verififautotransfert, function (error, results, fields) {
                var autotransfert = results[0].autotransfert
                var AAAAAAbb = results[0]
                let gettime = `SELECT * FROM users WHERE id=${interaction.user.id}`
                
                connection.query(gettime, function (error, results, fields) {
                        const timeLeft = AAAAAAbb.dailytime - Date.now(); 
                        const converted = convertMS(timeLeft); // Changes the ms to time
                    if(error){
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
                    var old_balance = results[0].balance

                    //  exports.oldbalance = old_balance;

                    if(interaction.options._subcommand == "daily"){
                    
                        if(json.daily == "false") { // if user on cooldown
                            //add message here if code
                            interaction.reply({
                                content: `<@${interaction.user.id}>`,
                                embeds:[
                                    new EmbedBuilder()
                                        .setDescription('Vous devez encore patienter: \n' + `${converted['d']} jours, ${converted['h']} heures, ${converted['m']} minutes, ${converted['s']} secondes.`)
                                        .setColor('Red')
                                ],
                                ephemeral: false,
                            })
                        }else{
                            if(autotransfert == "off"){
                                givecredits("discord", coins_daily, "dailytime", time)
                            }else{
                                givecredits("manager", coins_daily, "dailytime", time)
                            }
                        }
                    }
                    if(interaction.options._subcommand == "weekly"){
                    
                        if(json.weekly == "false") { // if user on cooldown
                            
                            const timeLeft = AAAAAAbb.weeklytime - Date.now(); 
                            const converted = convertMS(timeLeft); // Changes the ms to time
                            //add message here if code
                            interaction.reply({
                                content: `<@${interaction.user.id}>`,
                                embeds:[
                                    new EmbedBuilder()
                                        .setDescription('Vous devez encore patienter: \n' + `${converted['d']} jours, ${converted['h']} heures, ${converted['m']} minutes, ${converted['s']} secondes.`)
                                        .setColor('Red')
                                ],
                                ephemeral: false,
                            })
                        }else{
                            if(autotransfert == "off"){
                                givecredits("discord", coins_weekly, "weeklytime", timewe)
                            }else{
                                givecredits("manager", coins_weekly, "weeklytime", timewe)
                            }
                        }
                    }

                    if(interaction.options._subcommand == "monthly"){
                    
                        if(json.monthly == "false") { // if user on cooldown
                            
                            const timeLeft = AAAAAAbb.monthlytime - Date.now(); 
                            const converted = convertMS(timeLeft); // Changes the ms to time
                            //add message here if code
                            interaction.reply({
                                content: `<@${interaction.user.id}>`,
                                embeds:[
                                    new EmbedBuilder()
                                        .setDescription('Vous devez encore patienter: \n' + `${converted['d']} jours, ${converted['h']} heures, ${converted['m']} minutes, ${converted['s']} secondes.`)
                                        .setColor('Red')
                                ],
                                ephemeral: false,
                            })
                        }else{
                            if(autotransfert == "off"){
                                givecredits("discord", coins_monthly, "monthlytime", timemo)
                            }else{
                                givecredits("manager", coins_monthly, "monthlytime", timemo)
                            }
                        }
                    }

                    if(interaction.options._subcommand == "color"){
                        const colors = new ActionRowBuilder()
                            .addComponents(
                                new ButtonBuilder()
                                    .setCustomId('yellow')
                                    .setLabel('🟡 Jaune')
                                    .setStyle(ButtonStyle.Success),
                                new ButtonBuilder()
                                    .setCustomId('red')
                                    .setLabel('🔴 Rouge')
                                    .setStyle(ButtonStyle.Success),
                                new ButtonBuilder()
                                    .setCustomId('green')
                                    .setLabel('🟢 Vert')
                                    .setStyle(ButtonStyle.Success),
                                new ButtonBuilder()
                                    .setCustomId('blue')
                                    .setLabel('🔵 Bleu')
                                    .setStyle(ButtonStyle.Success),
                            );
                        if(cooldownco.has(interaction.user.id)) { // if user on cooldown
                    
                            const timeLeft = cooldownco.get(interaction.user.id) - Date.now(); 
                            const converted = convertMS(timeLeft); // Changes the ms to time
                            //add message here if code
                            interaction.reply({
                                content: `<@${interaction.user.id}>`,
                                embeds:[
                                    new EmbedBuilder()
                                        .setDescription('Vous devez encore patienter: \n' + `${converted['d']} jours, ${converted['h']} heures, ${converted['m']} minutes, ${converted['s']} secondes.`)
                                        .setColor('Red')
                                ],
                                ephemeral: false,
                            })
                        }else{
                            cooldownco.set(interaction.user.id, Date.now() + timeco); // <- saves the time 
                            setTimeout(() => cooldownco.delete(interaction.user.id), timeco) // <- I don't remember what it does but it's needed
                            interaction.reply({
                                content: `<@${interaction.user.id}>`,
                                embeds:[
                                    new EmbedBuilder()
                                        .setDescription(`Choisissez l'une des couleurs ci-dessous.`)
                                        // .setColor('')
                                ],
                                ephemeral: false,
                                components: [colors],
                            })
                            
                        }
                    }
                });

                if(interaction.options._subcommand == "number"){
                    function entierAleatoire(min, max){
                        return Math.floor(Math.random() * (max - min + 1)) + min;
                    }
                    if(cooldownnum.has(interaction.user.id)) { // if user on cooldown
                    const timeLeft = cooldownnum.get(interaction.user.id) - Date.now(); 
                    const converted = convertMS(timeLeft); // Changes the ms to time
                    //add message here if code
                    interaction.reply({
                        content: `<@${interaction.user.id}>`,
                        embeds:[
                            new EmbedBuilder()
                                .setDescription('Vous devez encore patienter: \n' + `${converted['d']} jours, ${converted['h']} heures, ${converted['m']} minutes, ${converted['s']} secondes.`)
                                .setColor('Red')
                        ],
                        ephemeral: false,
                    })
                    }else{
                        cooldownnum.set(interaction.user.id, Date.now() + timenum); // <- saves the time 
                        setTimeout(() => cooldownnum.delete(interaction.user.id), timenum)
                        var add = entierAleatoire(10, 100)
                    function win(){
                        var connection = mysql.createConnection(config.Bdd);
                        connection.connect();
                        let gettime = `SELECT * FROM users WHERE id=${interaction.user.id}`
                        
                        connection.query(gettime, function (error, results, fields) {
                            if(error){
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
                        var old_balance = results[0].balance
                
                        var oldbal = old_balance
                            // var newbal = math.evaluate(oldbal+coins_daily)
                            var newbal = math.chain(add)
                            .add(oldbal)
                        })
                        if(autotransfert == "off"){
                            givecredits("discord", add)
                        }else{
                            givecredits("manager", add)
                        }
                    }
                
                    function lost(){
                        return interaction.reply({
                        embeds: [
                            new EmbedBuilder()
                            .setDescription('Perdu! La solution était: ' + add)
                            .setColor('Red')
                        ],
                        ephemeral: false,
                        components: [],
                        });
                    }
                    var nbchoisis = entierAleatoire(1, 100);
                
                    if(interaction.options.get('nombre') == nbchoisis){
                        win()
                    }else{
                        lost()
                    }
                    }
                }
                if(interaction.options._subcommand == "transfert"){
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
                            var GetOlbBal = `SELECT * FROM users WHERE id="${interaction.user.id}"`

                            connection.query(GetOlbBal, function (err, row, fields) {
                                if(error){
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
                                    var GetBal = `SELECT * FROM tblclients WHERE email="${row[0].email}"`

                                    connection.query(GetBal, function (err, rows, fields) {
                                        var balmanager = rows[0].credit
                                        var baldiscord = row[0].balance
                                        var newbal = math.chain(balmanager).add(baldiscord)

                                        var addpoints = `UPDATE tblclients SET credit="${newbal}.00" WHERE email="${row[0].email}"`
                                        connection.query(addpoints, function (err, rows, fields) {
                                            var retirerpoints = `UPDATE users SET balance="0" WHERE id="${interaction.user.id}"`
                                            connection.query(retirerpoints, function (err, rowsss, fields) {
                                                return interaction.reply({
                                                    content: `<@${interaction.user.id}>`,
                                                    embeds:[
                                                        new EmbedBuilder()
                                                            .setDescription("Vous avez transféré " + baldiscord + " points sur le manager!\nVous disposez maintenant de " + newbal + ".00 points!")
                                                            .setColor('Green')
                                                    ],
                                                    ephemeral: false,
                                                })
                                            })
                                        })
                                    })
                                }
                            })
                        }
                    })
                }

                if(interaction.options._subcommand == "solde"){
                    var aa = `SELECT * FROM users WHERE id="${interaction.user.id}"`
                    connection.query(aa, function (err, rows, fields) {
                        var bb = `SELECT * FROM tblclients WHERE email='${rows[0].email}'`
                        connection.query(bb, function (err, rowsss, fields) {
                            return interaction.reply({
                                content: `<@${interaction.user.id}>`,
                                embeds:[
                                    new EmbedBuilder()
                                        .setDescription(`Vous disposez de ${rows[0].balance} points sur votre compte discord et de ${rowsss[0].credit} points sur le manager.`)
                                        .setColor('Green')
                                ],
                                ephemeral: false,
                            })
                        })
                    })
                }
            })
        })

        function givecredits(endroit, nombre, type, cooldown){
            var Now = Date.now() + cooldown
            if(endroit == "discord"){
                var getcredits = `SELECT * FROM users WHERE id='${interaction.user.id}'`
                connection.query(getcredits, function (error, results, fields) {
                    var creditsActuels = results[0].balance
                    var Newcredits = math.chain(creditsActuels)
                                        .add(nombre)
                        var setCredits = `UPDATE users SET balance='${Newcredits}',${type}='${Now}' WHERE id='${interaction.user.id}'`       
                        connection.query(setCredits, function (error, results, fields) {
                            if(error){
                                console.log(error)
                            }
                            return interaction.reply({
                                content: `<@${interaction.user.id}>`,
                                embeds:[
                                    new EmbedBuilder()
                                        .setDescription(`:white_check_mark: | Vous venez de gagner ${nombre} (discord)`)
                                        .setColor('Green')
                                ],
                                ephemeral: false,
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
                            var Setaa = `UPDATE users SET ${type}='${Now}' WHERE id='${interaction.user.id}'`            
                            connection.query(setCredits, function (error, results, fields) {
                                connection.query(Setaa, function (error, results, fields) {
                                    if(error){
                                        console.log(error)
                                    }
                                })
                                return interaction.reply({
                                    content: `<@${interaction.user.id}>`,
                                    embeds:[
                                        new EmbedBuilder()
                                            .setDescription(`:white_check_mark: | Vous venez de gagner ${nombre} (manager)`)
                                            .setColor('Green')
                                    ],
                                    ephemeral: false,
                                })
                            })   
                        })
                    })
            }
        }
    },
};