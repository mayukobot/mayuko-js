const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const ogs = require('open-graph-scraper') 
const options = { url: 'https://mywaifulist.moe/random' };

const truncate = require('node-truncate')
const animeQuote = require('../utils/anime-quotes')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('waifu')
        .setDescription('Sends a random waifu or husbando.'),
    async execute(interaction) {

        const quotePlz = await animeQuote();

        const tags = await ogs(options)

        const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setLabel('View on MyWaifuList')
                    .setStyle('LINK')
                    .setURL(tags.result['ogUrl']),
            );

        const waifuEmbed = new MessageEmbed()
            .setColor('#FFFFFF')
            .setTitle(tags.result['twitterTitle'])
            .setDescription(tags.result['ogDescription'])
            .setURL(tags.result['ogUrl'])
            .setImage(tags.result['ogImage']['url'])
            .setFooter("Data provided by mywaifulist.moe", "https://raw.githubusercontent.com/mayukobot/mayuko-js/master/assets/pfp.jpg")
        await interaction.reply({embeds: [waifuEmbed], components: [row]})
    }
}