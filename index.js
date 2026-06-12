require('dotenv').config();

const { Client, GatewayIntentBits } = require('discord.js');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent
    ]
});

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('messageCreate', async message => {

    if (message.author.bot) return;

    if (message.content.startsWith('!clear')) {

        const args = message.content.split(' ');
        const amount = parseInt(args[1]);

        if (!amount) {
            return message.channel.send(
                'Please provide a number.'
            );
        }
        await message.channel.bulkDelete(amount + 1, true);

        // message.channel.send(
        //     `Deleted ${amount} messages.`
        // );

        
    }   
    if (message.content === '!time'){
            const curr_time = new Date();   
            message.channel.send(`Current Time : ${curr_time.toLocaleTimeString()}`);
    }

    if (message.content === '!pin'){
        if(!message.reference){
            return message.channel.send('Please reply to a message to pin it.');
        }

        const targetMessage = await message.channel.messages.fetch(message.reference.messageId);
        await targetMessage.pin();
    }
    
    if (message.content === '!unpin'){
        if(!message.reference){
            return message.channel.send('Please reply to a pinned message to unpin it.');
        }

        const targetMessage = await message.channel.messages.fetch(message.reference.messageId);
        await targetMessage.unpin();

    }
});


client.on('messageCreate', message => {
    console.log("Received:", message.content);
});

client.on('messageDelete', async message => {

    const logChannel_dlt =
        message.guild.channels.cache.find(
            channel => channel.name === 'deleted-msgs'
        );

    if (!logChannel_dlt) return;

    logChannel_dlt.send(
        `${message.author.tag}: ${message.content}`
    );

});

client.on('messageUpdate', async (oldMessage, newMessage) => {

    const logChannel_edt =
        oldMessage.guild.channels.cache.find(
            channel => channel.name === 'edit-logs'
        );

    logChannel_edt.send(
        `
${oldMessage.author.tag} edited a message:
Before: ${oldMessage.content}
After: ${newMessage.content}
        `
    );
});

client.login(process.env.TOKEN);




