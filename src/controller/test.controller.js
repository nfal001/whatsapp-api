/**
 * 
 * @param {import("express").Request} _req 
 * @param {import("express").Response} res 
 * @param {import("express").NextFunction} next 
 */
const securityTest = (_req, res, next) => {
    console.log('habis ini stop')
    res.end('oke', 'ascii')
    console.log('eh malah lanjut')
}
export default {
    securityTest
}