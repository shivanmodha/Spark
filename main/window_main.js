const remote = require('electron').remote;
const vibrancy = require('..')
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
var element_titlebar_menu_container;
var element_container_wrapper;
var element_container;
var element_darken;
var hideDropDown = false;
function initialize_elements()
{
    window_config = require('./resources/window_config.json');
    element_container_wrapper = document.getElementById("wrapper");
    element_container = document.getElementById("content");
    element_titlebar = document.getElementById("titlebar");
    element_titlebar_title = document.getElementById("titletext");
    element_titlebar_icon = document.getElementById("tl-icon");
    element_titlebar_buttons = document.getElementById("titlebutton"); 
    element_darken = document.getElementById("darken");   
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
    element_titlebar_menu_container = [window_config.menu.length];
    for (var i = 0; i < window_config.menu.length; i++)
    {
        const id = i;
        element_titlebar_menu_items[i] = document.createElement("button");
        element_titlebar_menu_items[i].setAttribute("class", "button");
        element_titlebar_menu_items[i].setAttribute("id", "tb-btn-menu");
        // element_titlebar_menu_items[i].setAttribute("onclick", window_config.menu[0].click);
        element_titlebar_menu_items[i].innerHTML = getLabel(window_config.menu[i].text);
        element_titlebar_menu.appendChild(element_titlebar_menu_items[i]);
        element_titlebar_menu_container[i] = document.createElement("div");
        element_titlebar_menu_container[i].setAttribute("id", "dropdown");
        element_titlebar_menu_container[i].style.display = "none";
        for (var k = 0; k < window_config.menu[i].items.length; k++)
        {
            var element = document.createElement("a");
            var text = window_config.menu[i].items[k].text;
            if (text === "#divider")
            {
                element.setAttribute("id", "dropdown-divider");
            }
            else
            {
                element.innerHTML = window_config.menu[i].items[k].text;
                element.setAttribute("id", "dropdown-content");
            }
            element_titlebar_menu_container[i].appendChild(element);
        }
        element_titlebar_menu_items[i].onclick = function()
        {
            for (var j = 0; j < element_titlebar_menu_items.length; j++)
            {
                if (j != id)
                {
                    element_titlebar_menu_container[j].style.display = "none";
                }
            }
            var menu_width = 26;
            for (var j = id - 1; j >= 0; j--)
            {
                var style = window.getComputedStyle(element_titlebar_menu_items[j], null);
                var width = parseInt(style.getPropertyValue("width"), 10);
                menu_width += width;
            }
            element_titlebar_menu_container[id].style.left = menu_width + "px";
            if (element_titlebar_menu_container[id].style.display === "none")
            {
                element_darken.style.display = "block";
                element_titlebar_menu_container[id].style.display = "block";
            }
            else
            {      
                element_darken.style.display = "none";          
                element_titlebar_menu_container[id].style.display = "none";
            }
        };
        element_container_wrapper.appendChild(element_titlebar_menu_container[i]);
        element_titlebar.onclick = function()
        {
            for (var j = 0; j < element_titlebar_menu_items.length; j++)
            {
                element_titlebar_menu_container[j].style.display = "none";
            }
        };
        element_darken.onclick = function()
        {            
            element_darken.style.display = "none";    
            for (var j = 0; j < element_titlebar_menu_items.length; j++)
            {
                element_titlebar_menu_container[j].style.display = "none";
            }
        };
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