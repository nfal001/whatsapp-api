
import readline from 'readline';
import whatsapp from 'whatsapp-web.js';
import qrcode from 'qrcode-terminal';

const { Client, LocalAuth } = whatsapp;

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});


class ClientManager{
    constructor(){
        this.clients = []
    }

    createClient(clientName){
        const client = new Client({
            authStrategy: new LocalAuth({
                clientId: clientName,
                dataPath: "./local-auth/"
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

        client.on('message', message => {
            if(message.body === '!ping') {
                client.sendMessage(message.from, "hello world");
                console.log(client.getState());
            }
        });

        const clientData = {
            name: clientName,
            client: client
        }

        this.clients.push(clientData);

        return client;
    }
}

const clientManager = new ClientManager();

function sendMessageFromClient(clientName, targetNumber, message){
    const clientInfo = clientManager.clients

    const client = clientInfo.find(c => c.name === clientName).client;

    if (client){
        client.sendMessage(targetNumber, message);
    } else {
        console.log(`Client ${clientName} not found.`);
    }
}

function addNewClient() {
    rl.question('Masukkan nama untuk klien baru: ', (name) => {
        const client = clientManager.createClient(name);

        client.initialize();


        rl.question('send message: ', (answer) => {
            if (answer.toLowerCase() === 'y') {
                sendMessageFromClient("client", "6281949958512@c.us", "hello world");
            } else {
                rl.close();
            }
        });
    });
}



addNewClient();
