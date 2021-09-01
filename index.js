const fs = require('fs');
const { Client, Collection, Intents } = require('discord.js');
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
	const keys = Object.keys(statusFile)
	const randIndex = Math.floor(Math.random() * keys.length)
	const randKey = keys[randIndex]
	const name = statusFile[randKey]

	client.user.setActivity(name, {type: 'WATCHING'})

	console.log('Updated status to watching ' + name)
}

client.once('ready', () => {
	console.log('Ready!');
	setStatus();
	setInterval(setStatus, 1440000)
});

client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;
	const { commandName } = interaction;
	if (!client.commands.has(commandName)) return;

	try {
		await client.commands.get(commandName).execute(interaction);
	} catch (error) {
		console.error(error);
		return interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
	}
});

client.login(token);