/*
 * Dim Screen
 *
 * Based on the code from https://wiki.gnome.org/Projects/GnomeShell/Extensions/StepByStepTutorial#myFirstExtension
 *
 * by d0h0@tuta.io (20161027)
 */
const St = imports.gi.St; //Gobject-Introspection https://developer.gnome.org/gobject/stable/
const Main = imports.ui.main; //Main.layoutManager.monitor https://developer.gnome.org/gtk3/stable/
const Tweener = imports.ui.tweener;

let text, button;
let currentOpacity = 0;
// get current brightness level

// toggle brightness
/*
function _hideHello() {
    Main.uiGroup.remove_actor(text);
    text = null;
}*/

// reset opacity when clicked
function _resetAndShowHello() {
    if (currentOpacity < 100) {
        currentOpacity = currentOpacity + 40;
    } else {
      currentOpacity = 0;
    }

    _showHello();
}

// toggle brightness
function _showHello() {
    let monitor = Main.layoutManager.primaryMonitor;
    // let monitor2 = Main.layoutManager.secondaryMonitor;
    let myText = null;
    // myText = "hi 2: " + monitor2.x;

    if (!text) {
        text = new St.Label({
                        style_class: 'helloworld-label',
                        text: myText
                        });
        Main.uiGroup.add_actor(text);
    } /*else {
        _hideHello();
    }*/

    global.log("DIM: currentOpacity = " + currentOpacity);

    text.opacity = currentOpacity;

    // show panel icon
    text.set_position(0, 0); //override
    text.set_width(monitor.width * 6); //simply give enough width
    text.set_height(monitor.height * 6);
}

function init() {
    global.log("test"); //https://smasue.github.io/gnome-shell-tw

    button = new St.Bin({ style_class: 'panel-button',
                          reactive: true,
                          can_focus: true,
                          x_fill: true,
                          y_fill: false,
                          track_hover: true });

    //usr/share/icons/gnome/scalable/actions/system-run-symbolic.svg
    let icon = new St.Icon({ icon_name: 'dialog-information-symbolic',
                             style_class: 'panelItem' }); //system-status-icon
    button.set_child(icon);

    button.connect('button-press-event', _resetAndShowHello);
}

function enable() {
    Main.panel._rightBox.insert_child_at_index(button, 0);
}

function disable() {
    Main.panel._rightBox.remove_child(button);
}
