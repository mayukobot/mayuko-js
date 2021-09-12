const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');
const { osukey } = require('../config.json');
const { countryCodeEmoji,} = require('country-code-emoji')
const osu = require('node-osu-api');

const osuApi = new osu.Api(osukey)

module.exports = {
    data: new SlashCommandBuilder()
    .setName('osu')
    .setDescription('Search for a player on osu! and display information about it.')
    .addStringOption(option => option.setName('user').setDescription("The player to look up").setRequired(true)),
    async execute(interaction) {
        try {
            const user = interaction.options.getString('user')
            const resultUser = await osuApi.getUser({ u: user })

            const row = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setLabel('View on osu.ppy.sh')
                    .setStyle('LINK')
                    .setURL('https://osu.ppy.sh/users/' + resultUser.id),
            );

            const osuEmbed = new MessageEmbed()
                .setColor('#F06EA9')
                .setTitle(resultUser.username + " - osu!")
                .setURL('https://osu.ppy.sh/users/' + resultUser.id)
                .setThumbnail('http://a.ppy.sh/' + resultUser.id)
                .addFields(
                    { name: 'Country',      value: countryCodeEmoji(resultUser.country),        inline: true  },
                    { name: 'Global rank',  value: "#" + resultUser.pp.worldRank,               inline: true  },
                    { name: 'PP',           value: resultUser.pp.raw.toString(),                inline: true  },
                    { name: 'Play count',   value: resultUser.stats.playcount.toString(),       inline: false },
                    { name: 'Hit accuracy', value: resultUser.stats.accuracyFormated,           inline: false },
                    { name: 'SSH',          value: resultUser.ranks.SSH.toString(),             inline: true  },
                    { name: 'SS',           value: resultUser.ranks.SS.toString(),              inline: true  },
                    { name: 'SH',           value: resultUser.ranks.SH.toString(),              inline: true  },
                    { name: 'S',            value: resultUser.ranks.S.toString(),               inline: false },
                    { name: 'A',            value: resultUser.ranks.A.toString(),               inline: true  }
                )
                .setFooter("Data provided by osu.ppy.sh", "https://raw.githubusercontent.com/mayukobot/mayuko-discord/master/assets/pfp.jpg");
            return interaction.reply({embeds: [osuEmbed], components: [row]});
        } catch(e) { throw new Error("osu! Player not found!"); }
    }
};
