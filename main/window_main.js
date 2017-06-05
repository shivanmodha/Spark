const remote = require('electron').remote;
var maximized = false;
var dragging = false;
var deltaOpacity = 0.05;
/**
 * Toolbar Text Constants
 */
const toolbar_button_line = "__";
const toolbar_button_cross = "&#9932";
const toolbar_button_circle = "◯";
const toolbar_button_box = "☐";
const toolbar_button_box_stretch = "⛶";
function getLabel(string)
{
    if (string === "#line")
    {
        return toolbar_button_line;
    }
    else if (string === "#cross")
    {
        return toolbar_button_cross;
    }
    else if (string === "#circle")
    {
        return toolbar_button_circle;
    }
    else if (string === "#box")
    {
        return toolbar_button_box;
    }
    else if (string === "#box-stretch")
    {
        return toolbar_button_box_stretch;
    }
    return string;
}
/**
 * Window Elements
 */
var window_config;
var element_titlebar;
var element_titlebar_title;
var element_titlebar_icon;
var element_titlebar_buttons;
var element_titlebar_minimize;
var element_titlebar_maximize;
var element_titlebar_close;

var element_titlebar_control_box = [10];
function initialize_elements()
{
    window_config = require('./resources/window_config.json');
    element_titlebar = document.getElementById("titlebar");
    element_titlebar_title = document.getElementById("titletext");
    element_titlebar_icon = document.getElementById("tl-icon");
    element_titlebar_buttons = document.getElementById("titlebutton");
    
    var titlebuttonwidth = 0;
    element_titlebar_control_box = [window_config.control_box.length];
    for (var i = 0; i < window_config.control_box.length; i++)
    {
        element_titlebar_control_box[i] = document.createElement("button");
        element_titlebar_control_box[i].setAttribute("class", "button");
        element_titlebar_control_box[i].setAttribute("onclick", window_config.control_box[i].click);
        element_titlebar_control_box[i].setAttribute("id", window_config.control_box[i].type);
        element_titlebar_control_box[i].innerHTML = getLabel(window_config.control_box[i].text);
        element_titlebar_buttons.appendChild(element_titlebar_control_box[i]);
        titlebuttonwidth += 40;
    }
    element_titlebar_buttons.style.width = titlebuttonwidth + "px";
}
/**
 * Entry
 */
function main()
{
    initialize_elements();
    var icon = document.getElementById("tl-icon");
    icon.setAttribute("src", __dirname + window_config.icon);
    var title = document.getElementById("titletext");
    title.innerHTML = window_config.title;
}
/**
 * Window Events
 */
function maximize()
{
    var window = remote.getCurrentWindow();
    window.maximize();
    window.setResizable(false);
    maximized = true;
}
function restore()
{
    var window = remote.getCurrentWindow();
    window.unmaximize();
    window.setResizable(true);
    maximized = false;
}
function event_titlebar_exit()
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
function event_titlebar_minimize()
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
function event_titlebar_maximize()
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
                maximize();
            }
            else
            {
                restore();
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
function event_titlebar_down()
{
    dragging = true;
}
function event_titlebar_move()
{
    if (dragging)
    {
        restore();
    }
}
function event_titlebar_up()
{
    dragging = false;
}
main();