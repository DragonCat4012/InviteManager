const { Message } = require('discord.js');
const { rawEmb, emotes, colors } = require('../utilities');

module.exports = {
    name: 'Help',
    syntax: 'help',
    args: false,
    description: 'Zeigt dir alle Befehle',
    type: 'ALLGEMEIN',
    commands: ['help'],

    /**
     *@document
     * @this
     * @param {Message} msg Nachricht in dem der Befehl geschickt wurde
     * @param {String[]} args Argumente die im Befehl mitgeliefert wurden
     */
    async execute(msg, args) {
        let emb = rawEmb(msg)
        let link = "https://discord.com/oauth2/authorize?client_id=" + msg.client.user.id + "&scope=bot&permissions=289856"

        let a = 0;
        let b = 0;
        var modules = msg.client.commands.map((cmd) => cmd.module)
            .filter((mod, i, arr) => arr.indexOf(mod) == i)
            .sort((a, b) => parseInt(a) - parseInt(b));

        for (let mod of modules) {
            let commands = msg.client.commands.filter(cmd => cmd.module == mod).map(cmdO => cmdO.command);
            mod = mod.substr(1)
            b += commands.length;
            a += 1;
            let prop = (mod.toString()).toLowerCase()

            emb.addField(`**${mod}** [${commands.length}]`, commands.map(v => `**-${v.syntax}** [\`${v.description}\`]`).join('\n') + "\n\u200b");
        }
        emb.setDescription(`[Invite-Link](${link})`)
        msg.channel.send(emb.setFooter(`Nutze +help <command> für mehr || ${a} Module mit ${b} Commands`));

    }
};