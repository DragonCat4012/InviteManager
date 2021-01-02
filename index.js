const fs = require("fs");
const { Message, Collection, Client, MessageEmbed, Invite } = require('discord.js');

const { colors, rawEmb, emotes } = require("./commands/utilities");
const config = require("./config.json");
const { Member, Settings, syncDatabase } = require('./database/dbInit');
var { token, owner } = config;

const client = new Client();
client.config = config;

//==================================================================================================================================================
//Currency and Levelingsystem
//==================================================================================================================================================

var invites = new Collection([
    ["dummy", []]
]);
invites.delete('dummy');

var member_cache = new Collection();
var settings_cache = new Collection();

Reflect.defineProperty(settings_cache, "getConfig", {
    /**
     * @param {number} id User ID
     * @returns {Model} new User
     */
    value: async function(id) {
        var server = settings_cache.get({ GID: id });
        if (!server) server = await Settings.findOne({ where: { GID: id } });
        if (!server) {
            server = await Settings.create({ GID: id });
            settings_cache.set({ GID: id }, server);
        }
        return server;
    }
});
//==================================================================================================================================================
Reflect.defineProperty(member_cache, "getConfig", {
    /**
     * @param {number} id Guild ID
     *  @param {number} uid Channel ID
     * @returns {Model} new User
     */
    value: async function(mid, gid) {
        let id = `${mid}${gid}`
        var member = member_cache.get({ MID: id })
        if (!member) member = await Member.findOne({ where: { MID: id } });

        if (!member) {
            member = await Member.create({ MID: id });
            member_cache.set({ MID: id }, member);
        }
        return member;
    }
});

//==================================================================================================================================================
//Sync
const initDatabase = async() => {
    await syncDatabase();

    try {
        for (let entr of(await Member.findAll())) { member_cache.set(entr.MID, entr); }
        for (let entr of(await Settings.findAll())) { settings_cache.set(entr.GID, entr); }

        console.log(" > 🗸 Cached Database Entries");
    } catch (e) {
        console.log(" > ❌ Error While Caching Database")
        console.log(e);
    }
}

client.database = { member_cache, settings_cache };

client.commands = new Collection();
const commandDirectorys = fs
    .readdirSync("./commands").map(name => "./commands/" + name).filter(path => fs.lstatSync(path).isDirectory());

for (const dir of commandDirectorys) {
    const module_name = dir.split('/')[dir.split('/').length - 1];
    const commandFiles = fs.readdirSync(dir).filter(file => file.endsWith('.js'));

    for (let file of commandFiles) {
        const command = require(`${dir}/${file}`);
        client.commands.set(command.name, {
            command: command,
            module: module_name
        });
    }
}

const start = async() => {
    try {
        console.log("Logging in...");
        await client.login(token).catch(e => {
            switch (e.code) {
                case 500:
                    console.log(" > ❌ Fetch Error");
                    break;
                default:
                    console.log(" > ❌ Unknown Error");
                    break;
            }
            setTimeout(() => { throw e }, 5000);
        });
        await initDatabase();
    } catch (e) {
        console.log(e);
    }
}
start();



client.on("ready", async() => {
    console.log(" >  Logged in as: " + client.user.tag);
    client.user.setStatus("idle");
    client.user.setActivity('Fetching Invites');

    for (const guild of client.guilds.cache.array()) {
        invites.set(guild.id, await guild.fetchInvites().then(col => col.array()))
    }
    console.log(" >  Checked Invites");
});

client.on('guildCreate', async guild => {
    invites.set(guild.id, await guild.fetchInvites().then(col => col.array()))
})

async function updateInvites(inv) {
    invites.set(inv.guild.id, await inv.guild.fetchInvites().then(c => c.array()).catch(e => []))
}

client.on("inviteCreate", updateInvites);
client.on("inviteDelete", updateInvites);

client.on("guildMemberAdd", async member => {
    if (member.user.bot) return;
    let channel;

    const { guild } = member;
    var old = invites.get(guild.id);
    var updated = await guild.fetchInvites().then(c => c.array());

    let settings = await client.database.settings_cache.getConfig(guild.id);
    if (settings.WELCOMECHANNEL) channel = await guild.channels.resolve(settings.WELCOMECHANNEL)
    var invite = updated.find((inv, index) => inv.uses !== old[index].uses)
    if (!invite) { text = `Ich konnte den Invite nicht heraus finden` } else {
        const fake = (Date.now() - member.createdAt) / (1000 * 60 * 60 * 24) <= 3 ? true : false
        let memberData = await client.database.member_cache.getConfig(member.id, guild.id);
        const inviter = invite.inviter
        if (inviter) {
            let inviterData = await client.database.member_cache.getConfig(inviter.id, guild.id)
            inviterData.TOTAL += 1
            memberData.INVITER = inviter.id
            if (fake) inviterData.FAKE += 1

            await inviterData.save()
            await memberData.save()
            text = `${member} wurde von ${inviter} eingeladen`
        }
    }
    let emb = rawEmb().setDescription(text)
    if (channel) channel.send(emb)
    if (!channel) settings.WELCOMECHANNEL = null
});

client.on("guildMemberRemove", async member => {
    let { guild } = member
    let memberData = await client.database.member_cache.getConfig(member.id, guild.id)
    if (!memberData.INVITER) return

    let inviterData = await client.database.member_cache.getConfig(memberData.INVITER, guild.id)
    inviterData.LEAVED += 1
    await inviterData.save()
});

client.on("message", async message => {
    if (message.author.bot) return;
    if (message.channel.type == 'dm') return;
    var emb = rawEmb(message)

    let guildConfig = await client.database.settings_cache.getConfig(message.guild.id)
    let prefix = guildConfig.PREFIX;
    //==================================================================================================================================================
    let test = message.mentions.members.first()
    if (test && test.id == client.user.id && !message.content.startsWith(prefix)) {
        message.channel.send("Mein Prefix ist " + "\`" + prefix + "\`")
    }

    if (!message.content.startsWith(prefix)) return;
    const args = message.content.slice(prefix.length).split(/ +/);

    const commandName = args.shift().toLowerCase();
    const commandObj = client.commands.find(cmd => cmd.command.commands.includes(commandName));
    if (!commandObj) return;

    const { command, module } = commandObj;

    if (command.args && !args.length) {
        emb.setDescription(`Du musst Argumente angeben, <@${message.member.id}>!`);
        if (command.syntax) emb.addField(`Syntax`, `\`${prefix}${command.syntax}\``)
        return message.channel.send(emb);
    }

    try {
        command.execute(message, args);
    } catch (error) {
        console.error(error);
        emb.setDescription(
            `Es gibt wohl noch etwas Technische Probleme mit diesem Befehl :0`
        );
        message.channel.send(emb.setColor(colors.error))
    }
});