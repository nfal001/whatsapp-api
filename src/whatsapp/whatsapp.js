import config from "../config/config.js";
import whatsapp from 'whatsapp-web.js';
import { prismaClient } from '../application/database.js';
import qrcode from "qrcode";

const { Client, LocalAuth } = whatsapp;

class WAClient {
    constructor(clientName, id) {
        this.clientInstanceName = clientName;
        this.id = id;

        const authLocal = new LocalAuth({
            clientId: this.clientInstanceName,
            dataPath: process.cwd() + config.app.localAuth
        });

        this.instance = new Client({
            authStrategy: authLocal,
            puppeteer: {
                args: ['--no-sandbox'],
                headless: false
            }
        });
    }

    get clientName() {
        return this.clientInstanceName;
    }

    injectEventListener() {
        this.instance.on('qr', async (qr) => {
            // MENGUBAH QRCODE MENJADI DATA URL BASE64
            const qrCodeURL = await qrcode.toDataURL(qr);
            
            // UPDATE STATE QR CODE PADA TABLE CLIENTS DI DATABASE
            await prismaClient.client.update({
                data: {
                    state: "ON QRCODE",
                    qr_code: qrCodeURL
                },
                where: {
                    id: this.id
                }
            });
        });

        this.instance.on('ready', async () => {
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
        });
    }

    async init() {
        this.injectEventListener()
        await this.instance.initialize()
    }
}

export {
    WAClient
}