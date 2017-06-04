const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const url = require('url');
const vibrancy = require(path.join(__dirname, '..'));
var window_config = require('./resources/window_config.json');
var MainWindow;
function event_create()
{
    MainWindow = new BrowserWindow(
        {
            width: window_config.width,
            height: window_config.height,
            minWidth: window_config.minWidth,
            minHeight: window_config.minHeight,
            transparent: true,
            frame: false,
            show: false,
            title: window_config.title,
            icon: __dirname + window_config.icon
        });
    MainWindow.loadURL(url.format(
        {
            pathname: path.join(__dirname, '/window_main.html'),
            protocol: 'file',
            slashes: true
        }));
    MainWindow.on('closed', event_destroy);
    MainWindow.on('ready-to-show', event_load);
}
function event_load()
{
    vibrancy.SetVibrancy(MainWindow, 0);
    if (window_config.developer === true)
    {
        MainWindow.openDevTools(
            {
                detached: true
            })
    }
    MainWindow.show();
}
function event_activate()
{
    if (MainWindow === null)
    {
        event_create();
    }
}
function event_close()
{
    if (process.platform !== 'darwin')
    {
        app.quit();
    }
}
function event_destroy()
{
    MainWindow = null;
}
function main()
{
    app.on('ready', event_create);
    app.on('window-all-closed', event_close);
    app.on('activate', event_activate);
}
main();