const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const axios = require('axios');

const api = require('../assets/api.json');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('pics')
        .setDescription('Sends a picture of the selected category.')
        .addStringOption(option => 
            option.setName('category')
                .setDescription('The picture category')
                .setRequired(true)
                .addChoice(api.nsfw[0].description, api.nsfw[0].name)
                .addChoice(api.nsfw[1].description, api.nsfw[1].name)
                .addChoice(api.nsfw[2].description, api.nsfw[2].name)
                .addChoice(api.nsfw[3].description, api.nsfw[3].name)
                .addChoice(api.nsfw[4].description, api.nsfw[4].name)
                .addChoice(api.nsfw[5].description, api.nsfw[5].name)
                .addChoice(api.nsfw[6].description, api.nsfw[6].name)
                .addChoice(api.nsfw[7].description, api.nsfw[7].name)
                .addChoice(api.nsfw[8].description, api.nsfw[8].name)
                .addChoice(api.nsfw[9].description, api.nsfw[9].name)
                .addChoice(api.nsfw[10].description, api.nsfw[10].name)
            ),
    async execute(interaction) {
        if(interaction.channel.nsfw || message.guild === null) {
            const selection = interaction.options.getString('category');
            const picsData = await axios.get('https://api.hori.ovh/nsfw/' + selection + '/')

            const picsEmbed = new MessageEmbed()
                .setColor('#31D2F2')
                .setTitle('Oh my how, lewd...')
                .setURL(picsData.data.url)
                .setImage(picsData.data.url)
                .setFooter("Data provided by pics.hori.ovh", "https://raw.githubusercontent.com/mayukobot/mayuko-discord/master/assets/pfp.jpg")

            return interaction.reply({embeds: [picsEmbed]})
            // return interaction.reply(selection)
        } else {
            throw new Error("Channel not NSFW!");
        }
    }
};
