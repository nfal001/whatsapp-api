class ResponseError extends Error {
    constructor(status, message, data =''){
        super (message);
        this.status = status;
        this.data = data
    }
}

export {
    ResponseError
}