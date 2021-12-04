const { SlashCommandBuilder } = require('@discordjs/builders');
const { default: axios } = require('axios');
const { getAverageColor } = require('fast-average-color-node')
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('fumo')
        .setDescription('Sends a fumo.'),
    async execute(interaction) {
        const picsData = await axios.get('https://fumoapi.herokuapp.com/random')
        // const avgColor = await getAverageColor(picsData.URL)

        const picsEmbed = new MessageEmbed()
            .setColor('#60c58f')
            .setURL(picsData.data.URL)
            .setImage(picsData.data.URL)
            .setFooter("Data provided by fumoapi", "https://raw.githubusercontent.com/mayukobot/mayuko-js/master/assets/pfp.jpg")
        
        return interaction.reply({embeds: [picsEmbed]})
    }
}