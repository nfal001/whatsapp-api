import { createClientValidation } from "../validation/client.validation.js";
import { getUserValidation } from "../validation/user.validation.js";
import { validate } from "../validation/validation.js";
import { ClientManager } from "../whatsapp/whatsapp.js";


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

function addNewClient(clientName) {

    const client = clientManager.createClient(clientName);

    client.initialize();
}

const createClient = async (request, username) => {
    username = validate(getUserValidation, username);
    const client = validate(createClientValidation, request);

    const countClient = await prismaClient.client.count({
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

    if (countClient === 1) {
        throw new ResponseError(400, "username already exists");
    }

    addNewClient(client.client_name);

    

    

}

export default {
    createClient
}