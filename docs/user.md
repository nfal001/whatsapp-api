# User API Spec

## Register User API

Endpoint: POST /api/users

Request Body:

```json
{
    "username":"john",
    "password":"secret",
    "name":"John Doe"
}
```

Response Body Success:

```json
{
    "status":true,
    "data": {
        "username":"john",
        "name":"John Doe"
    }
}
```

Response Body Error:

```json
{
    "status":false,
    "errors": "Username already registered"
}
```

## Login User API

Endpoint: POST api/users/login

Request Body:

```json
{
    "username":"john",
    "password":"rahasia"
}
```

Response Body Success:

```json
{
    "status": true,
    "data": {
        "token": "unique-token"
    }
}
```

Response Body Error:

```json
{
    "status": false,
    "errors": "Username or password wrong"
}
```
## Update User API

Endpoint: POST api/users/current

Headers:
- Authorization : token

Request Body:

```json
{
    "name":"Lorem Ipsum", // optional
    "password":"new password" //optional
}
```
Response Body Success:

```json
{
    "status":true,
    "data": {
        "username":"john",
        "name":"Lorem Ipsum"
    }
}
```
Response Body Error:

```json
{
    "status": false,
    "errors": "Name length max 255"
}
```
## Get User API

Endpoint: GET api/users/current

Headers:
- Authorization : token

Response Body Success :

```json
{
    "status": true,
    "data": {
        "username":"john",
        "name":"Lorem Ipsum"
    }
}
```
Response Body Error :

```json
{
    "status": false,
    "errors": "Unauthorized"
}
```

## Logout User API

Endpoint: DELETE /api/users/logout

Headers:
- Authorization : token

Response Body Success:

```json
{
    "status": true,
    "data": "OK"
}
```

Response Body Error :

```json
{
    "status": false,
    "errors": "Unauthorized"
}
```