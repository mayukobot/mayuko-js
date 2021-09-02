const fs = require('fs');
const { Client, Collection, Intents, MessageEmbed } = require('discord.js');
const { token } = require('./config.json');

const statusFile = require('./assets/anime.json')

const client = new Client({ intents: [Intents.FLAGS.GUILDS] });
client.commands = new Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

function setStatus() {
	const keys = Object.keys(statusFile);
	const randIndex = Math.floor(Math.random() * keys.length);
	const randKey = keys[randIndex];
	const name = statusFile[randKey];

	client.user.setActivity(name, {type: 'WATCHING'});

	console.log('Updated status to watching ' + name);
}

client.once('ready', () => {
	//deleteCommands();
	console.log('Ready!');
	setStatus();
	setInterval(setStatus, 1440000);
	
});

async function deleteCommands() {
	console.log('Unregistering unused commands');
	const test = await client.api.applications(client.user.id).commands.get();
	// client.api.applications(client.user.id).commands("883036238955806780").delete();
	// client.api.applications(client.user.id).commands("882778128584417315").delete();
	// client.api.applications(client.user.id).commands("882778128584417314").delete();
	// client.api.applications(client.user.id).commands("882778128584417313").delete();
	// client.api.applications(client.user.id).commands("882778128584417312").delete();
	// client.api.applications(client.user.id).commands("882778128584417311").delete();
	// client.api.applications(client.user.id).commands("882778128584417310").delete();
	// client.api.applications(client.user.id).commands("882778128584417310").delete();
	// client.api.applications(client.user.id).commands("882778128584417311").delete();
	console.log(test)
}

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;
	const { commandName } = interaction;
	if (!client.commands.has(commandName)) return;

	try {
		await client.commands.get(commandName).execute(interaction);
	} catch (error) {
		if(error instanceof Error) {
			if(error.message == 'Anime not found!') {
				console.log(error.message);
				const NotFoundEmbed = new MessageEmbed()
					.setColor('#E94D4E')
					.setTitle('Error')
					.addField('Anime not found.', interaction.options.getString('title') + " is not a valid anime.")
					.setThumbnail('https://raw.githubusercontent.com/mayukobot/mayuko-discord/master/assets/not_found.png')
					.setFooter('Mayuko', 'https://raw.githubusercontent.com/mayukobot/mayuko-discord/master/assets/pfp.jpg')
				return interaction.reply({ embeds: [NotFoundEmbed], ephemeral: true });
			} else if(error.message == 'Channel not NSFW!') {
				console.log(error.message)
				const NSFWEmbed = new MessageEmbed()
                	.setColor('#E94D4E')
                	.setTitle('Error')
                	.addField('NSFW Content', 'NSFW commands are disabled in non-NSFW channels.')
                	.setThumbnail('https://raw.githubusercontent.com/mayukobot/mayuko-discord/master/assets/nsfw_error.png')
                	.setFooter('Mayuko', 'https://raw.githubusercontent.com/mayukobot/mayuko-discord/master/assets/pfp.jpg')
            	return interaction.reply({ embeds: [NSFWEmbed], ephemeral: true });
			} else if(error.message == 'Character not found!') {
				console.log(error.message);
				const NotFoundEmbed = new MessageEmbed()
					.setColor('#E94D4E')
					.setTitle('Error')
					.addField('Character not found.', interaction.options.getString('name') + " is not a valid character.")
					.setThumbnail('https://raw.githubusercontent.com/mayukobot/mayuko-discord/master/assets/not_found.png')
					.setFooter('Mayuko', 'https://raw.githubusercontent.com/mayukobot/mayuko-discord/master/assets/pfp.jpg')
				return interaction.reply({ embeds: [NotFoundEmbed], ephemeral: true });
			} else if(error.message == 'osu! Player not found!') {
				console.log(error.message);
				const NotFoundEmbed = new MessageEmbed()
					.setColor('#E94D4E')
					.setTitle('Error')
					.addField('osu! player not found.', interaction.options.getString('user') + " is not a valid player.")
					.setThumbnail('https://raw.githubusercontent.com/mayukobot/mayuko-discord/master/assets/not_found.png')
					.setFooter('Mayuko', 'https://raw.githubusercontent.com/mayukobot/mayuko-discord/master/assets/pfp.jpg')
				return interaction.reply({ embeds: [NotFoundEmbed], ephemeral: true });
			}
		} else {
			console.log(error);
			return interaction.reply({content: 'General error', ephemeral: true });
		}
		// console.error(error);
		// return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.login(token);