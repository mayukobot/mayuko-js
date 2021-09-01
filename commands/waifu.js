const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const ogs = require('open-graph-scraper') 
const options = { url: 'https://mywaifulist.moe/random' };

module.exports = {
    data: new SlashCommandBuilder()
        .setName('waifu')
        .setDescription('Sends a random waifu or husbando.'),
    async execute(interaction) {
        const tags = await ogs(options)

        const waifuEmbed = new MessageEmbed()
            .setColor('#FFFFFF')
            .setTitle(tags.result['twitterTitle'])
            .setDescription(tags.result['ogDescription'])
            .setURL(tags.result['ogUrl'])
            .setImage(tags.result['twitterImage']['url'])
            .setFooter("Data provided by mywaifulist.moe", "https://raw.githubusercontent.com/mayukobot/mayuko-discord/master/assets/pfp.jpg");
        await interaction.reply({embeds: [waifuEmbed]})
    }
}