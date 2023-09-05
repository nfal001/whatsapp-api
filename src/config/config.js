const DEBUG = process.env.DEBUG === 'true' ? true : false
const PORT = process.env.APP_PORT || 8080
const APP_ENV = process.env.APP_ENV || 'development'
const LOCAL_AUTH = process.env.LOCAL_AUTH || process.cwd() + '/storage/whatsapp/local_auth/'

const config = {
    app: {
        env: APP_ENV,
        DebugMode: DEBUG,
        port: PORT,
        localAuth: LOCAL_AUTH
    },
    bot: {
        prefix: 'w!',
        command: {
            ping: 'ping',
            timeNow: 'now'
        }
    }
}
export default config 