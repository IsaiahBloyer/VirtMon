const { ipcRenderer } = require('electron');
let names = [];
let list = [];
//let selected;

(async () =>
{
    await navigator.mediaDevices.enumerateDevices().then(devices =>
    {
        devices.forEach(device =>
        {
            if (device.kind === `videoinput`)
            {
                names.push(device.label);
                list.push(device)
            }
        });
    });
    ipcRenderer.send('menu:send', names);
})();

let setSource = (id) =>
{
    let selected;
    for (let i = 0; i < names.length; i++)
    {
        if (names[i] === id)
        {
            selected = list[i].deviceId;
            break;
        }
    }
    navigator.mediaDevices.getUserMedia(
    {
        video: {
            width: 1920,
            height: 1080,
            deviceId: {
                exact: selected
            }
        }
    }).then(stream =>
    {
        document.getElementById("vid").srcObject = stream;
    });
};

ipcRenderer.on('menu:select', (event, args) =>
{
    setSource(args);
});