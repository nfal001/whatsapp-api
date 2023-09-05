import clientService from "../service/client.service.js";

/**
 * @type {import("express").RequestHandler} 
 */
const createNewClient = async (req, res, next) => {
    try {
        const username = req.user.username;
        const request = req.body;

        const result = await clientService.createClient(request, username);

        res.status(200).json({
            status: true,
            data: result
        });
    } catch (e) {
        next(e);
    }
}

/**
 * @type {import("express").RequestHandler} 
 */
const initializeClient = async (req, res, next) => {
    try {
        const username = req.user.username;
        const request = req.body;

        const name = WAClientInstanceManager[req.body.client_name].clientName
        const result = { username: username, client_name: request.client_name };

        /**
         * tidak perlu await, karena sepengetahuan saya, initialize tidak resolve sampai state QR code tercapai
         * cukup send response initialized
         */

        /*
            initializeClientInstance menerima 2 parameter yaitu user yang login dan object request
        */
        clientService.initializeClientInstance(request, username);

        res.status(200).json({
            status: true,
            message: `wa-client ${name} initialized`,
            data: result
        });
    } catch (e) {
        next(e);
    }
}

/**
 * @description thit routes was used to Get QR Code from initialized client thats on 'QR' State
 * @type {import("express").RequestHandler} 
 */
const getQRCode = async (req, res, next) => {
    try {
        const username = req.user.username;
        const requestQuery = req.query;

        // - prisma get client latest_qr_code
        // clients.latest_qr_code (type dataurl) to Buffer or dataUrl
        // const result = getqr

        // TODO
        if (requestQuery.json) {
            res.status(200).json({
                status: true,
                message: `Success`,
                data: {
                    type: 'dataUrl',
                    imageData: 'data'
                }
                // data: result
            });
        } else {
            // response decoded dataurl data image to buffer,
            // res.end()
        }

    } catch (error) {
        next(error)
    }
}

/**
 * @type {import("express").RequestHandler} 
 */
const getClientState = async (req, res, next) => {
    try {

        const result = await clientService.getInstanceState(req.body.client_name)

        res.status(200).json({
            status: true,
            data: result
        });
    } catch (error) {
        next(e)
    }
}

/**
 * @type {import("express").RequestHandler} 
 */
const getClientByName = async (req, res, next) => {
    try {
        const username = req.user.username;
        const request = {
            client_name: req.params.client_name
        };

        const result = await clientService.getClientByName(request, username);
        res.status(200).json({
            status: true,
            data: result
        });
    } catch (e) {
        next(e);
    }
}

/**
 * @type {import("express").RequestHandler} 
 */
const getAllClient = async (req, res, next) => {

    try {
        const username = req.user.username;

        const result = await clientService.getAllClient(username);
        res.status(200).json({
            status: true,
            data: result
        });
    } catch (e) {
        next(e);
    }
}

/**
 * @type {import("express").RequestHandler} 
 */
const sendMessage = async (req, res, next) => {
    try {
        const username = req.user.username;
        const request = req.body;

        const result = await clientService.sendMessage(request, username);
        res.status(200).json({
            status: true,
            data: result
        });
    } catch (e) {
        next(e);
    }
}

/**
 * @type {import("express").RequestHandler} 
 */
const sendMedia = async (req, res, next) => {
    try {
        const username = req.user.username;
        const request = req.body;

        // TODO: MEMANGGIL SERVICE CLIENT SEND MEDIA

        // RESPONSE
        res.status(200).json({
            status: true,
            data: result
        });
    } catch (e) {
        next(e);
    }
}

/**
 * @type {import("express").RequestHandler} 
 */
const sendButton = async (req, res, next) => {
    try {
        const username = req.user.username;
        const request = req.body;

        // TODO: MEMANGGIL SERVICE CLIENT SEND BUTTON

        // RESPONSE
        res.status(200).json({
            status: true,
            data: result
        });
    } catch (e) {
        next(e);
    }
}

/**
 * @type {import("express").RequestHandler} 
 */
const setClientStatus = async (req, res, next) => {
    try {
        const username = req.user.username;
        const request = req.body;

        // TODO: MEMANGGIL SERVICE CLIENT SET STATUS
        // re - naufal : sudah ada fitur built in nya di WAClient, method yang digunakan adalah setStatus(string)

        // RESPONSE
        res.status(200).json({
            status: true,
            data: result
        });
    } catch (e) {
        next(e);
    }
}

/**
 * @type {import("express").RequestHandler} 
 */
const getUserPicture = async (req, res, next) => {
    try {
        const username = req.user.username;
        const request = req.body;

        // TODO: MEMANGGIL SERVICE CLIENT GET USER PICTURE

        // RESPONSE
        res.status(200).json({
            status: true,
            data: result
        });
    } catch (e) {
        next(e);
    }
}

export default {
    createNewClient,
    getClientByName,
    getAllClient,
    sendMessage,
    initializeClient,
    getUserPicture,
    sendMedia,
    sendButton,
    setClientStatus,
    getClientState,
    getQRCode
}