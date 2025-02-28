# VREF-Server

Readme coming soon!


## API Examples

### **Error Messages**
Any errors, along with a 4xx or 5xx HTTP response code, will return json with a user-friendly error message:
```json
{ "error": "No such room" }
```


### **Get all room information**
**GET**: `/rooms/[RoomId]`\
Returns the `RoomData` object for a given room id.

`curl -X GET -H "Content-Type: application/json" localhost:3000/rooms/7`
```json
{
    "data": {
        "roomId": "7",
        "ownerId": 0,
        "attendeeIds": [0, 0, 0],
        "roomState": {
            "equations": ["", "", ""],
            "objects": ["", "", ""]
        }
    }
}
```


### **Create a room**
**POST**: `/rooms/[RoomId]/create`\
Creates a room with a specified ID and returns `RoomData`.

`curl -X POST -H "Content-Type: application/json" localhost:3000/rooms/7/create`
```json
{
    "data": {
        "roomId": "7",
        "ownerId": 0,
        "attendeeIds": [],
        "roomState": {
            "equations": [],
            "objects": []
        }
    }
}
```

### **Create a room with an automatic ID**
**POST*: `/rooms/autocreate`\
Creates a room with a generated ID and returns `RoomData`.

`curl -X POST -H "Content-Type: application/json" localhost:3000/rooms/autocreate`
```json
{
    "data": {
        "roomId": "???",
        "ownerId": 0,
        "attendeeIds": [],
        "roomState": {
            "equations": [],
            "objects": []
        }
    }
}
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
