const DEBUG = process.env.DEBUG === 'true' ? true : false
const PORT = process.env.APP_PORT || 8080

const config = {
    app: {
        DebugMode: DEBUG,
        port: PORT
    }
}
export default config 