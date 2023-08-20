# Whatsapp Client API Spec

## Create Whatsapp Client API

Endpoint: POST /api/clients

Headers:
- Authorization: token

Request Body:

```json
{
    "client_name" : "primaryClient"
}
```
Response Body Success:

```json
{
    "status": true,
    "data": {
        "id": 1,
        "client_name": "primaryClient"
    }
}
```

Response Body Error:

```json
{
    "status": false,
    "error": "Client name already created"
}
```

## Update Client Whatsapp API

Endpoint: PUT /api/clients/:id

Headers:
- Authorization: token

Request Body:

```json
{
    "client_name" : "primaryClient"
}
```
Response Body Success:

```json
{
    "status": true,
    "data": {
        "id": 1,
        "client_name": "primaryClient"
    }
}

Response Body Error:

```json
{
    "status": false,
    "error": "Client name already created"
}
```
## Get QR-Code API

Headers:
- Authorization: token

Request Body:

```json
{
    "client_name": "primaryClient"
}
```

Response Body Success:

```json
{
    "status": true,
    "data": {
        "qr_code": "qrcode data"
    }
}
```

Response Body Errror:

```json
{
    "status": false,
    "error": "Client name not found"
}
```

## Send Messsage API

Headers:
- Authorization: token

Request Body:

```json
{
    "client_name": "primaryClient",
    "phone_number": "6281xxx",
    "message": "text message"
}
```

Response Body Success:

```json
{
    "status": true,
    "data": {
        "client_name": "primaryClient",
        "phone_number": "6281xxx",
        "message": "text message"
    }
}
```

Response Body Error:

```json
{
    "status": false,
    "error": "Client name not found"
}
```