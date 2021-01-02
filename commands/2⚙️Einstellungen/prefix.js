const { Message } = require('discord.js');
const { rawEmb, emotes } = require('../utilities');

module.exports = {
    name: 'prefix',
    syntax: 'prefix',
    args: true,
    description: 'Ändert das Prefix für deinen Server',
    perm: 'MANAGE_GUILD',
    type: 'EINSTELLUNGEN',
    commands: ['prefix', 'setprefix'],

    /**
     *@document
     * @this
     * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
     * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
     */
    async execute(msg, args) {
        let emb = rawEmb(msg)
        var settings = await msg.client.database.settings_cache.getConfig(msg.guild.id);
        let neu = args[0]

        settings.PREFIX = neu
        await settings.save()

        emb.setDescription(`Prefix geändert zu \`${neu}\``)
        msg.channel.send(emb)
    }
};