const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const client = require('nekos.life');
const neko = new client();


module.exports = {
    data: new SlashCommandBuilder()
        .setName('nekolewd')
        .setDescription('Sends a lewd neko picture.'),
    async execute(interaction) {
        const nekojson = await neko.nsfw.neko();
        const nekoEmbed = new MessageEmbed()
            .setColor('#512DA8')
            .setTitle("Lewd nekos, on the way!")
            .setURL(nekojson['url'])
            .setImage(nekojson['url'])
            .setFooter("Data provided by nekos.life", "https://raw.githubusercontent.com/mayukobot/mayuko-discord/master/assets/pfp.jpg")
        await interaction.reply({embeds: [nekoEmbed]});
    }
}