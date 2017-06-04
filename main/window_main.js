const remote = require('electron').remote;
var maximized = false;
var deltaOpacity = 0.05;
function main()
{
    var window_config = require('./resources/window_config.json');
    var icon = document.getElementById("tl-icon");
    icon.setAttribute("src", __dirname + window_config.icon);
    var title = document.getElementById("titletext");
    title.innerHTML = window_config.title;
}
function exit()
{
    var window = remote.getCurrentWindow();
    var doc = document.getElementsByTagName("body")[0];
    var opac = 1;
    var animation = setInterval(animateFrame, 1);
    function animateFrame()
    {
        opac -= deltaOpacity;
        doc.style.opacity = opac;
        if (opac < 0)
        {
            clearInterval(animation);
            window.close();
        }
    }
}
function mini()
{
    var window = remote.getCurrentWindow();
    var doc = document.getElementsByTagName("body")[0];
    var opac = 1;
    var animation = setInterval(animateFrame, 1);
    function animateFrame()
    {
        opac -= deltaOpacity;
        doc.style.opacity = opac;
        if (opac < 0)
        {
            clearInterval(animation);
            window.minimize();
            doc.style.opacity = 1;
        }
    }
}
function maxi()
{
    var window = remote.getCurrentWindow();
    var doc = document.getElementsByTagName("body")[0];
    var opac = 1;
    var animation = setInterval(animateFrameOut, 1);
    function animateFrameOut()
    {
        opac -= deltaOpacity;
        doc.style.opacity = opac;
        if (opac < 0)
        {
            clearInterval(animation);
            if (!maximized)
            {
                window.maximize();
                maximized = true;
            }
            else
            {
                window.unmaximize();
                maximized = false;
            }
            animation = setInterval(animateFrameIn, 1);
        }
    }
    function animateFrameIn()
    {
        opac += deltaOpacity;
        doc.style.opacity = opac;
        if (opac > 1)
        {
            clearInterval(animation);
        }
    }
}
main();