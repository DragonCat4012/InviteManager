const { Message, MessageEmbed } = require("discord.js");

const colors = {
    error: 0xF91A3C,
    blue: 0x93a7cf,
    red: 0x3a3fe4,
    info: 0x1AE3F9,
    success: 0x13EF8D,
    warning: 0xF9D71A,
    nothing: 0x303136,
    unimportant: 0x738F8A
}
const emotes = {
    false: "<:false:740942401413185656>",
    true: "<:true:740942401161527426>",
    mobile: "<:mobile:741225706843013122>",
    bot: "<:Clyde:741225707203592232>",
    desktop: "<:desktop:741225709351206993>",
    coin: "<:coin:743414375255113739>",
    shield: "<:shield:753309572055171173>",
    location: "<:location:771483527169966090>",
    wus: '<:wus:761274129583964201>',
    threatening: '<:threatening:750711786256203777>',
    cool: '<:gilgacool:754654249773957134>',
    oha: '<:0000:761274355841499207>',
    staff: "<:staff:752248790198648852>",
    plus: "<:plus:768749896995569674>",
    yeah: '<:yeah:768747358937808926>'
}

/**
 * @param {Message} msg 
 * @returns {MessageEmbed} a clean Embed
 */
const rawEmb = () => {
    return new MessageEmbed()
        .setColor(colors.blue);
}

module.exports = { colors, rawEmb, emotes };