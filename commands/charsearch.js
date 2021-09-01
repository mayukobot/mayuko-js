const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const anilist = require('anilist-node');
const TurndownService = require('turndown');
const truncate = require('node-truncate');

const turndownService = new TurndownService();
const Anilist = new anilist();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('charsearch')
        .setDescription('Search for a character on Anilist.')
        .addStringOption(option => option.setName('name').setDescription("The character to look up").setRequired(true)),
    async execute(interaction) {
        try {
            const name = interaction.options.getString('name');
            const term = await Anilist.searchEntry.character(name, 1, 10)
            const result = await Anilist.people.character(term.characters[0].id)
            // console.log(result)

            // const markdown = turndownService.turndown(result.description)

            const charsearchEmbed = new MessageEmbed()
                .setColor('#02A9FF')
                .setTitle(result.name.english.toString())
                .setDescription(result.description.truncate(200))
                .setImage(result.image.large)
                .setURL("https://anilist.co/character/" + result.id)
                .addFields(
                    { name: "Native name", value: result.name.native, inline: false }
                )
            return interaction.reply({ embeds: [charsearchEmbed] })
        } catch(e) { throw new Error("Character not found!"); }
    }
}