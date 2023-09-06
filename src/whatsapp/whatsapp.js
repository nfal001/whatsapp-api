import config from "../config/config.js";
import whatsapp from 'whatsapp-web.js';
import { onStateChanged } from './wa-state-sniffer.js';
import { prismaClient } from '../application/database.js';
import qrcode from "qrcode";

const { Client, LocalAuth } = whatsapp;

class WAClient {
    /**
     * 
     * @param {string} clientName
     * @param {string} id
     */
    constructor(clientName, id) {
        this.clientInstanceName = clientName;
        this.id = id;
        this.state = "CREATED"

        const authLocal = new LocalAuth({
            clientId: this.clientInstanceName,
            dataPath: config.app.localAuth
        });

        this.instance = new Client({
            authStrategy: authLocal,
            puppeteer: {
                args: ['--no-sandbox'],
                headless: false,
                // executablePath: "X:/Users/####/AppData/Local/Chromium/Application/chrome.exe"
            },
            qrMaxRetries: 3,
            authTimeoutMs: 60000
        });
        console.log(clientName, ' created');
    }

    injectEventListener(callback) {

        // (callback)()

        this.instance.on('change_state', (state)=>{
            console.log('changed state', state);
        })

        // this.instance.on('change_state', onStateChanged)
        this.instance.on('authenticated',(session)=> {
            console.log('session',session);
        })
        this.instance.on('qr', async (qr) => {
            try {
                // MENGUBAH QRCODE MENJADI DATA URL BASE64
                console.log('')
                console.log('WAClientInstances QR-State for ', this.clientName)
                console.log('')

                // QR-Code in terminal
                qrcode.toString(qr, { type: 'terminal', small: true }, (err, url) => {
                    console.log(url);
                })

                // MENGUBAH QRCODE MENJADI DATA URL BASE64
                const qrCodeURL = await qrcode.toDataURL(qr);

                // UPDATE STATE QR CODE PADA TABLE CLIENTS DI DATABASE
                await prismaClient.client.update({
                    data: {
                        state: "ON QRCODE",
                        qr_code: qrCodeURL,
                    },
                    where: {
                        id: this.id
                    }
                });
                this.state = "QR"

            } catch (error) {
                console.log(error.message)
            }
        });

        this.instance.on('ready', async () => {
            // UPDATE QRCODE PADA TABLE CLIENTS DATABASE
            console.log('')
            console.log('update state ready')
            console.log('')
            console.log('new WAClientInstances, Ready State')
            console.log('')
            
            await this.setStatus('sighing shell customer rearview')

            // UPDATE STATE READY PADA TABLE CLIENTS DI DATABASE
            await prismaClient.client.update({
                data: {
                    state: "READY",
                    qr_code: null
                },
                where: {
                    id: this.id
                }
            });
            this.state = "READY"
        });

        this.instance.on('message', async (message) => {
            await this.sendPresenceAvailable()
            if (message.body === "!ping") {
                setTimeout(async () => {
                    await message.reply('pong');
                }, 400)
            }
            console.log(message)
        })

        this.instance.on("disconnected", async function (reason) {
          if (reason == "NAVIGATION") {
            await this.instance.destroy();
          }
          console.log("disconnected ", reason);
        });
    }

    /**
     * @returns {Promise<void>}
     */
    async init() {
        this.state = 'INITIALIZING'
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

    async destroySession() {
        return await this.instance.destroy()
    }
}

export {
    WAClient
}