import { Client, LocalAuth } from 'whatsapp-web.js';

class ClientManager {
    constructor (){
        this.clients = {}
        this.init()
    }

    createClient = async (clientName) => {
        const client = new Client({
            authStrategy: new LocalAuth({
                clientId: clientName,
                dataPath: "../local_auth/"
            }),
            puppeteer: {
                args: ['--no-sandbox'],
                headless: t
            }
        });

        client.on('qr', (qr) => {

            // APAKAH DISINI INSERT QR CODE KE DB?

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