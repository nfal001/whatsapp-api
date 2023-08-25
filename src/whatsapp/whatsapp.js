import whatsapp from 'whatsapp-web.js';
import { prismaClient } from '../application/database.js';
import qrcode from 'qrcode-terminal';

const { Client, LocalAuth } = whatsapp;

class WAClient {

    /**
     * 
     * @param {string} clientName
     */
    constructor(clientName) {
        this.clientInstanceName = clientName

        const authLocal = new LocalAuth({
            clientId: this.clientInstanceName,
            dataPath: process.cwd() + "/storage/whatsapp/local_auth/",
        })

        this.instance = new Client({
            authStrategy: authLocal,
            puppeteer: {
                args: ['--no-sandbox'],
                headless: false,
                // executablePath: "X:/Users/####/AppData/Local/Chromium/Application/chrome.exe"
            }
        })
    }

    injectEventListener(callback) {

        /**
         * 
         * pada method injectEventListener ini,
         * kita bisa menambah sesuatu semau kita dengan memanfaatkan callback ,
         * 
         * plan:
         * 
         * injectEventListener((callback) => {
         * 
         *      this.instance.on('qr', async (qr) => {
         *       try {
         *           // MENGUBAH QRCODE MENJADI DATA URL BASE64
         *           console.log('')
         *           qrcode.generate(qr, { small: true })
         *           console.log('update state qr')
         *           console.log('')
         *           console.log(WAClientInstanceManager[this.clientInstanceName])
         *           console.log('')
         *       
         *       } catch (error) {
         *           console.log(error.message)
         *       }
         *  });
         * 
         * })
         * 
         */
        this.instance.on('qr', async (qr) => {
            try {
                // MENGUBAH QRCODE MENJADI DATA URL BASE64
                console.log('')
                qrcode.generate(qr, { small: true })
                console.log('update state qr')
                console.log('')
                console.log(WAClientInstanceManager[this.clientInstanceName])
                console.log('')

            } catch (error) {
                console.log(error.message)
            }
        });

        this.instance.on('ready', async () => {
            // UPDATE QRCODE PADA TABLE CLIENTS DATABASE
            console.log('')
            console.log('update state ready')
            console.log('')

            await this.setStatus('sighing shell customer rearview')
        });

        this.instance.on('message', async (message) => {
            await this.instance.sendPresenceAvailable()
            if (message.body === "!ping") {
                setTimeout(async () => {
                    await message.reply('pong');
                }, 400)
            }
            console.log(message)
        })
    }

    /**
     * @returns {Promise<void>}
     */
    async init() {
        this.injectEventListener()
        return await this.instance.initialize()
    }

    get clientName() {
        return this.clientInstanceName;
    }

    /**
     * 
     * @param {string} name 
     * @returns {Promise<boolean>}
     */
    async setDisplayName(name) {
        return await this.instance.setDisplayName(name)
    }

    /**
     * 
     * @param {string} string 
     * @returns {Promise<void>}
     */
    async setStatus(string) {
        return await this.instance.setStatus(string)
    }

    /**
     * 
     * @returns {Promise<whatsapp.WAState>}
     */
    async getState() {
        return await this.instance.getState()
    }

    /**
     * 
     * @returns {Promise<void>}
     */
    async sendPresenceAvailable() {
        return await this.instance.sendPresenceAvailable()
    }

    /**
     * 
     * @param {string} chatId 
     * @param {whatsapp.MessageContent} content 
     * @param {whatsapp.MessageSendOptions} options 
     * @returns {Promise<whatsapp.Message>}
     */
    async sendMessage(chatId, content, options) {
        return await this.instance.sendMessage(chatId, content, options)
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