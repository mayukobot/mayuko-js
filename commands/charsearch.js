const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const anilist = require('anilist-node');
const TurndownService = require('turndown');
const truncate = require('node-truncate');

const animeQuote = require('../utils/anime-quotes')

const turndownService = new TurndownService();
const Anilist = new anilist();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('charsearch')
        .setDescription('Search for a character on Anilist.')
        .addStringOption(option => option.setName('name').setDescription("The character to look up").setRequired(true)),
    async execute(interaction) {
        try {
            const quotePlz = await animeQuote();
            const name = interaction.options.getString('name');
            const term = await Anilist.searchEntry.character(name, 1, 10)
            const result = await Anilist.people.character(term.characters[0].id)
            // console.log(quotePlz.quote)

            // const markdown = turndownService.turndown(result.description)
            const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setLabel('View on Anilist')
                    .setStyle('LINK')
                    .setURL("https://anilist.co/character/" + result.id),
            );

            const charsearchEmbed = new MessageEmbed()
                .setColor('#02A9FF')
                .setTitle(result.name.english.toString())
                .setDescription(result.description.truncate(200))
                .setImage(result.image.large)
                .setURL("https://anilist.co/character/" + result.id)
                .setFooter("Data provided by anilist.co", "https://raw.githubusercontent.com/mayukobot/mayuko-js/master/assets/pfp.jpg")
                .addFields(
                    { name: "Native name", value: result.name.native, inline: false }
                )
            return interaction.reply({ embeds: [charsearchEmbed], components: [row] })
        } catch(e) { console.log(e); throw new Error("Character not found!"); }
    }
}