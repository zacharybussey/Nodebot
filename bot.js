var five = require("johnny-five");
var board = new five.Board();

var stdin = process.stdin;
stdin.setRawMode(true);
stdin.resume();

board.on("ready", function () {
    var wheels = {
        left: new five.Servo({ pin: 9, type: 'continuous' }),
        right: new five.Servo({ pin: 10, type: 'continuous' }),
        stop: function () {
            wheels.left.center();
            wheels.right.center();
        },
        forward: function () {
            wheels.left.ccw();
            wheels.right.cw();
            console.log("goForward");
        },
        pivotLeft: function () {
            wheels.left.cw();
            wheels.right.cw();
            console.log("pivotLeft");
        },
        pivotRight: function () {
            wheels.left.ccw();
            wheels.right.ccw();
            console.log("pivotRight");
        },
        turnLeft: function() {
        	wheels.left.cw();
        	wheels.right.stop();
        	console.log("turnLeft");
        },
        turnRight: function () {
        	wheels.left.stop();
        	wheels.right.ccw();
        	console.log("turnRight");
        },
        back: function () {
            wheels.left.cw();
            wheels.right.ccw();
        }
    };

    wheels.stop();
    console.log("Use the cursor keys or ASWD to move your bot. Hit escape or the spacebar to stop.");

    stdin.on("keypress", function(chunk, key) {
        if (!key) return;

        switch (key.name) {
        case 'up':
        case 'w':
            wheels.forward();
            break;

        case 'down':
        case 's':
            wheels.back();
            break;

        case 'left':
        case 'a':
        	if(key.shift){
	            wheels.pivotLeft();
            } else {
            	wheels.turnLeft();
            }
            break;

        case 'right':
        case 'd':
        	if(key.shift) {
	            wheels.pivotRight();
        	} else {
        		wheels.turnRight();
        	}
            break;

        case 'space':
        case 'escape':
            wheels.stop();
            break;
        }
    });
});