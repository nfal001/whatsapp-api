import whatsapp from 'whatsapp-web.js';
import { prismaClient } from '../application/database.js';
import qrcode from 'qrcode';

const { Client, LocalAuth } = whatsapp;


class ClientManager {
    constructor (){
        this.clients = {}
    }

    createClient = async (clientName) => {

        // MEMBUAT OBJECT CLIENT
        const client = new Client({
            authStrategy: new LocalAuth({
                clientId: clientName,
                dataPath: "../../local_auth/"
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
                    client_name: clientName
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
                    client_name: clientName
                }
            });
        });

        this.clients[clientName] = client;

        return client;
    }
}



export {
    ClientManager
}