const Discord = require('discord.io');
const logger = require('winston');
const auth = require('./auth.json');

logger.remove(logger.transports.Console);
logger.add(new logger.transports.Console, {
    colorize: true
});
logger.level = 'debug';

// Initialize Discord Bot
const bot = new Discord.Client({
    ...auth,
    autorun: true
});

bot.on('ready', () => {
    logger.info('Connected');
    logger.info('Logged in as: ');
    logger.info(bot.username + ' - (' + bot.id + ')');
});

bot.on('message', (user, userID, channelID, message, event) => {
    if (message != '!hide and seek') return;

    const voiceChannels = Object.values(bot.servers[event.d.guild_id].channels).filter(c => c.type == 2);
    const lolChannel = voiceChannels.find(channel => channel.name === 'league-of-legends');
    const candidates = Object.values(lolChannel.members);
    const seekerAmount = candidates.length >= 6 ? 2 : 1;
    const seekers = candidates
        .map(candidate => ({ sort: Math.random(), value: candidate }))
        .sort((a, b) => a.sort - b.sort)
        .map(({ value }) => value)
        .slice(0, seekerAmount);
    let reply;
    if (candidates <= 1) {
        reply = 'Not enough players for Hide & Seek! (Make sure you\'re in the league-of-legends chat)'
    } else {
        reply = `My hammer points to <@${seekers[0].user_id}>${(seekerAmount > 1 ? ` and <@${seekers[1].user_id}>` : '')}`
    }
    bot.sendMessage({
        to: channelID,
        message: reply,
    })
})
