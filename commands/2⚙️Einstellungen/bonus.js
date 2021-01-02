const { Message } = require('discord.js');
const { rawEmb, emotes, colors } = require('../utilities');

module.exports = {
    name: 'bonus',
    syntax: 'bonus @user <number>',
    args: false,
    description: 'Gibt dem User bonus invites an',
    type: 'EINSTELLUNGEN',
    commands: ['bonus'],

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
        if (!num) return msg.channel.send(emb.setDescription('**Achte auf den Syntax**').setColor(colors.error));
        if (!msg.member.hasPermission('ADMINISTRATOR')) return msg.channel.send(emb.setDescription('**Du hast nicht die nötigen Berechtigungen dafür**').setColor(colors.error));
        if (isNaN(num)) return msg.channel.send(emb.setDescription('**Das ist keine Nummer!**').setColor(colors.error))

        num = parseInt(num)
        var databaseMEmber = await msg.client.database.member_cache.getConfig(user.id, msg.guild.id)
        databaseMEmber.BONUS += num

        databaseMEmber.save()
        emb.setDescription(`${user.username} wurden **${num}** Bonus Invites hinzugefügt`)
        msg.channel.send(emb)
    }
};