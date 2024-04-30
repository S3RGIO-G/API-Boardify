## TABLEROS
### Atributos:
- `id` **_string_** Identificador del tablero.
- `idUser` **_string_** Identificador del usuario propietario del tablero.
- `name` **_string_** Nombre del tablero.
- `created` **_timestamp_** Fecha de la creación del tablero.
- `updated` **_timestamp_** Fecha de la última modificación del tablero.
- `fav` **_boolean_** Marca si el tablero es favorito.

### Enpoints:
#### OBTENER TABLEROS
```
GET  https://api-boardify.vercel.app/boards
```
**Parámetros de consulta**
- `name`
- `idUser`

**EJEMPLO RESPUESTA**<br>
```
HTTP 200 OK
Content-Type: application/json

[
  {
    "id": "66315713a7425dd204e4e730",
    "idUser": "661b1427dc8c1fd2e9088917",
    "name": "Tablero",
    "created": 1714509587762,
    "updated": 1714509587762,
    "fav": false,
  },
  ...
]
```
<hr>

#### OBTENER TABLERO
```
GET  https://api-boardify.vercel.app/boards/:id
```
**EJEMPLO RESPUESTA**<br>
```
HTTP 200 OK
Content-Type: application/json

{
  "id": "66315713a7425dd204e4e730",
  "idUser": "661b1427dc8c1fd2e9088917",
  "name": "Tablero",
  "created": 1714509587762,
  "updated": 1714509587762,
  "fav": false,
}
```
<hr>

#### CREAR TABLERO
```
POST  https://api-boardify.vercel.app/boards
```
**Body:**
```
{
  "name": "Tablero Nuevo",
  "idUser": "661b1427dc8c1fd2e9088917",
  "created": 1714512990719,
  "updated": 1714512990719,
  "fav": false
}
```
**EJEMPLO RESPUESTA**<br>
```
HTTP 200 OK
Content-Type: application/json

{
  "id": "6631645e4f9f69fd73342108"
}
```
<hr>

#### ACTUALIZAR TABLERO
```
PUT  https://api-boardify.vercel.app/boards/:id
```
**Body:**
```
{
  "name": "Tablero Actualizado",
  "updated": 1714513441661
}
```
**EJEMPLO RESPUESTA**<br>
```
HTTP 200 OK
Content-Type: application/json

{
  "name": "Tablero Actualizado",
  "idUser": "661b1427dc8c1fd2e9088917",
  "created": 1714512990719,
  "updated": 1714513441661,
  "fav": false
}
```
<hr>

#### ELIMINAR TABLERO
```
DELETE  https://api-boardify.vercel.app/boards/:id
```
**EJEMPLO RESPUESTA**<br>
```
HTTP 200 OK
Content-Type: application/json

{
  "name": "Tablero Eliminado",
  "idUser": "661b1427dc8c1fd2e9088917",
  "created": 1714512990719,
  "updated": 1714513441661,
  "fav": false
}
```

## LISTAS
### Atributos:
- `id` **_string_** Identificador de la lista.
- `name` **_string_** Nombre de la lista.
- `position` **_number_** Posición de la lista.
- `idBoard` **_string_** Identificador del tablero contenedor de la lista.
- `idUser` **_string_** Identificador del usuario propietario de la lista.

### Endpoints:
#### OBTENER LISTAS
```
GET  https://api-boardify.vercel.app/lists
```
**Parámetros de consulta**
- `name`
- `idUser`
- `idBoard`
- `position`

**EJEMPLO RESPUESTA**<br>
```
HTTP 200 OK
Content-Type: application/json

[
  {
    "id": "66315716a7425dd204e4e731",
    "name": "Lista",
    "position": 10000,
    "idUser": "661b1427dc8c1fd2e9088917",
    "idBoard": "66315713a7425dd204e4e730"
  },
  ...
]
```
<hr>

#### OBTENER LISTA
```
GET  https://api-boardify.vercel.app/lists/:id
```
**EJEMPLO RESPUESTA**<br>
```
HTTP 200 OK
Content-Type: application/json

{
  "id": "66315716a7425dd204e4e731",
  "name": "Lista",
  "position": 10000,
  "idUser": "661b1427dc8c1fd2e9088917",
  "idBoard": "66315713a7425dd204e4e730"
}
```
<hr>

#### CREAR LISTA
```
POST  https://api-boardify.vercel.app/lists
```
**Body:**
```
{
  "name": "Nueva Lista",
  "idUser": "661b1427dc8c1fd2e9088917",
  "position": 30000,
  "idBoard": "66315713a7425dd204e4e730"
}
```
**EJEMPLO RESPUESTA**<br>
```
HTTP 200 OK
Content-Type: application/json

{
  "id": "66316e843e98cef2b9a36289",
}
```
<hr>

#### ACTUALIZAR LISTA
```
PUT  https://api-boardify.vercel.app/lists/:id
```
**Body:**
```
{
  "name": "Lista Actualizada",
}
```
**EJEMPLO RESPUESTA**<br>
```
HTTP 200 OK
Content-Type: application/json

{
  "id": "66316e843e98cef2b9a36289",
  "name": "Lista Actualizada",
  "position": 30000,
  "idUser": "661b1427dc8c1fd2e9088917",
  "idBoard": "66315713a7425dd204e4e730"
}
```
<hr>

#### ELIMINAR LISTAS
```
DELETE  https://api-boardify.vercel.app/lists
```
**Parámetros de consulta**
- `name`
- `idBoard`
- `position`

**EJEMPLO RESPUESTA**<br>
```
HTTP 200 OK
Content-Type: application/json

{
  "deleted": true,
  "counter": 2
}
```
<hr>

#### ELIMINAR LISTA
```
DELETE  https://api-boardify.vercel.app/lists/:id
```
**EJEMPLO RESPUESTA**<br>
```
HTTP 200 OK
Content-Type: application/json

{
  "id": "66316e843e98cef2b9a36289",
  "name": "Lista Eliminada",
  "position": 30000,
  "idUser": "661b1427dc8c1fd2e9088917",
  "idBoard": "66315713a7425dd204e4e730",
}
```

## TAREAS
### Atributos:
- `id` **_string_** Identificador de la tarea.
- `name` **_string_** Nombre de la tarea.
- `description` **_string_** Descripción de la tarea.
- `hasDescription` **_boolean_** Marca si la tarea tiene una descripción.
- `position` **_number_** Posición de la tarea.
- `created` **_timestamp_** Fecha de la creación de la tarea.
- `updated` **_timestamp_** Fecha de la última modificación de la tarea.
- `idList` **_string_** Identificador de la lista contenedora de la tarea.
- `idUser` **_string_** Identificador del usuario propietario de la tarea.
- `activity` **_array_** Colección de los movimientos de la tarea.
  - `from` **_string_** Identificador de la lista origen.
  - `to` **_string_** Identificador de la lista destino.
  - `time` **_timestamp_** Fecha del movimiento.

### Endpoints:
#### OBTENER TAREAS
```
GET  https://api-boardify.vercel.app/tasks
```
**Parámetros de consulta**
- `idList`
- `idUser`
- `name`
- `desc`

**EJEMPLO RESPUESTA**<br>
```
HTTP 200 OK
Content-Type: application/json

[
  {
    "id": "66259682b37c77e910d007f4",
    "name": "Doing Item 1",
    "description": "",
    "hasDescription": false,
    "position": 10000,
    "created": 1713739394747,
    "updated": 1713739394747,
    "idList": "661b14535828c6fa7d36dd1c",
    "idUser": "661b1427dc8c1fd2e9088917",
    "activity": [
      {
        "from": "661b14535828c6fa7d36dd1c",
        "to": "661b14535828c6fa7d36dd1c",
        "time": 1713739394747
      },
      ...
    ]
  },
  ...
]
```
<hr>

#### OBTENER TAREA
```
GET  https://api-boardify.vercel.app/tasks/:id
```
**EJEMPLO RESPUESTA**<br>
```
HTTP 200 OK
Content-Type: application/json

{
  "id": "66259682b37c77e910d007f4",
  "name": "Doing Item 1",
  "description": "",
  "hasDescription": false,
  "position": 10000,
  "created": 1713739394747,
  "updated": 1713739394747,
  "idList": "661b14535828c6fa7d36dd1c",
  "idUser": "661b1427dc8c1fd2e9088917",
  "activity": [
    {
      "from": "661b14535828c6fa7d36dd1c",
      "to": "661b14535828c6fa7d36dd1c",
      "time": 1713739394747
    },
    ...
  ]
}
```
<hr>

#### CREAR TAREA
```
POST  https://api-boardify.vercel.app/tasks
```
**Body:**<br>
```
{
  "name": "Tarea",
  "idList": "66315716a7425dd204e4e731",
  "idUser": "661b1427dc8c1fd2e9088917",
  "created": 1714509598530,
  "updated": 1714509598530,
  "description": "",
  "hasDescription": false,
  "position": 25000,
  "activity": [
    {
      "from": "66315716a7425dd204e4e731",
      "to": "66315716a7425dd204e4e731",
      "time": 1714509598530
    }
  ]
}
```
**EJEMPLO RESPUESTA**<br>
```
HTTP 200 OK
Content-Type: application/json

{
  "id": "6631571e034df6c35a5b924d"
}
```
<hr>

#### ACTUALIZAR TAREA 
```
PUT  https://api-boardify.vercel.app/tasks/:id
```
**Body:**<br>
```
{
  "name": "TareaModificada",
  "updated": 1714510442193
}
```
**EJEMPLO RESPUESTA**<br>
```
HTTP 200 OK
Content-Type: application/json

{
  "id": "6631571e034df6c35a5b924d",
  "name": "TareaModificada",
  "idList": "66315716a7425dd204e4e731",
  "idUser": "661b1427dc8c1fd2e9088917",
  "created": 1714509598530,
  "updated": 1714510442193,
  "description": "",
  "hasDescription": false,
  "position": 25000,
  "activity": [
    {
      "from": "66315716a7425dd204e4e731",
      "to": "66315716a7425dd204e4e731",
      "time": 1714509598530
    }
  ]
}
```
<hr>

#### ELIMINAR TAREAS
```
DELETE  https://api-boardify.vercel.app/tasks
```
**Parametros de consulta:**<br>
- `name`
- `idList`
- `hasDescription`

**EJEMPLO RESPUESTA**<br>
```
HTTP 200 OK
Content-Type: application/json

{
  "deleted": true,
  "counter": 4
}
```
<hr>

#### ELIMINAR TAREA
```
DELETE  https://api-boardify.vercel.app/tasks:id
```
**EJEMPLO RESPUESTA**<br>
```
HTTP 200 OK
Content-Type: application/json

{
  "id": "66315e4468637d16329cfa0e",
  "name": "Tarea eliminada",
  "description": "",
  "hasDescription": false,
  "position": 25000,
  "created": 1714511427976,
  "updated": 1714511427976,
  "idList": "66315716a7425dd204e4e731",
  "idUser": "661b1427dc8c1fd2e9088917",
  "activity": [
    {
      "from": "66315716a7425dd204e4e731",
      "to": "66315716a7425dd204e4e731",
      "time": 1714511427976
    },
    ...
  ],
}
```
