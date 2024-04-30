## TAREAS

### Atributos:
- `id` **_string_** Identificador de la tarea.
- `name` **_string_** Nombre de la tarea.
- `description` **_string_** Descripción de la tarea.
- `hasDescription` **_boolean_** Marca si la tarea tiene una descripción.
- `position` **_integer_** Posición de la tarea.
- `created` **_timestamp_** Fecha de la creación de la tarea.
- `updated` **_timestamp_** Fecha de la última modificación de la tarea.
- `idList` **_string_** Identificador de la lista contenedora de la tarea.
- `idUser` **_string_** Identificador del usuario propietario de la tarea.
- `activity` **_array_** Colección de los movimientos de la tarea.
  - `from` **_string_** Identificador de la lista origen.
  - `to` **_string_** Identificador de la lista destino.
  - `time` **_timestamp_** Fecha del movimiento.
<br><br>

### Endpoints:<br>

#### **`  GET  `**&ensp;**/tasks**

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

#### **`  GET  `**&ensp;**/tasks/:id**

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



