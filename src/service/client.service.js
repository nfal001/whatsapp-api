import { prismaClient } from "../application/database.js";
import { createClientValidation } from "../validation/client.validation.js";
import { ResponseError } from "../error/response-error.js";
import { getUserValidation } from "../validation/user.validation.js";
import { validate } from "../validation/validation.js";
import { ClientManager } from "../whatsapp/whatsapp.js";


const clientManager = new ClientManager();

async function addNewClient(clientName, id) {

    const client = await clientManager.createClient(clientName, id);
    client.initialize();

}

const createClient = async (request, username) => {

    // VALIDASI CURRENT USERNAME DAN REQUEST
    username = validate(getUserValidation, username);
    const client = validate(createClientValidation, request);

    // PENGECEKAN NAMA CLIENT DI TABLE CLIENT YANG DIMILIKI CURRENT USERNAME
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

    // JIKA TERDAPAT CLIENT YANG SAMA DI USERNAME TERSEBUT, MAKA AKAN MELEMPARKAN ERROR BARU
    if (countClient === 1) {
        throw new ResponseError(400, "clientname already exists");
    }

    // MENAMBAHKAN DATA CLIENT DI TABEL CLIENTS DATABASE
    const id = await prismaClient.client.create({
        data: {
            client_name: client.client_name,
            username: username,
            state: "ON CREATE"
        },
        select: {
            id: true
        }
    });

    // AKAN MENJALANKAN FUNCTION UNTUK MEMBUAT CLIENT BARU
    await addNewClient(client.client_name, id.id);

    // MENGEMBALIKAN DATA CLIENT YANG TELAH DIBUAT DARI DATABASE
    return prismaClient.client.findFirst({
        where: {
            client_name: client.client_name
        }
    });
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

    if (count === 0){
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


export default {
    createClient,
    getClientByName,
    getAllClient
}