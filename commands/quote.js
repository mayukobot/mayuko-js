const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js')
const anilist = require('anilist-node');
const { getAverageColor } = require('fast-average-color-node')

const animeQuote = require('../utils/anime-quotes');
const Anilist = new anilist();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('quote')
        .setDescription('Get a random quote.'),
    async execute(interaction) {
        const quotePlz = await animeQuote();
        const term = await Anilist.searchEntry.character(quotePlz.character, 1, 10)
        const result = await Anilist.people.character(term.characters[0].id)

        const avgColor = await getAverageColor(result.image.large)

        // console.log(avgColor)

        const row = new MessageActionRow()
        .addComponents(
            new MessageButton()
                .setLabel('View character on Anilist')
                .setStyle('LINK')
                .setURL('https://anilist.co/character/' + result.id),
            new MessageButton()
                .setLabel('View Anime on Anilist')
                .setStyle('LINK')
                .setURL('https://anilist.co/anime/' + result.media[0].id)
        );

        const quoteEmbed = new MessageEmbed()
            .setColor(avgColor.hex)
            .setTitle(quotePlz.character)
            .setDescription(quotePlz.anime)
            .setImage(result.image.large)
            .addField("\u200b", quotePlz.quote)
        
        return interaction.reply({embeds: [quoteEmbed], components: [row]})
    }
}