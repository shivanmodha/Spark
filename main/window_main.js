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
    if (string === "line")
    {
        return toolbar_button_line;
    }
    else if (string === "cross")
    {
        return toolbar_button_cross;
    }
    else if (string === "circle")
    {
        return toolbar_button_circle;
    }
    else if (string === "box")
    {
        return toolbar_button_box;
    }
    else if (string === "box stretch")
    {
        return toolbar_button_box_stretch;
    }
    return "";
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
function initialize_elements()
{
    window_config = require('./resources/window_config.json');
    element_titlebar = document.getElementById("titlebar");
    element_titlebar_title = document.getElementById("titletext");
    element_titlebar_icon = document.getElementById("tl-icon");
    element_titlebar_buttons = document.getElementById("titlebutton");
    
    var titlebuttonwidth = 0;
    if (window_config.toolbar_close_show === true)
    {
        element_titlebar_close = document.createElement("button");
        element_titlebar_close.setAttribute("class", "button");
        element_titlebar_close.setAttribute("onclick", "event_titlebar_exit()");
        element_titlebar_close.setAttribute("id", "tb-btn-exit");
        element_titlebar_close.innerHTML = getLabel(window_config.toolbar_close_type);
        element_titlebar_buttons.appendChild(element_titlebar_close);
        titlebuttonwidth += 40;
    }
    if (window_config.toolbar_maximize_show === true)
    {
        element_titlebar_maximize = document.createElement("button");
        element_titlebar_maximize.setAttribute("class", "button");
        element_titlebar_maximize.setAttribute("onclick", "event_titlebar_maximize()");
        element_titlebar_maximize.setAttribute("id", "tb-btn-max");
        element_titlebar_maximize.innerHTML = getLabel(window_config.toolbar_maximize_type);
        element_titlebar_buttons.appendChild(element_titlebar_maximize);
        titlebuttonwidth += 40;
    }
    if (window_config.toolbar_minimize_show === true)
    {
        element_titlebar_minimize = document.createElement("button");
        element_titlebar_minimize.setAttribute("class", "button");
        element_titlebar_minimize.setAttribute("onclick", "event_titlebar_minimize()");
        element_titlebar_minimize.setAttribute("id", "tb-btn-min");
        element_titlebar_minimize.innerHTML = getLabel(window_config.toolbar_minimize_type);
        element_titlebar_buttons.appendChild(element_titlebar_minimize);
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