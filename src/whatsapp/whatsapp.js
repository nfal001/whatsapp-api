const { Client, LocalAuth } = require('whatsapp-web.js');

class ClientManager {
    constructor (){
        this.clients = {}
    }

    createClient = async (clientName) => {
        const client = new Client({
            authStrategy: new LocalAuth({
                clientId: clientName,
                dataPath: "../local_auth/"
            }),
            puppeteer: {
                args: ['--no-sandbox'],
                headless: false
            }
        });

        client.on('qr', (qr) => {
            qrcode.generate(qr, { small: true });
        });

        client.on('ready', () => {
            console.log('Client is ready!');
        });

        this.clients[clientName] = client;

        return client;
    }
}



export default {
    ClientManager
}