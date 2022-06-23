const { Client, Intents } = require('discord.js');
const Discord = require('discord.js');
const { token } = require('./config.json');

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
    console.log('Ready!');
});
const gg = async () => {
    const f = await fetch("C:/Lottery/lottery-dapp/pages/api/getUserData.js", {
        body: JSON.stringify("0x70997970C51812dc3A010C7d01b50e0d17dc79C8")
    })
    console.log(f)
}
gg()


client.on('interactionCreate', interaction => {

    const role = interaction.options.getRole('role');
    const member = interaction.options.getMember('target');
    member.roles.add(role);
});


// Login to Discord with your client's token
client.login(token);