const remote = require('electron').remote;
var maximized = false;
var dragging = false;
var deltaOpacity = 0.05;
/**
 * Toolbar Text Constants
 */
const toolbar_button_line = "⏤";
const toolbar_button_cross = "╳";
const toolbar_button_circle = "◯";
const toolbar_button_box = "☐";
const toolbar_button_box_stretch = "⛶";
const toolbar_button_pixel = "◉";
const toolbar_button_up = "△";
const toolbar_button_down = "⌵";
const toolbar_button_right = "〉";
const toolbar_button_left = "〈";
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
    else if (string === "#pixel")
    {
        return toolbar_button_pixel;
    }
    else if (string === "#up")
    {
        return toolbar_button_up;
    }
    else if (string === "#down")
    {
        return toolbar_button_down;
    }
    else if (string === "#right")
    {
        return toolbar_button_right;
    }
    else if (string === "#left")
    {
        return toolbar_button_left;
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
var element_titlebar_close;
var element_titlebar_control_box;
var element_titlebar_menu_items;
var element_titlebar_menu;
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
        if (window_config.control_box[i].show === true)
        {
            element_titlebar_control_box[i] = document.createElement("button");
            element_titlebar_control_box[i].setAttribute("class", "button");
            element_titlebar_control_box[i].setAttribute("onclick", window_config.control_box[i].click);
            var id = "tb-btn-ctrl";
            if (window_config.control_box[i].name === "Close")
            {
                id = "tb-btn-exit";
            }
            else if (window_config.control_box[i].name === "Minimize")
            {
                id = "tb-btn-min";
            }
            else if (window_config.control_box[i].name === "Maximize")
            {
                id = "tb-btn-max";
            }
            if (window_config.control_box[i].text === "#box")
            {
                element_titlebar_control_box[i].style.fontSize = "12pt";
            }
            element_titlebar_control_box[i].setAttribute("id", id);
            element_titlebar_control_box[i].innerHTML = getLabel(window_config.control_box[i].text);
            element_titlebar_control_box[i].style.width = window_config.control_box[i].width + "px";
            element_titlebar_buttons.appendChild(element_titlebar_control_box[i]);
            titlebuttonwidth += window_config.control_box[i].width;
        }
    }
    element_titlebar_buttons.style.width = titlebuttonwidth + "px";
    element_titlebar_menu = document.getElementById("titlemenu");
    element_titlebar_menu_items = [window_config.menu.length];
    for (var i = 0; i < window_config.menu.length; i++)
    {
        element_titlebar_menu_items[i] = document.createElement("button");
        element_titlebar_menu_items[i].setAttribute("class", "button");
        element_titlebar_menu_items[i].setAttribute("id", "tb-btn-menu");
        //element_titlebar_menu_items[i].setAttribute("onclick", window_config.menu[0].click);
        element_titlebar_menu_items[i].innerHTML = getLabel(window_config.menu[i].text);
        element_titlebar_menu.appendChild(element_titlebar_menu_items[i]);
    }
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