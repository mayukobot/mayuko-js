const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const nhentai = require('nhentai');
const api = new nhentai.API();

module.exports = {
    data: new SlashCommandBuilder()
    .setName('sauce')
    .setDescription('Display information and a thumbnail about the provided saucecode.')
    .addIntegerOption(option => option.setName('code').setDescription('Saucecode to look up').setRequired(true)),
    async execute(interaction) {
        const saucecode = interaction.options.getInteger('code')
        const resultDoujin = api.fetchDoujin(saucecode);
        const sauceEmbed = new MessageEmbed()
            .setColor('#F15478')
            .setTitle((await resultDoujin).titles.pretty)
            .setURL((await resultDoujin).url)
            .setThumbnail((await resultDoujin).cover.url)
            .addFields(
                { name: 'Tags', value: (await resultDoujin).tags.all.map(tag => tag.name).join(', ') },
                { name: 'Pages', value: (await resultDoujin).length.toString() },
                { name: 'Favorites', value: (await resultDoujin).favorites.toString() }
            )
            .setFooter("Data provided by nhentai.net", "https://raw.githubusercontent.com/mayukobot/mayuko-discord/master/assets/pfp.jpg");
        await interaction.reply({embeds: [sauceEmbed]});
    }
}