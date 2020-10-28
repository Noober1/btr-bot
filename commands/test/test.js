const { Command } = require('discord.js-commando');

module.exports = class TestCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'hi',
			aliases: ['hello','wassup'],
			group: 'test',
			memberName: 'test',
            description: 'Just to say hello',
            guildOnly: true,
            userPermissions: ['ADMINISTRATOR']
        })
    }
    
    run(msg) {
        console.log('test')
    }   
};