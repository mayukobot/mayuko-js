const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { getAverageColor } = require('fast-average-color-node')
const { osukey } = require('../config.json');
const { countryCodeEmoji } = require('country-code-emoji')

const truncate = require('node-truncate')
const animeQuote = require('../utils/anime-quotes')

const osu = require('node-osu-api');

const osuApi = new osu.Api(osukey)

module.exports = {
    data: new SlashCommandBuilder()
    .setName('osu')
    .setDescription('Search for a player on osu! and display information about it.')
    .addStringOption(option => 
        option.setName('user')
            .setDescription("The player to look up")
            .setRequired(true))

    .addIntegerOption(option2 =>
            option2.setName("mode")
                .setDescription("Game mode")
                .setRequired(true)
                .addChoice("osu!standard", 0)
                .addChoice("osu!taiko", 1)
                .addChoice("osu!catch", 2)
                .addChoice("osu!mania", 3)
        ),
    async execute(interaction) {
        try {

            const quotePlz = await animeQuote();

            const user = interaction.options.getString('user')
            const mode = interaction.options.getInteger('mode')
            const resultUser = await osuApi.getUser({ u: user, m: mode})

            var titleString = ""
            var embedUrl = ""

            var colorString = "#E7649F"
            var pfpString = 'http://a.ppy.sh/' + resultUser.id

            try {
                const avgColor = await getAverageColor('http://a.ppy.sh/' + resultUser.id)
                pfpString = 'http://a.ppy.sh/' + resultUser.id
                colorString = avgColor.hex
            } catch(e) {
                console.log("User does not have a profile picture, falling back to default color.")
                var pfpString = 'https://a.ppy.sh/'
                colorString = "#E7649F"
            }

            // console.log(resultUser)



            
            switch(mode) {
                case 0:
                    titleString = resultUser.username + " - osu!"
                    embedUrl = "https://osu.ppy.sh/users/" + resultUser.id + "/osu"
                    break;
                case 1:
                    titleString = resultUser.username + " - osu!taiko"
                    embedUrl = "https://osu.ppy.sh/users/" + resultUser.id + "/taiko"
                    break;
                case 2:
                    titleString = resultUser.username + " - osu!catch"
                    embedUrl = "https://osu.ppy.sh/users/" + resultUser.id + "/fruits"
                    break;
                case 3:
                    titleString = resultUser.username + " - osu!mania"
                    embedUrl = "https://osu.ppy.sh/users/" + resultUser.id + "/mania"
                    break;
                default:
                    titleString = resultUser.username + " - osu!"
                    embedUrl = "https://osu.ppy.sh/users/" + resultUser.id + "/osu"
                    break;
            }

            const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setLabel('View on osu.ppy.sh')
                    .setStyle('LINK')
                    .setURL(embedUrl)
            );

            const osuEmbed = new MessageEmbed()
                // .setColor(avgColor.hex)
                .setColor(colorString)
                .setTitle(titleString)
                .setURL(embedUrl)
                .setThumbnail(pfpString)
                .addFields(
                    { name: 'Country',      value: countryCodeEmoji(resultUser.country),        inline: true  },
                    { name: 'Global rank',  value: "#" + resultUser.pp.worldRank,               inline: true  },
                    { name: 'PP',           value: resultUser.pp.raw.toString(),                inline: true  },
                    { name: 'Play count',   value: resultUser.stats.playcount.toString(),       inline: false },
                    { name: 'Hit accuracy', value: resultUser.stats.accuracyFormated,           inline: false },
                    { name: 'SSH',          value: resultUser.ranks.SSH.toString(),             inline: true  },
                    { name: 'SS',           value: resultUser.ranks.SS.toString(),              inline: true  },
                    { name: 'SH',           value: resultUser.ranks.SH.toString(),              inline: true  },
                    { name: 'S',            value: resultUser.ranks.S.toString(),               inline: true  },
                    { name: 'A',            value: resultUser.ranks.A.toString(),               inline: true  }
                )
                .setFooter(`${quotePlz.quote.truncate(60)} -${quotePlz.character}, ${quotePlz.anime}`, "https://raw.githubusercontent.com/mayukobot/mayuko-js/master/assets/pfp.jpg")
            return interaction.reply({embeds: [osuEmbed], components: [row]});
        } catch(e) { 
            console.log(e)
            throw new Error("osu! Player not found!"); }
    }
};
