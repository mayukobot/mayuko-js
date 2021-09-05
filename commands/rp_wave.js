const { SlashCommandBuilder } = require('@discordjs/builders');
const {  } = require('discord.js');
const { fetchNeko } = require('nekos-best.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('wave')
        .setDescription('Wave at someone!')
        .addUserOption(option => option.setName('user').setDescription('Select a user')),
    async execute(interaction) {
        const user = interaction.options.getUser('user')
        const userBuild = "<@" + user + ">"
        const senderBuild = "<@" + interaction.user + ">"
        const wave = await fetchNeko('wave')

        if(user == null) { 
            await interaction.reply(senderBuild + " waved!" + "\n" + wave.url)
        } else {
            await interaction.reply(senderBuild + " waved at " + userBuild + "\n" + wave.url)
        }
    }
};