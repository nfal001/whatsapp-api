const DEBUG = process.env.DEBUG === 'true' ? true : false
const PORT = process.env.APP_PORT || 8080
const APP_ENV = process.env.APP_ENV || 'development'
const config = {
    app: {
        env: APP_ENV,
        DebugMode: DEBUG,
        port: PORT
    }
}
export default config 