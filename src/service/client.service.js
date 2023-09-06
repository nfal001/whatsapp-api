import { prismaClient } from "../application/database.js";
import { createClientValidation, sendMessageValidation } from "../validation/client.validation.js";
import { ResponseError } from "../error/response-error.js";
import { getUserValidation } from "../validation/user.validation.js";
import { validate } from "../validation/validation.js";
import { WAClient } from "../whatsapp/whatsapp.js";
import { parse, stringify } from 'flatted';

const createClient = async (request, username) => {

    // VALIDASI CURRENT USERNAME DAN REQUEST BODY
    username = validate(getUserValidation, username);
    const client = validate(createClientValidation, request);

    // const client = request

    // MENGAMBIL NILAI CLIENT NAME DARI REQUEST
    const clientName = client.client_name;

    // PENGECEKAN NAMA CLIENT DI TABLE CLIENT YANG DIMILIKI CURRENT USERNAME
    const countClient = await prismaClient.client.count({
        where: {
            AND: [
                {
                    username: username
                },
                {
                    client_name: clientName
                }
            ]
        }
    });

    if (countClient === 1) {
        const clientIdAndState = await prismaClient.client.findFirst({
            where: {
                AND: [
                    {
                        username: username
                    },
                    {
                        client_name: clientName
                    }
                ]
            },
            select: {
                id: true,
                state: true
            }
        });

        console.log(clientIdAndState.id);

        if (clientIdAndState.state === "READY") {
            if (WAClientInstanceManager[clientName]) {
                throw new ResponseError(400, "client is running");
            }
            const uName = await addNewClient(clientName, clientIdAndState.id);

            const parseUName = parse(uName);

            const result = parseUName.instance.options.authStrategy.clientId;

            return {
                message: "Client created",
                client_name: result
            };
        }

        if (WAClientInstanceManager[clientName]) {
            throw new ResponseError(400, "clientname is already exists");
        }

        const uName = await addNewClient(clientName, clientIdAndState.id);
        const parseUName = parse(uName);

        const result = parseUName.instance.options.authStrategy.clientId;

        return {
            message: "Client created",
            client_name: result
        };
    }

    const clientID = await prismaClient.client.create({
        data: {
            client_name: client.client_name,
            username: username,
            state: "ON CREATE"
        },
        select: {
            id: true
        }
    });

    // uName boleh diganti namanya yang lebih cocok sebagai representasi

    // MEMANGGIL FUNCTION ADDNEWCLIENT UNTUK MEMBUAT CLIENT
    const uName = await addNewClient(clientName, clientID.id);

    const parseUName = parse(uName);

    const result = parseUName.instance.options.authStrategy.clientId;

    return {
        message: "Client created",
        client_name: result
    };
}

// FUNCTION UNTUK MENAMBAHKAN CLIENT
async function addNewClient(clientName, id) {

    const clientWA = new WAClient(clientName, id);

    WAClientInstanceManager[clientName] = clientWA;

    return stringify(WAClientInstanceManager[clientName]);
}

const initializeClientInstance = async (requestClientName, username) => {

    // VALIDASI REQUEST BODY
    username = validate(getUserValidation, username);
    const client = validate(createClientValidation, requestClientName);

    // const client = { client_name: requestClientName }

    console.log(client)
    if (WAClientInstanceManager[client.client_name]) {
        WAClientInstanceManager[client.client_name].init();
    } else {
        throw new ResponseError(400, "clientname is not found");
    }
    
    return {
        message: `${client.client_name} initialized`
    }
}

const getWAInstanceQRCode = async (username,clientName) => {
    const result = await prismaClient.client.findFirst({
        where:{
            AND:[
                {
                    username: username
                },
                {
                    client_name: clientName
                },
                {
                    state: 'ON QRCODE'
                }
            ]
        },
    })
    return result
}

/**
 * 
 * @param {string} clientName 
 * @returns {Promise<any>}
 */
const getInstanceState = async (clientName) => {
    return await WAClientInstanceManager[clientName].getState();
}

const getClientByName = async (request, username) => {
    // VALIDASI CURRENT USERNAME DAN REQUEST
    username = validate(getUserValidation, username);
    const client = validate(createClientValidation, request);

    // PENGECEKAN NAMA CLIENT DI TABLE CLIENTS DATABASE
    const count = await prismaClient.client.count({
        where: {
            AND: [
                {
                    username: username
                },
                {
                    client_name: client.client_name
                }
            ]
        }
    });

    if (count === 0) {
        throw new ResponseError(400, "clientname is not found");
    }

    return prismaClient.client.findFirst({
        where: {
            AND: [
                {
                    username: username
                },
                {
                    client_name: client.client_name
                }
            ]
        }
    });
}

const getAllClient = async (username) => {

    username = validate(getUserValidation, username);

    return prismaClient.client.findMany({
        where: {
            username: username
        },
        select: {
            id: true,
            client_name: true,
            state: true,
            foward: true,
            username: true
        }
    });
}

const sendMessage = async (request, username) => {
    username = validate(getUserValidation, username);
    request = validate(sendMessageValidation, request);

    await sendTextMessage(request.client_name, `${request.target_number}@c.us`, request.text_message);


    return {
        from: request.client_name,
        target_number: request.target_number,
        text_message: request.text_message
    }

}

// FUNCTION UNTUK SEND MESSAGE
async function sendTextMessage(clientName, targetNumber, textMessage) {

    if (clientName) {
        WAClientInstanceManager[clientName].sendMessage(
          targetNumber,
          textMessage
        );
    } else {
        throw new ResponseError(400, "client is not found");
    }
}

async function destroySession(clientName,username) {
    const destroyWAClient = await WAClientInstanceManager[clientName].destroySession()
    console.log(destroySession);
    const clientDbState = prismaClient.client.delete({
        where: {
            AND:[
                {
                    username: username,
                }
                ,{
                    client_name: clientName
                }
            ]
        }
    })
    console.log(clientDbState);
    return destroyWAClient
}


export default {
  createClient,
  initializeClientInstance,
  getClientByName,
  getAllClient,
  sendMessage,
  getInstanceState,
  getWAInstanceQRCode,
  destroySession
};