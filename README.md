# Backend para AppGlot Translate

## Requisitos previos

-   Node.js v20.14.0 o superior
-   npm v10.7.0 o superior
-   Mongodb v7.0.11 o superior

## Instalación

1. Clonar el repositorio:
    ```bash
    git clone https://github.com/dolzo/appglot
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

#### `POST /api/user/register/`

Se registra un nuevo usuario

Request:

```
{
    name: nombre,
    surname: apellido,
    email: email@email.com,
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

#### `POST /api/user/login/`

Se inicia sesión con las credenciales de un usuario registrado

Request:

```
{
    email:email@email.com,
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

#### `POST /api/user/get-user/`

Se obtiene la información de un usuario mediante su email

Request:

```
{
    email:calopez@email.com
}
```

Response:

```
{
    "status": "ok",
    "userFound": {
        "_id": "6685974623c8d3b9456f28b0",
        "name": "Carlos",
        "surname": "Lopez",
        "email": "calopez@email.com",
        "created_at": "2024-07-03T18:24:06.259Z",
        "__v": 0
    }
}
```

#### `PUT /api/user/update-user/`

Se actualizan los datos de un usuario registrado

Request:

```
{
    name: Bastian,
    surname: Lopez,
    email: calopez1@email.com,
    password: Meme1234
}
```

Response:

```
{
    "status": "ok",
    "message": "Usuario actualizado",
    "user": {
        "_id": "66830c3af94509eeb3c0fa76",
        "name": "Bastian",
        "surname": "Lopez",
        "email": "calopez1@email.com",
        "created_at": "2024-07-01T20:06:18.770Z",
        "__v": 0
    }
}
```

### Traducción de texto

#### `POST /api/translate/translate-text/`

Se traduce un texto `text` al idioma seleccionado `lang`. Esta funcionalidad no requiere un authentication token.

Request:

```
{
    "text": "Welcome to the black space",
    "lang": "es"
}
```

Response:

```
{
    "status": "ok",
    "message": "Texto traducido",
    "res": "Bienvenido al espacio negro"
}
```

### Traducción de archivos

#### `POST /api/file/upload-file/`

Se sube un archivo a s3 para poder trabajar con el

##### Headers

-   Authorization: JSON web token
-   Content-Type: multipart/form-data

Request:

```
{
    "file0": omori album.jpeg
}
```

Response:

```
{
    "status": "ok",
    "message": "Archivo subido",
    "file": {
        "fileName": "poem1-1719922242617.png",
        "fileUrl": "https://appglotnodejs.s3.amazonaws.com/poem1-1719922242617.png",
        "_id": "6683ee43216b5f84732274e5",
        "created_at": "2024-07-02T12:10:43.266Z",
        "__v": 0
    }
}
```

#### `POST /api/file/translate-file/:lang/:filename/`

Se traduce el archivo con nombre `fileName` devuelto por la ruta de subida al lenguaje `lang` especificado

##### Headers

-   Authorization: Token de autenticación

Request:

```
api/file/translate-file/es/poem1-1719922242617.png
```

Response:

```
{
    "status": "ok",
    "message": "Archivo traducido exitosamente",
    "res": "De quién son estos bosques, creo que lo sé.\nAunque su casa está en el pueblo;\n\nÉl no me verá parar aquí.\n\nVer sus bosques llenarse de nieve."
}
```

## Manejo de errores

Se detallan algunos codigos de errores que se usan en este backend:

-   `200`: La solicitud se realizó con éxito
-   `400`: La solicitud es incorrecta o no está bien formada
-   `401`: La autorización ha fallado
-   `404`: La solicitud carece de algunos parámetros
-   `500`: El servidor no pudo realizar la petición

## Autenticación

Este backend utiliza JWT como medio de autenticación, es por ello que para las solicitudes que requieran una cabecera de autorización, se debe añadir dicha cabecera y colocar en ella el token entregado por el endpoint `/api/user/login/`.

## Soporte

En caso de cualquier duda contactarse al siguiente mail: `degolxz01@gmail.com`.
