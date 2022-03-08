const express = require('express')
const app = express()
const { Client, Intents } = require('discord.js');
const fs = require("fs");

const client = new Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_INTEGRATIONS,
        Intents.FLAGS.GUILD_MEMBERS,
    ]
});

client.login("")

client.on('ready', async (message) => {
    console.log(message.user.username)
})

client.on('interactionCreate', async (message) => {
    if(message.commandName === undefined && message.commandName === null) return;
    try {
        const jsonString = await fs.readFileSync("./count.json", "utf8")

        try {
            let count_raw = JSON.parse(jsonString)
            let rawin = String(message.commandName);

            try {
                if (!count_raw[rawin]) {
                    let rawtojson = JSON.parse(`{ "${rawin}" : 1 }`)
                    Object.assign(count_raw, rawtojson)
                    await fs.writeFileSync("./count.json", JSON.stringify(count_raw), 'utf-8');
                    return;
                }

                let rawtojson = JSON.parse(`{ "${rawin}" : ${count_raw[rawin] + 1} }`)
                Object.assign(count_raw, rawtojson)
                await fs.writeFileSync("./count.json", JSON.stringify(count_raw), 'utf-8');

            } catch (e) {
                console.log("Write File Failed", e)
                return;
            }

        } catch (e) {
            console.log("Parse Failed", e);
            return;
        }

    } catch (e) {
        console.log("File read failed:", e);
        return;
    }
})

app.set('view engine', 'pug')

app.get('/', async (req, res) => {
    const jsonString = await fs.readFileSync("./count.json", "utf8")
    let count_raw = JSON.parse(jsonString)    
    await res.render('../page/index', {
        count_prewew_keys: JSON.stringify(Object.keys(count_raw)),
        count_prewew_values: JSON.stringify(Object.values(count_raw)),
        bot_image: 'https://cdn.discordapp.com/avatars/940563218579996702/5c0961a8df8e65ac88d034843d82d44a.webp',
    })
})

app.use('/cdn', express.static('public'))

app.listen("80", () => {
    console.log(`Example app listening on port 80`)
})