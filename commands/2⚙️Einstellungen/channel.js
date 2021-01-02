const { Message } = require('discord.js');
const { rawEmb, emotes, colors } = require('../utilities');

module.exports = {
    name: 'channel',
    syntax: 'channel  #channel',
    args: true,
    description: 'Ändert die Channel für deinen Server',
    perm: 'MANAGE_GUILD',
    type: 'EINSTELLUNGEN',
    commands: ['channel', 'setchannel'],

    /**
     *@document
     * @this
     * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
     * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
     */
    async execute(msg, args) {
        let emb = rawEmb(msg)
        let text;
        var settings = await msg.client.database.settings_cache.getConfig(msg.guild.id);
        let neuChannel = msg.mentions.channels.first()
        if (!neuChannel) return msg.channel.send(emb.setDescription('**Bitte erwähne einen Kanal**').setColor(colors.error))

        settings.WELCOMECHANNEL = neuChannel.id
        await settings.save()
        msg.channel.send(emb.setDescription(`Welcome Channel zu ${neuChannel} gesetzt`).setColor(colors.success))
    }
};