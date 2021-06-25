/*
 * Dim Screen by a certain percentage per click on a custom System Status Icon. 
 *
 * Based on the code from https://wiki.gnome.org/Projects/GnomeShell/Extensions/StepByStepTutorial#myFirstExtension
 *
 * by d0h0@tuta.io (20161027)
 */
const St = imports.gi.St; //Gobject-Introspection https://developer.gnome.org/gobject/stable/
const Main = imports.ui.main; //Main.layoutManager.monitor https://developer.gnome.org/gtk3/stable/
const Tweener = imports.tweener.tweener;

// The dimming is achieved by inserting a label with null text object and with an alpha channel that
// covers the whole screen. The text, being null, is not display, but the alpha channel remains; thus, achieving dimming. 
var label, button;
var currentOpacity = 0;

// reset opacity to 0 and remove label 
function reset() {
    currentOpacity = 0;
    Main.uiGroup.remove_actor(label); // remove label because sometimes screenshots stay dark even at 0 opacity
    label = null;
}

// Increase opacity by 40 per click. Reset it if it goes over 100.
function handleIconClick() {
    if (currentOpacity < 100) {
        // increase opacity
        currentOpacity = currentOpacity + 40;
        // update in monitor
        update();
    } else {
	reset();
    }
}

// toggle new brightness level
function update() {
    let monitor = Main.layoutManager.primaryMonitor;
    // let monitor2 = Main.layoutManager.secondaryMonitor;
    let myText = null;
    // myText = "hi 2: " + monitor2.x;

    if (label == null) {
        label = new St.Label({
                        style_class: 'helloworld-label', // add CSS label
                        text: myText
                        });
        Main.uiGroup.add_actor(label);
    }
    global.log("DIM: currentOpacity = " + currentOpacity);
    // set label opacity
    label.opacity = currentOpacity;
    // position label at 0,0 and stretch across the entire monitor
    label.set_position(0, 0); //override
    label.set_width(monitor.width * 6); //simply give enough width
    label.set_height(monitor.height * 6);
}

function init() {
    global.log("test"); //https://smasue.github.io/gnome-shell-tw

    button = new St.Bin({ style_class: 'panel-button', 
                          reactive: true,
                          can_focus: true,
                          x_expand: true,
                          y_expand: false,
                          track_hover: true });

    //usr/share/icons/gnome/scalable/actions/system-run-symbolic.svg
    let icon = new St.Icon({ icon_name: 'dialog-information-symbolic',
                             style_class: 'panelItem' }); //system-status-icon
    button.set_child(icon);

    button.connect('button-press-event', handleIconClick);
}

function enable() {
    Main.panel._rightBox.insert_child_at_index(button, 0);
}

function disable() {
    Main.panel._rightBox.remove_child(button);
}
