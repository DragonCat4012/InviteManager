const { Message } = require('discord.js');
const { rawEmb, colors, emotes } = require('../utilities');

module.exports = {
    name: 'leaderboard',
    syntax: 'leaderboard',
    args: false,
    description: 'Zeigt dir das Leaderboard nach Invites',
    type: 'ALLGEMEIN',
    commands: ['leaderboard', 'lb', 'top'],

    /**
     *@document
     * @this
     * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
     * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
     */
    async execute(msg, args) {
        let emb = rawEmb(msg).setTitle("Leaderboard")
        var users = await msg.client.database.member_cache.array()

        users = users
            .sort((a, b) => (b.TOTAL - b.FAKE) - (b.TOTAL - b.FAKE))
            .filter((v, i, arr) => i < 10)
            .map((user, index) => {
                let u = msg.client.users.resolve((user.MID).substring(0, 18))
                if (!u) u = 'Not Found'
                return `\`${index + 1}.\` ${u} **[ ${user.TOTAL - user.FAKE} ]**`
            });
        if (users.length < 1) return msg.channel.send(emb.setDescription('No one has invites qwq'));
        return msg.channel.send(emb.setDescription(users.join("\n")));
    }
};