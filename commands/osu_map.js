const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const osu = require('node-osu-api');
const { getAverageColor } = require('fast-average-color-node') // This library is SICK
const truncate = require('node-truncate');

const animeQuote = require('../utils/anime-quotes')

const { osukey } = require('../config.json');
const osuApi = new osu.Api(osukey)

module.exports = {
    data: new SlashCommandBuilder()
        .setName('map')
        .setDescription('Retrieve information about a provided osu! beatmap ID.')
        .addIntegerOption( option =>
            option.setName('beatmapid')
                .setDescription('The beatmap to search')
                .setRequired(true)
            ),
    async execute(interaction) {
        try {

            const quotePlz = await animeQuote();
            
            const beatmapId = interaction.options.getInteger('beatmapid');
            const resultMap = await osuApi.getBeatmaps({ b: beatmapId })
            const beatmapMapper = await osuApi.getUser({ u: resultMap[0].creator })

            // I'd like to implement this later but right now the node-osu-api implementation is too slow. See issue #3
            // https://github.com/mayukobot/mayuko-js/issues/3
            // const resultMapScore = await osuApi.getScores({ b: beatmapId })

            const avgColor = await getAverageColor("https://assets.ppy.sh/beatmaps/" + resultMap[0].beatmapSetId + "/covers/cover.jpg")

            // Temporary variables used for checking, see below...
            // tl;dr i'm just too lazy to do like, proper checking and stuff lol
            var resultMapGenre = ""
            var resultMapSource = ""
            var resultMapLang =""

            // osu! client displays all difficulties at the second decimal, so we shall do the same.
            var starDifficulty = resultMap[0].difficulty.stars.toFixed(2)

            // Oh hey heres that meme worthy checking I spoke about above PepeLaugh
            if(resultMap[0].genre === undefined) {
                resultMapGenre = "Unspecified"
            } else {
                resultMapGenre = resultMap[0].genre
            }

            if(resultMap[0].source === '') {
                resultMapSource = "Unspecified"
            } else {
                resultMapSource = resultMap[0].source
            }

            if(resultMap[0].language === undefined) {
                resultMapLang = "Unspecified"
            } else {
                resultMapLang = resultMap[0].language
            }

            const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setLabel('View on osu.ppy.sh')
                    .setStyle('LINK')
                    .setURL("https://osu.ppy.sh/beatmapsets/" + resultMap[0].beatmapSetId + "#osu/" + resultMap[0].id)
            );

            const beatmapEmbed = new MessageEmbed()
                .setColor(avgColor.hex)
                .setTitle(resultMap[0].title)
                .setThumbnail("https://a.ppy.sh/" + beatmapMapper.id)
                .setURL("https://osu.ppy.sh/beatmapsets/" + resultMap[0].beatmapSetId + "#osu/" + resultMap[0].id)
                .setImage("https://assets.ppy.sh/beatmaps/" + resultMap[0].beatmapSetId + "/covers/cover.jpg")
                .addFields(
                    { name: 'Mapper',       value: resultMap[0].creator.toString(),         inline: true },
                    { name: 'Artist',       value: resultMap[0].artist.toString(),          inline: true },
                    { name: 'Diff',         value: resultMap[0].version.toString(),         inline: true },
                    { name: 'Language',     value: resultMapLang.toString(),                inline: true },
                    { name: 'Genre',        value: resultMapGenre.toString(),               inline: true },
                    { name: 'Source',       value: resultMapSource.toString(),              inline: true },
                    { name: 'Status',       value: resultMap[0].approvalStatus.toString(),  inline: true },
                    { name: 'Stars',        value: starDifficulty.toString(),               inline: true },
                    { name: 'BPM',          value: resultMap[0].difficulty.bpm.toString(),  inline: true },
                    // { name: 'Top score',    value: resultMapScore[0].user.username.toString(),  inline: true }
                )
                // .setFooter("Data provided by osu.ppy.sh", "https://raw.githubusercontent.com/mayukobot/mayuko-js/master/assets/pfp.jpg")
                .setFooter(resultMap[0].approvalStatus + " | " + resultMap[0].counts.favourites + " ❤")
            return interaction.reply({embeds: [beatmapEmbed], components: [row]});
            // return interaction.reply("test")
        } catch(e) {
            console.log(e)
            throw new Error("osu! Beatmap not found!")
        }
    }
}