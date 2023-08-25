import whatsapp from 'whatsapp-web.js';
import { prismaClient } from '../application/database.js';
import qrcode from 'qrcode-terminal';

const { Client, LocalAuth } = whatsapp;

class WAClient {
    constructor(clientName) {
        this.clientInstanceName = clientName

        const authLocal = new LocalAuth({
            clientId: this.clientInstanceName,
            dataPath: process.cwd() + "storage/whatsapp/local_auth/"
        })

        this.instance = new Client({
            authStrategy: authLocal,
            puppeteer: {
                args: ['--no-sandbox'],
                headless: false
            }
        })
    }

    get clientName() {
        return this.clientInstanceName;
    }

    injectEventListener() {
        this.instance.on('qr', async (qr) => {
            // MENGUBAH QRCODE MENJADI DATA URL BASE64
            console.log('')
            qrcode.generate(qr, { small: true })
            console.log('update state qr')
            console.log('')
        });

        this.instance.on('ready', async () => {
            // UPDATE QRCODE PADA TABLE CLIENTS DATABASE
            console.log('')
            console.log('update state ready')
            console.log('')
        });
    }

    async init() {
        this.injectEventListener()
        await this.instance.initialize()
    }
}
class ClientManager {
    constructor() {
        this.clients = []
    }

    createClient = async (clientName, id) => {

        // MEMBUAT OBJECT CLIENT
        const client = new Client({
            authStrategy: new LocalAuth({
                clientId: clientName,
                dataPath: "./local_auth/"
            }),
            puppeteer: {
                args: ['--no-sandbox'],
                headless: false
            }
        });

        client.on('qr', async (qr) => {

            // MENGUBAH QRCODE MENJADI DATA URL BASE64
            const qrCodeURL = await qrcode.toDataURL(qr);

            // UPDATE QRCODE PADA TABLE CLIENTS DATABASE
            await prismaClient.client.update({
                data: {
                    state: "ON QRCODE",
                    qr_code: qrCodeURL
                },
                where: {
                    id: id
                }
            });
        });

        client.on('ready', async () => {
            // UPDATE QRCODE PADA TABLE CLIENTS DATABASE
            await prismaClient.client.update({
                data: {
                    state: "READY",
                    qr_code: null
                },
                where: {
                    id: id
                }
            });
        });

        const clientData = {
            name: clientName,
            client: client
        }

        this.clients.push(clientData);

        return client;
    }
}



export {
    ClientManager, WAClient
}