const { Message } = require('discord.js');
const { rawEmb, colors, emotes } = require('../utilities');

module.exports = {
    name: 'info',
    syntax: 'info',
    args: false,
    description: 'Zeigt dir Inos über mich ^^',
    type: 'ALLGEMEIN',
    commands: ['info', 'botinfo'],

    /**
     *@document
     * @this
     * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
     * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
     */
    async execute(msg) {

        let emb = rawEmb(msg)
            .setTitle("Meine Infos")
            .addField("**Sever**", (msg.client.guilds.cache.size).toLocaleString())
            .addField("**User**", (msg.client.users.cache.size).toLocaleString())
            .addField("**Channel**", (msg.client.channels.cache.size).toLocaleString())
        msg.channel.send(emb);
    }
};