const { EmbedBuilder, Collection, ActionRowBuilder, ButtonBuilder, ButtonStyle, Events, PermissionsBitField } = require("discord.js");
const math = require('mathjs');
const fetch = require('node-fetch');
const https = require('https');
const httpsAgent = new https.Agent({
      rejectUnauthorized: false,
    });
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
let timemo = 2628002880


const mysql = require('mysql');
const { number } = require("mathjs");

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
        {
            name: "ajouter",
            description: "Ajouter des points",
            type: 1,
            options: [
                {
                    "name": "utilisateur",
                    "description": "Cible",
                    "type": 6,
                    "required": true,
                    "min_value": 1,
                },{
                    "name": "nombre",
                    "description": "Nombre choisit",
                    "type": 10,
                    "required": true,
                    "min_value": 1,
                },
            ]
        },
        {
            name: "retirer",
            description: "Retirer des points",
            type: 1,
            options: [
                {
                    "name": "utilisateur",
                    "description": "Cible",
                    "type": 6,
                    "required": true,
                    "min_value": 1,
                },{
                    "name": "nombre",
                    "description": "Nombre choisit",
                    "type": 10,
                    "required": true,
                    "min_value": 1,
                },
            ]
        },
    ],
    permissions: {
        DEFAULT_MEMBER_PERMISSIONS: "SendMessages"
    },
    run: async (client, interaction, config) => {

        let url = config.Url + "?id=" + interaction.user.id + "&conf=" + config.Type
        var connection = mysql.createConnection(config.Bdd);

        connection.query(gettimef(), function(error, results, fields) {
            if(results.length == 0){
                interaction.reply({
                    embeds: [
                    new EmbedBuilder()
                        .setDescription(':x: | Vous n\'êtes pas connecté!')
                        .setColor('Red')
                    ],
                    ephemeral: false,
                    components: [],
                });
            }else{
                let settings = { method: "Get", agent: httpsAgent, };        
                fetch(url, settings)
                .then(res => res.json())
                .then((json) => {
                        var gettime = gettimef()
                        
                        connection.query(gettime, function (error, results, fields) {
                                var AAAAAAbb = results[0]
                                var dateFormat = new Date(Number(AAAAAAbb.daily))
                                dateFormat.setDate(dateFormat.getDate() + 1)
                                const converted = convertMS(math.chain(dateFormat.valueOf()).subtract(Date.now())); // Donne 19430j
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
                                                .setDescription('Vous devez encore patienter: \n' + `${converted['d']} jour, ${converted['h']} heures, ${converted['m']} minutes, ${converted['s']} secondes.`)
                                                .setColor('Red')
                                        ],
                                        ephemeral: false,
                                    })
                                }else{
                                    /*if(autotransfert == "off"){
                                        givecredits("discord", coins_daily, "dailytime", "dailyremind", "daily")
                                    }else{
                                        givecredits("manager", coins_daily, "dailytime", "dailyremind", "daily")
                                    } */
                                    if(config.Type = "1"){
                                        let gettransf = `SELECT * FROM users WHERE id=${interaction.user.id}`
                                        connection.query(gettransf, function (error, results, fields) {
                                            if(results[0].autotransfert = "off"){
                                                givecredits("discord", coins_daily, "dailytime", "dailyremind", "daily")
                                            }else{
                                                givecredits("manager", coins_daily, "dailytime", "dailyremind", "daily")
                                            }
                                        })
                                    }else{
                                        if(config.Type = "2"){
                                            let gettransf = `SELECT * FROM botusers WHERE id=${interaction.user.id}`
                                            connection.query(gettransf, function (error, results, fields) {
                                                if(results[0].autotransfert = "off"){
                                                    givecredits("discord", coins_daily, "dailytime", "dailyremind", "daily")
                                                }else{
                                                    givecredits("manager", coins_daily, "dailytime", "dailyremind", "daily")
                                                }
                                            })
                                        }
                                    }
                                }
                            }
                            if(interaction.options._subcommand == "weekly"){
                            
                                if(json.weekly == "false") { // if user on cooldown
                                    
                                    var dateFormat = new Date(Number(AAAAAAbb.weekly))
                                    dateFormat.setDate(dateFormat.getDate() + 7)
                                    const converted = convertMS(math.chain(dateFormat.valueOf()).subtract(Date.now())); // Donne 19430j
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
                                    if(config.Type = "1"){
                                        let gettransf = `SELECT * FROM users WHERE id=${interaction.user.id}`
                                        connection.query(gettransf, function (error, results, fields) {
                                            if(results[0].autotransfert = "off"){
                                                givecredits("discord", coins_weekly, "weeklytime", "weeklyremind", "weekly")
                                            }else{
                                                givecredits("manager", coins_weekly, "weeklytime", "weeklyremind", "weekly")
                                            }
                                        })
                                    }else{
                                        if(config.Type = "2"){
                                            let gettransf = `SELECT * FROM botusers WHERE id=${interaction.user.id}`
                                            connection.query(gettransf, function (error, results, fields) {
                                                if(results[0].autotransfert = "off"){
                                                    givecredits("discord", coins_weekly, "weeklytime", "weeklyremind", "weekly")
                                                }else{
                                                    givecredits("manager", coins_weekly, "weeklytime", "weeklyremind", "weekly")
                                                }
                                            })
                                        }
                                    }
                                }
                            }

                            if(interaction.options._subcommand == "monthly"){
                            
                                if(json.monthly == "false") { // if user on cooldown
                                    
                                    var dateFormat = new Date(Number(AAAAAAbb.monthly))
                                    dateFormat.setDate(dateFormat.getDate() + 30.4167)
                                    const converted = convertMS(math.chain(dateFormat.valueOf()).subtract(Date.now())); // Donne 19430j
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
                                    if(config.Type = "1"){
                                        let gettransf = `SELECT * FROM users WHERE id=${interaction.user.id}`
                                        connection.query(gettransf, function (error, results, fields) {
                                            if(results[0].autotransfert = "off"){
                                                givecredits("discord", coins_monthly, "monthlytime", "monthlyremind", "monthly")
                                            }else{
                                                givecredits("manager", coins_monthly, "monthlytime", "monthlyremind", "monthly")
                                            }
                                        })
                                    }else{
                                        if(config.Type = "2"){
                                            let gettransf = `SELECT * FROM botusers WHERE id=${interaction.user.id}`
                                            connection.query(gettransf, function (error, results, fields) {
                                                if(results[0].autotransfert = "off"){
                                                    givecredits("discord", coins_monthly, "monthlytime", "monthlyremind", "monthly")
                                                }else{
                                                    givecredits("manager", coins_monthly, "monthlytime", "monthlyremind", "monthly")
                                                }
                                            })
                                        }
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
                                                                        .setDescription("Vous avez transféré " + baldiscord + " points sur le manager!\nVous disposez maintenant de " + newbal + " points!")
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
                            }else{
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
                                        var GetOlbBal = `SELECT * FROM botusers WHERE id="${interaction.user.id}"`

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
                                                var GetBal = `SELECT * FROM users WHERE email="${row[0].email}"`

                                                connection.query(GetBal, function (err, rows, fields) {
                                                    var balmanager = rows[0].money
                                                    var baldiscord = row[0].balance
                                                    var newbal = math.chain(balmanager).add(baldiscord)

                                                    var addpoints = `UPDATE users SET money="${newbal}.00" WHERE email="${row[0].email}"`
                                                    connection.query(addpoints, function (err, rows, fields) {
                                                        var retirerpoints = `UPDATE botusers SET balance="0" WHERE id="${interaction.user.id}"`
                                                        connection.query(retirerpoints, function (err, rowsss, fields) {
                                                            return interaction.reply({
                                                                content: `<@${interaction.user.id}>`,
                                                                embeds:[
                                                                    new EmbedBuilder()
                                                                        .setDescription("Vous avez transféré " + baldiscord + " points sur le manager!\nVous disposez maintenant de " + newbal + " points!")
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
                        }

                        if(interaction.options._subcommand == "solde"){
                            if(config.Type == "1"){
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
                            }else{
                                var aa = `SELECT * FROM botusers WHERE id="${interaction.user.id}"`
                                connection.query(aa, function (err, rows, fields) {
                                    var bb = `SELECT * FROM users WHERE email='${rows[0].email}'`
                                    connection.query(bb, function (err, rowsss, fields) {
                                        return interaction.reply({
                                            content: `<@${interaction.user.id}>`,
                                            embeds:[
                                                new EmbedBuilder()
                                                    .setDescription(`Vous disposez de ${rows[0].balance} points sur votre compte discord et de ${rowsss[0].money} points sur le manager.`)
                                                    .setColor('Green')
                                            ],
                                            ephemeral: false,
                                        })
                                    })
                                })
                            }
                        }
                        if(interaction.options._subcommand == "ajouter"){
                            if(!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)){
                                return;
                            }else{
                                var moneytoadd = interaction.options.get('nombre').value
                                var userr = interaction.options.get('utilisateur') 
                                var user = userr.user.id
                                if(config.Type == "1"){
                                    var GetActualMoney = `SELECT * FROM users WHERE id="${user}"`
                                    connection.query(GetActualMoney, function (err, rowsss, fields) {
                                        if(rowsss.length == "0"){
                                            return interaction.reply({
                                                content: `<@${interaction.user.id}>`,
                                                embeds:[
                                                    new EmbedBuilder()
                                                        .setDescription(`L'utilisateur n'est pas connecté.`)
                                                        .setColor('Red')
                                                ],
                                                ephemeral: true,
                                            })
                                        }
                                        var actualMoney = rowsss[0].balance
                                        var NewBalance = math.chain(actualMoney).add(moneytoadd)
                                        var SetNewBalance = `UPDATE users SET balance="${NewBalance}" WHERE id="${user}"`
                                        connection.query(SetNewBalance, function (err, rows, fields) {
                                            return interaction.reply({
                                                content: `<@${interaction.user.id}>`,
                                                embeds:[
                                                    new EmbedBuilder()
                                                        .setDescription(`L'utilisateur dispose désormais de ${NewBalance} points.`)
                                                        .setColor('Green')
                                                ],
                                                ephemeral: true,
                                            })
                                        })
                                    })
                                }else{
                                    var GetActualMoney = `SELECT * FROM botusers WHERE id="${user}"`
                                    connection.query(GetActualMoney, function (err, rowsss, fields) {
                                        if(rowsss.length == "0"){
                                            return interaction.reply({
                                                content: `<@${interaction.user.id}>`,
                                                embeds:[
                                                    new EmbedBuilder()
                                                        .setDescription(`L'utilisateur n'est pas connecté.`)
                                                        .setColor('Red')
                                                ],
                                                ephemeral: true,
                                            })
                                        }
                                        var actualMoney = rowsss[0].balance
                                        var NewBalance = math.chain(actualMoney).add(moneytoadd)
                                        var SetNewBalance = `UPDATE botusers SET balance="${NewBalance}" WHERE id="${user}"`
                                        connection.query(SetNewBalance, function (err, rows, fields) {
                                            return interaction.reply({
                                                content: `<@${interaction.user.id}>`,
                                                embeds:[
                                                    new EmbedBuilder()
                                                        .setDescription(`L'utilisateur dispose désormais de ${NewBalance} points.`)
                                                        .setColor('Green')
                                                ],
                                                ephemeral: true,
                                            })
                                        })
                                    })
                                }
                            }
                        }
                        if(interaction.options._subcommand == "retirer"){
                            if(!interaction.member.permissions.has(PermissionsBitField.Flags.Administrator)){
                                return;
                            }else{
                                var moneytoadd = interaction.options.get('nombre').value
                                var userr = interaction.options.get('utilisateur') 
                                var user = userr.user.id
                                if(config.Type == "1"){
                                    var GetActualMoney = `SELECT * FROM users WHERE id="${user}"`
                                    connection.query(GetActualMoney, function (err, rowsss, fields) {
                                        if(rowsss.length == "0"){
                                            return interaction.reply({
                                                content: `<@${interaction.user.id}>`,
                                                embeds:[
                                                    new EmbedBuilder()
                                                        .setDescription(`L'utilisateur n'est pas connecté.`)
                                                        .setColor('Red')
                                                ],
                                                ephemeral: true,
                                            })
                                        }
                                        var actualMoney = rowsss[0].balance
                                        var NewBalance = math.subtract(actualMoney, moneytoadd)
                                        var SetNewBalance = `UPDATE users SET balance="${NewBalance}" WHERE id="${user}"`
                                        connection.query(SetNewBalance, function (err, rows, fields) {
                                            return interaction.reply({
                                                content: `<@${interaction.user.id}>`,
                                                embeds:[
                                                    new EmbedBuilder()
                                                        .setDescription(`L'utilisateur dispose désormais de ${NewBalance} points.`)
                                                        .setColor('Green')
                                                ],
                                                ephemeral: true,
                                            })
                                        })
                                    })
                                }else{
                                    var GetActualMoney = `SELECT * FROM botusers WHERE id="${user}"`
                                    connection.query(GetActualMoney, function (err, rowsss, fields) {
                                        if(rowsss.length == "0"){
                                            return interaction.reply({
                                                content: `<@${interaction.user.id}>`,
                                                embeds:[
                                                    new EmbedBuilder()
                                                        .setDescription(`L'utilisateur n'est pas connecté.`)
                                                        .setColor('Red')
                                                ],
                                                ephemeral: true,
                                            })
                                        }
                                        var actualMoney = rowsss[0].balance
                                        var NewBalance = math.subtract(actualMoney, moneytoadd)
                                        var SetNewBalance = `UPDATE botusers SET balance="${NewBalance}" WHERE id="${user}"`
                                        connection.query(SetNewBalance, function (err, rows, fields) {
                                            return interaction.reply({
                                                content: `<@${interaction.user.id}>`,
                                                embeds:[
                                                    new EmbedBuilder()
                                                        .setDescription(`L'utilisateur dispose désormais de ${NewBalance} points.`)
                                                        .setColor('Green')
                                                ],
                                                ephemeral: true,
                                            })
                                        })
                                    })
                                }
                            }
                        }
                })
            }

            function verifsico(){
                if(config.Type == "1"){
                    var Verifsiilestconnecté = `SELECT * FROM users WHERE id="${interaction.user.id}"`
                    connection.query(Verifsiilestconnecté, function(error, results, fields) {
                        var résultats = results.length
                        console.log(résultats)
                        if(résultats == "0"){
                            return false;
                        }
                    })
                }else{
                    if(config.Type == "2"){
                        var Verifsiilestconnecté = `SELECT * FROM botusers WHERE id="${interaction.user.id}"`
                        connection.query(Verifsiilestconnecté, function(error, results, fields) {
                            var résultats = results.length
                            if(résultats == 0){
                                return "false";
                            }
                        })
                    }
                }
            }
        })

        function gettimef(){
            if(config.Type == "1"){
                return "SELECT * FROM users";
            }else{
                if(config.Type == "2"){
                    return "SELECT * FROM botusers";
                }
            }
        }

        function givecredits(endroit, nombre, type, remind, secondtable){
            var datenow = Date.now()
            var datee = datenow.toString()
            var length = datenow.toString().length
            var Now = datee.substr(0, length-3)
            //var Now = Date.now()
            if(endroit == "discord"){
                if(config.Type == "1"){
                    var getcredits = `SELECT * FROM users WHERE id='${interaction.user.id}'`
                    connection.query(getcredits, function (error, results, fields) {
                        var creditsActuels = results[0].balance
                        var Newcredits = math.chain(creditsActuels).add(nombre)
                        var setCredits = `UPDATE users SET balance='${Newcredits}',${type}='${Now}', ${secondtable}=${Date.now()} WHERE id='${interaction.user.id}'`       
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
                }else{
                    var getcredits = `SELECT * FROM botusers WHERE id='${interaction.user.id}'`
                    connection.query(getcredits, function (error, results, fields) {
                        var creditsActuels = results[0].balance
                        var Newcredits = math.chain(creditsActuels).add(nombre)
                        var setCredits = `UPDATE botusers SET balance='${Newcredits}',${type}='${Now}', ${secondtable}=${Date.now()} WHERE id='${interaction.user.id}'`       
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
                }
            }else if(endroit == "manager"){
                if(config.Type == "1"){
                    var setremind = `UPDATE users SET ${remind}="true" WHERE id='${interaction.user.id}'`
                    var getcredits = `SELECT * FROM users WHERE id='${interaction.user.id}'`
                    connection.query(getcredits, function (error, result, fields) {
                        var actualmail = result[0].email
                        var getcredits = `SELECT * FROM tblclients WHERE email='${actualmail}'`
                        connection.query(getcredits, function (error, results, fields) {
                        var creditsActuels = results[0].credit
                        var Newcredits = math.chain(creditsActuels)
                        .add(nombre)
                            var setCredits = `UPDATE tblclients SET credit='${Newcredits}' WHERE email='${actualmail}'`  
                            var Setaa = `UPDATE users SET ${type}='${Now}', ${secondtable}=${Date.now()} WHERE id='${interaction.user.id}'`            
                            connection.query(setCredits, function (error, results, fields) {
                                connection.query(Setaa, function (error, results, fields) {
                                    if(error){
                                        console.log(error)
                                    }
                                    connection.query(setremind, function (error, result, fields) {})
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
                }else{
                    if(config.Type == "2"){
                        var setremind = `UPDATE botusers SET ${remind}="true" WHERE id='${interaction.user.id}'`
                        var getcredits = `SELECT * FROM botusers WHERE id='${interaction.user.id}'`
                        connection.query(getcredits, function (error, result, fields) {
                            var actualmail = result[0].email
                            var getcredits = `SELECT * FROM users WHERE email='${actualmail}'`
                            connection.query(getcredits, function (error, results, fields) {
                            var creditsActuels = results[0].money
                            var Newcredits = math.chain(creditsActuels)
                            .add(nombre)
                                var setCredits = `UPDATE users SET money='${Newcredits}', ${secondtable}=${Date.now()} WHERE email='${actualmail}'`  
                                var Setaa = `UPDATE botusers SET ${type}='${Now}' WHERE id='${interaction.user.id}'`            
                                connection.query(setCredits, function (error, results, fields) {
                                    connection.query(Setaa, function (error, results, fields) {
                                        if(error){
                                            console.log(error)
                                        }
                                        connection.query(setremind, function (error, result, fields) {})
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
            }
        }
    },
};