const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const client = require('nekos.life');
const neko = new client();


module.exports = {
    data: new SlashCommandBuilder()
        .setName('nekohavatar')
        .setDescription('Sends a lewd avatar for you to use.'),
    async execute(interaction) {
        const nekojson = await neko.nsfw.avatar();
        
        const nekoEmbed = new MessageEmbed()
            .setColor('#512DA8')
            .setTitle("Have a new profile picture, on the house!")
            .setURL(nekojson['url'])
            .setImage(nekojson['url'])
            .setFooter("Data provided by nekos.life", "https://raw.githubusercontent.com/mayukobot/mayuko-discord/master/assets/pfp.jpg")
        await interaction.reply({embeds: [nekoEmbed]});
    }
}