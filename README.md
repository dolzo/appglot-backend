# Backend para AppGlot Translate

## Requisitos previos

-   Node.js v20.14.0 o superior
-   npm v10.7.0 o superior
-   Mongodb v7.0.11 o superior

## Instalación

1. Clonar el repositorio:
    ```bash
    git clone https://github.com/LeDolz/appglot
    ```
2. Navegar al directorio del proyecto:
    ```
    cd appglot
    ```
3. Instalar las dependencias:
    ```
    npm install
    ```

## Rutas y endpoints

### Usuarios

#### `POST /api/user/register`

Se registra un nuevo usuario

Request:

```
{
    name: nombre,
    surname: apellido,
    email: email.email.com
    password: Password1
}
```

Response:

```
{
    "status": "ok",
    "message": "Usuario guardado exitosamente",
    "user": {
        "name": "nombre",
        "surname": "apellido",
        "email": "email@email.com",
        "password": "$2b$10$n/wHl2me1MQrFFLx/kdwGetwt0kiyTGZ3sC5FGSFdV9KQPo5HKc..",
        "_id": "66830c3af94509eeb3c0fa76",
        "created_at": "2024-07-01T20:06:18.770Z",
        "__v": 0
    }
}
```

#### `POST /api/user/login`

Se inicia sesión con las credenciales de un usuario registrado

Request:

```
{
    email:email@email.com
    password:Password1
}
```

Response:

```
{
    "status": "ok",
    "message": "Login exitoso",
    "user": {
        "_id": "66830c3af94509eeb3c0fa76",
        "name": "nombre",
        "surname": "apellido",
        "email": "email@email.com",
        "password": "$2b$10$n/wHl2me1MQrFFLx/kdwGetwt0kiyTGZ3sC5FGSFdV9KQPo5HKc..",
        "created_at": "2024-07-01T20:06:18.770Z",
        "__v": 0
    },
    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpZCI6IjY2ODMwYzNhZjk0NTA5ZWViM2MwZmE3NiIsIm5hbWUiOiJub21icmUiLCJzdXJuYW1lIjoiYXBlbGxpZG8iLCJlbWFpbCI6ImVtYWlsQGVtYWlsLmNvbSIsImlhdCI6MTcxOTg2NDU0NywiZXhwIjoxNzM1NzU4NTQ3fQ.s5uGm1Q3aW_c7fwz-KB4SyBcod66kbzcCx31BEt8AqU"
}
```

#### `GET /api/user/get-user/:email`

Se obtiene la información de un usuario mediante su email

Request:

`localhost:7734/api/user/get-user/email@email.com`

Response:

```
{
    "status": "ok",
    "userFound": {
        "_id": "66830c3af94509eeb3c0fa76",
        "name": "nombre",
        "surname": "apellido",
        "email": "email@email.com",
        "created_at": "2024-07-01T20:06:18.770Z",
        "__v": 0
    }
}
```

### Traducción de texto

#### `POST /api/translate/translate-text/:lang/:text`

Se traduce un texto `:text` al idioma seleccionado `:lang`

##### Headers

-   Authorization: Token de autenticación

Request: `/api/translate/translate-text/es/Welcome to black space`

Response:

```
{
    "status": "ok",
    "message": "Texto traducido",
    "res": "Bienvenido al espacio negro"
}
```

### Traducción de archivos

#### `POST /api/file/upload-file`

Se sube un archivo a s3 para poder trabajar con el

##### Headers

-   Authorization: Token de autenticación

Request:

```
{
    "file0": form-data
}
```

Response:

```

```
