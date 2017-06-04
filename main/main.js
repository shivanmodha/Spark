const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
const path = require('path');
const url = require('url');
const vibrancy = require(path.join(__dirname, '..'));
var MainWindow;
function event_create()
{
    MainWindow = new BrowserWindow(
        {
            width: 500,
            height: 500,
            minWidth: 100,
            minHeight: 100,
            transparent: true,
            frame: false,
            show: false,
            icon: __dirname + '/app/icon.png'
        });
    MainWindow.loadURL(url.format(
        {
            pathname: path.join(__dirname, '/app/index.html'),
            protocol: 'file',
            slashes: true
        }));
    MainWindow.on('closed', event_destroy);
    MainWindow.on('ready-to-show', event_load);
}
function event_load()
{
    vibrancy.SetVibrancy(MainWindow, 0);
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
    app.quit();
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