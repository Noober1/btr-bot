const { CommandoClient, SQLiteProvider } = require('discord.js-commando');
const path = require('path');
const { token, isDev, inviteUrl } = require('./settings/config.json');
const db = require('./settings/database');

const client = new CommandoClient({
	commandPrefix: '!',
	owner: '587476530230460416',
    invite: inviteUrl,
    unknownCommandResponse: isDev
});

client.setProvider(
    db.then(db => new SQLiteProvider(db))
).catch(console.error);

client.registry
.registerDefaultTypes()
.registerGroups([
    ['settings', 'Settings Command Group'],
    ['test', 'Test Command Group'],
    ['tools', 'Peralatan'],
    ['utils', 'Utilitas BOT'],
])
.registerDefaultGroups()    
.registerDefaultCommands({
    help: false,
    ping: false,
    eval: isDev
})
.registerCommandsIn(path.join(__dirname, 'commands'));

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);
    client.user.setActivity('with You');
});
    
client.on('error', console.error);

client.login(token);