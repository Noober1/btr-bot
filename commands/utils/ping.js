const { Command } = require('discord.js-commando');

module.exports = class PingCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'ping',
			group: 'utils',
			memberName: 'ping',
            description: 'Check latency and heartbeat',
            guildOnly: true
        })
    }
    
    async run(msg) {
        const pingMsg = await msg.reply('Menunggu respon...');
        const latency = (pingMsg.editedTimestamp || pingMsg.createdTimestamp) - (msg.editedTimestamp || msg.createdTimestamp);
        const heartbeat = this.client.ws.ping ? `Detak jantung: ${Math.round(this.client.ws.ping)}` : '';

        return pingMsg.edit(`Pong! Waktu pesan sampai membutuhkan waktu sekitar ${latency} milidetik. ${heartbeat}`) 
    }   
};