# Regolith-Auto-Reload

## Arguments

| Argument     | Aliases | Default     | Description                                                     |
| ------------ | ------- | ----------- | --------------------------------------------------------------- |
| regolithpath | rp      | ".regolith" | Set the regolith path to be watched for changes                 |
| wsport       | wsp     | 8080        | Set the port for the websocket that will be connected to ingame |

---

## Setup

### Local Setup

Installation

```
npm i https://github.com/MajestikButter/Regolith-Auto-Reload
```

Usage:

```
npm exec regolith-reload -rp .regolith -wsp 8080
```

---

### Global Setup

Installation:

```
npm i https://github.com/MajestikButter/Regolith-Auto-Reload -g
```

Usage:

```
regolith-reload -rp .regolith -wsp 8080
```

## Connecting

In order to run /reload automatically, you must connect to the websocket that is created by the script. The command will look like this: `/connect localhost:{port}`, replace port with your specified websocket port. The command will look like the following if no custom port is provided:

```
/connect localhost:8080
```
