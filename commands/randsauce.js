const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const nhentai = require('nhentai');
const api = new nhentai.API();

module.exports = {
    data: new SlashCommandBuilder()
    .setName('randsauce')
    .setDescription('Generates a random valid saucecode, and sends info about it..'),
    async execute(interaction) {
        if(interaction.channel.type === "DM" || interaction.channel.nsfw) {
            const resultDoujin = api.randomDoujin();
            const sauceEmbed = new MessageEmbed()
                .setColor('#F15478')
                .setTitle((await resultDoujin).titles.pretty)
                .setURL((await resultDoujin).url)
                .setThumbnail((await resultDoujin).cover.url)
                .addFields(
                    { name: 'Tags',         value: (await resultDoujin).tags.all.map(tag => tag.name).join(', ') },
                    { name: 'Code',         value: (await resultDoujin).id.toString()                            },
                    { name: 'Pages',        value: (await resultDoujin).length.toString()                        },
                    { name: 'Favorites',    value: (await resultDoujin).favorites.toString()                     }
                )
                .setFooter("Data provided by nhentai.net", "https://raw.githubusercontent.com/mayukobot/mayuko-js/master/assets/pfp.jpg");
            await interaction.reply({embeds: [sauceEmbed]});
        } else {
            throw new Error("Channel not NSFW!");
        }
    }
};