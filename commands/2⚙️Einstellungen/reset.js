const { Message } = require('discord.js');
const { rawEmb, emotes, colors } = require('../utilities');

module.exports = {
    name: 'reset',
    syntax: 'reset @user',
    args: false,
    description: 'Setzt alle Invites eines Users zurück',
    type: 'EINSTELLUNGEN',
    commands: ['reset'],

    /**
     *@document
     * @this
     * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
     * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
     */
    async execute(msg, args) {
        let num = args[1]
        let user;
        let emb = rawEmb(msg)
        if (msg.mentions.users.first()) {
            user = msg.mentions.users.first();
        } else { return msg.channel.send(emb.setDescription('**Gib einen Nutzer an**').setColor(colors.error)); }

        if (user.bot) {
            emb.setDescription("Bots haben kein Profil qwq")
            return msg.channel.send(emb.setColor(colors.error))
        }

        var databaseMEmber = await msg.client.database.member_cache.getConfig(user.id, msg.guild.id)
        databaseMEmber.TOTAL = 0
        databaseMEmber.LEAVED = 0
        databaseMEmber.FAKE = 0
        databaseMEmber.BONUS = 0
        databaseMEmber.save()

        msg.channel.send(emb.setDescription(`${user.username}´Invites wurdenzurückgesetzt`).setColor(colors.success))
    }
};