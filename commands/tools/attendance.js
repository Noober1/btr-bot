const { Command } = require('discord.js-commando');
const Discord = require('discord.js');
const db = require('../../settings/dao');
const { name_month } = require('../../settings/utils')

module.exports = class AttendanceCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'attendance',
			aliases: ['absen','absensi'],
			group: 'tools',
			memberName: 'tools',
            description: 'Member attendance',
            guildOnly: true,
            userPermissions: ['ADMINISTRATOR'],
            args: [
                {
                    key: 'expireTime',
                    prompt: 'Berapa lama absensi dibuka?',
                    type: 'integer',
                    default: 2
                },
                {
                    key: 'lesson',
                    prompt: 'Mata pelajaran apa?',
                    type: 'string',
                    default: ''
                },
                {
                    key: 'className',
                    prompt: 'Untuk kelas apa?',
                    type: 'role'
                }
            ],
        })
    }
    
    run(message, { expireTime, lesson, className }) {

        const expired = expireTime * 60000;

        const addZero = time => time < 10 ? "0" + time : time

        const date = new Date(),
        timeD = date.getDate(),
        timeM = date.getMonth(),
        timeY = date.getFullYear(),
        timeH = addZero(date.getHours()),
        timeI = addZero(date.getMinutes()),
        timeS = addZero(date.getSeconds()),
        timeEnd = new Date(date.getTime() + expired),
        timeEndH = addZero(timeEnd.getHours()),
        timeEndI = addZero(timeEnd.getMinutes()),
        timeEndS = addZero(timeEnd.getSeconds())

        const emojiName = "✅";
        
        const embed = new Discord.MessageEmbed()
        .setColor('#0099ff')
        .setTitle('Absensi ' + (lesson ? 'Pembelajaran ' + lesson : ''))
        .setDescription('Absensi dimulai, silahkan untuk tekan icon ✅ dibawah')
        .addFields([
            { name: 'Peserta yang terakhir absen', value: 'Belum ada yang absen'},
            { name: 'Tanggal dimulai', value: `${timeD} ${name_month[timeM]} ${timeY}`,inline:true},
            { name: 'Waktu dimulai', value: `${timeH}:${timeI}:${timeS}`,inline:true},
            { name: 'Waktu berakhir', value: `${timeEndH}:${timeEndI}:${timeEndS}`,inline:true},
            { name: 'Kelas yang diabsen', value: className}
        ])
        .setTimestamp()
        
        const filter = (reaction, user) => {
            return reaction.emoji.name === emojiName;
        };

        message.say(embed)
        .then(msg => {
            var count = 0;

            msg.react(emojiName)

            const collector = msg.createReactionCollector(filter, { time: expired });

            collector.on('collect', (reaction, user) => {
                const getUserFromGuild = message.guild.members.cache.find(member => member.id === user.id);
                const isMemberHasRole = getUserFromGuild.roles.cache.has(className.id);
                
                if (!user.bot && isMemberHasRole) {
                    embed.fields[0].value = `<@${user.id}>`
                    msg.edit(embed)
                }
            });

            collector.on('end', collected => {
                let collect = collected.get(emojiName);
                let filtering = collect.users.cache.filter(data => {
                    let getUserFromGuild = message.guild.members.cache.find(member => member.id === data.id);
                    let isMemberHasRole = getUserFromGuild.roles.cache.has(className.id);
                    return !data.bot && isMemberHasRole;
                })
                let names = filtering.reduce((currentNames,user) => {
                    return !user.bot ? currentNames + `<@${user.id}>\n` : currentNames;
                }, '')
                
                db.run('INSERT INTO attendance (guild,date,roleId,data) VALUES (?,?,?,?)',[
                    message.guild.id,
                    `${timeD}-${(timeM + 1)}-${timeY}`,
                    className.id,
                    names
                ]).then(res => {
                    embed.setDescription('Absensi telah berakhir')
                    embed.fields[0] = {
                        name: 'Daftar peserta yang hadir',
                        value: names ? names : 'Tidak ada peserta'
                    }
                    msg.edit(embed)
                    msg.reactions.removeAll()
                })
                .catch(err => {
                    embed.setDescription('Error: \`\`\`' + err + '\`\`\`')
                    embed.fields[0] = {}
                    msg.edit(embed)
                    msg.reactions.removeAll()
                })
            });
        })

        message.delete()
    }   
};