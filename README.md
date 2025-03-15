# VREF-Server

Readme coming soon!


## API Examples

### **Error Messages**
Any errors, along with a 4xx or 5xx HTTP response code, will return json with a user-friendly error message:
```json
{ "error": "No such room" }
```


### **Get room state**
**GET**: `/rooms/[RoomId]`\
Returns the `RoomState` object for a given room id.

`curl -X GET -H "Content-Type: application/json" localhost:3000/rooms/7`
```json
{
    "data": {
        "settings": {
            "xMin": -10,
            "xMax": 10,
            "yMin": -10,
            "yMax": 10,
            "zMin": -10,
            "zMax": 10,
            "step": 1
        },
        "equations": []
    }
}
```


### **Create a room**
**POST**: `/rooms/[RoomId]/create`\
Creates a room with a specified ID and returns `RoomData`.\
Be sure to save the `ownerUpdateToken`.

`curl -X POST -H "Content-Type: application/json" localhost:3000/rooms/7/create`
```json
{
    "data": {
        "roomId": "7",
        "ownerUpdateToken": "some-long-string",
        "roomState": {
            "settings": {
                "xMin": -10,
                "xMax": 10,
                "yMin": -10,
                "yMax": 10,
                "zMin": -10,
                "zMax": 10,
                "step": 1
            },
            "equations": []
        }
    }
}
```

### **Create a room with an automatic ID**
**POST**: `/autocreate`\
Creates a room with a generated ID and returns `RoomData`.
Be sure to save the `ownerUpdateToken`.

`curl -X POST -H "Content-Type: application/json" localhost:3000/rooms/autocreate`
```json
{
    "data": {
        "roomId": "???",
        "ownerUpdateToken": "some-long-string",
        "roomState": {
            "settings": {
                "xMin": -10,
                "xMax": 10,
                "yMin": -10,
                "yMax": 10,
                "zMin": -10,
                "zMax": 10,
                "step": 1
            },
            "equations": []
        }
    }
}
```


### **Update room state**
**POST**: `/rooms/[RoomID]/updatestate`\
Updates the room state of the given room. Returns `{data: "ok"}`.

```sh
curl -X POST -H "Content-Type: application/json" -d \
'{"key": "update key", "roomState": {RoomState json object}}' \
localhost:3000/rooms/1/updateState
```
200 example:
```json
{ "status": "ok" }
```
403 example:
```json
{ "error": "Bad update key" }
```

### **Get server status / protocol version**
**GET**: `/`\
Returns a basic json object for server reachability checks and protocol version checks

`curl -X GET -H "Content-Type: application/json" localhost:3000/`
```json
{
    "status": "ok",
    "protocolVersion": 0
}
```
