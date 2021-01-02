const { Message } = require('discord.js');
const { rawEmb, colors, emotes } = require('../utilities');

module.exports = {
    name: 'invites',
    syntax: 'invites [@user]',
    args: false,
    description: 'Zeigt dir deine Invites',
    type: 'ALLGEMEIN',
    commands: ['profile', 'invites'],

    /**
     *@document
     * @this
     * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
     * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
     */
    async execute(msg) {
        let user;
        let emb = rawEmb(msg)
        if (msg.mentions.users.first()) {
            user = msg.mentions.users.first();
        } else { user = msg.author; }

        if (user.bot) {
            emb.setDescription("Bots haben kein Profil qwq")
            return msg.channel.send(emb.setColor(colors.error))
        }

        var db = await msg.client.database.member_cache.getConfig(user.id, msg.guild.id);
        emb.setTitle(`${user.username}´s Invites`)
            .setDescription(`**${db.TOTAL -db.LEAVED}** ${db.TOTAL > 1 ? 'Invites' : 'Invite'}, **${db.FAKE}** Faked, **${db.BONUS}** Bonus, **${db.TOTAL}** Einladungen`)
        msg.channel.send(emb)
    }
};