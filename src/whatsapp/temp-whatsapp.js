import {pkg} from 'qrcode-terminal';
const readline = require('readline');
const { Client, LocalAuth } = require('whatsapp-web.js');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


class ClientManager{
    constructor(){
        this.clients = {}
    }

    createClient(clientName){
        const client = new Client({
            authStrategy: new LocalAuth({
                clientId: clientName,
                dataPath: "./session/"
            }),
            puppeteer: {
                args: ['--no-sandbox'],
                headless: false
            }
        })

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

const clientManager = new ClientManager();

function sendMessageFromClient(clientName, targetNumber, message){
    const clientInfo = clientManager.clients[clientName]

    if (clientInfo){
        const client = clientInfo.client;
        client.sendMessage(targetNumber, message);
    } else {
        console.log(`Client ${clientName} not found.`);
    }
}

function addNewClient() {
    rl.question('Masukkan nama untuk klien baru: ', (name) => {
        const client = clientManager.createClient(name);

        client.initialize();


        rl.question('Client state: ', (answer) => {
            if (answer.toLowerCase() === 'y') {
                getState(client);
            } else {
                rl.close();
            }
        });
    });
}

function getState(client){
    console.log(client.getState());
}



addNewClient();