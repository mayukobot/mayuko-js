const { SlashCommandBuilder } = require('@discordjs/builders');
const animeQuote = require('../utils/anime-quotes')

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Replies with pong!'),
    async execute(interaction) {
        const quotePlz = await animeQuote();
        await interaction.reply(`${quotePlz.quote} -${quotePlz.character} from ${quotePlz.anime}`)
    }
}