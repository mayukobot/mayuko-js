const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');
const anilist = require('anilist-node');
const TurndownService = require('turndown');
const truncate = require('node-truncate');
const unixTime = require('unix-timestamp-converter')

const turndownService = new TurndownService();
const Anilist = new anilist();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('anisearch')
        .setDescription('Search for an anime on Anilist.')
        .addStringOption(option => option.setName('title').setDescription("The anime to look up").setRequired(true)),
    async execute(interaction) {
        try {
            const title = interaction.options.getString('title');
            const search = await Anilist.search("anime", title, 1, 5)
            const result = await Anilist.media.anime(search.media[0].id)
            // console.log(search.media)

            const markdown = turndownService.turndown(result.description)

            const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setLabel('View on Anilist')
                    .setStyle('LINK')
                    .setURL("https://anilist.co/anime/" + result.id),
                
            );

            const anisearchEmbed = new MessageEmbed()
                .setColor('#02A9FF')
                .setTitle(result.title.userPreferred)
                .setDescription(markdown.truncate(200))
                .setThumbnail(result.coverImage.large)
                .setURL("https://anilist.co/anime/" + result.id)
                .addFields(
                    { name: "Native name",      value: result.title.native,             inline: false },
                    { name: "Genres",           value: result.genres.toString(),        inline: false },
                    { name: "Airing format",    value: result.format,                   inline: false },
                    { name: "Status",           value: result.status,                   inline: false },
                    { name: "Episodes",         value: result.episodes.toString(),      inline: false },
                    { name: "Average score",    value: result.averageScore + "/100",    inline: false }
                )
                .setFooter("Data provided by anilist.co", "https://raw.githubusercontent.com/mayukobot/mayuko-js/master/assets/pfp.jpg")
            if(result.nextAiringEpisode != null) {
                    anisearchEmbed.addField("Next airing episode", 
                    unixTime.UNIX_CODE(result.nextAiringEpisode.airingAt) + " - Episode " + result.nextAiringEpisode.episode, 
                    false
                );
            }

            await interaction.reply({embeds: [anisearchEmbed], components: [row] })
        } catch(e) { throw new Error("Anime not found!"); }
    }
}