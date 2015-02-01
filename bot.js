var five = require("johnny-five");
var rx = require('rx');
var _ = require('underscore');

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
        	wheels.left.ccw();
        	wheels.right.cw(.3);
        	console.log("turnLeft");
        },
        turnRight: function () {
        	wheels.left.ccw(.3);
        	wheels.right.cw();
        	console.log("turnRight");
        },
        back: function () {
            wheels.left.cw();
            wheels.right.ccw();
        }
    };

    var lights = {
    	light: new five.Led(6),
    	on: function(){
    		lights.light.brightness(255);
    	}
    }

    var ldrs = {
    	right: new five.Sensor({pin:"A0", freq:250}),
    	left: new five.Sensor({pin:"A1", freq:250}),
    }

    // lights.on();

    var keys = [
		'up',
		'down',
		'left',
		'right',
		'w',
		'a',
		's',
		'd',
		'space'
		];

    wheels.stop();
    console.log("Use the cursor keys or ASWD to move your bot. Hit escape or the spacebar to stop.");

	var keyPressStream = rx.Observable.fromEvent(stdin, 'keypress',
		function(args){
			return args[1];
	});

	var keyPresses = keyPressStream
	.filter(function(key){
		return _.contains(keys, key.name);
	})
	.map(function(key){
		if(!key) return;
		switch(key.name) {
			case 'up':
			case 'w':
				return wheels.forward;
				break;
			case 'down':
			case 's':
				return wheels.back;
				break;
			case 'left':
			case 'a':
				return wheels.pivotLeft;
				break;
			case 'right':
			case 'd':
				return wheels.pivotRight;
				break;
			case 'space':
				return wheels.stop;
				break;
		}
	});

	keyPresses.subscribe(function(key){
		key();
	});

	// ldrs.left.on('data', function()	{
	// 	console.log(this.value);
	// });
	// var leftSensorReads = rx.Observable.fromEvent(ldrs.left, 'data', 
	// 	function(args){this.value});
	// leftSensorReads.subscribe(function(value){
	// 	console.log(value);
	// });
});