;
(function (window, $) {
    function Whiteboard(canvas) {
        if (!(this instanceof(Whiteboard))) {
            return new Whiteboard(canvas);
        }

        this.isDrawing = false;
        this.canvas = canvas;
        this.offset = $(canvas).offset();
        this.context = canvas.getContext("2d");
        this.history = null;
        this.backgroundColor = "#fff";
        this.lineColor = "#000";
        this.lineWidth = 2;
        this.events = {move: [], start: [], end: []};
    };
    Whiteboard.prototype.init = function () {
        this.reset();

        this.on("move", this.drawLines.bind(this));
        this.on("start", this.startDrawing.bind(this));
        this.on("end", this.stopDrawing.bind(this));

        $(document)
            .on("mousemove", this.watch("move"))
            .on("touchmove", this.watch("move"))
            .on("mousedown", this.watch("start"))
            .on("touchstart", this.watch("start"))
            .on("mouseup", this.watch("end"))
            .on("touchend", this.watch("end"));
        this.context.lineCap = "round";
        this.context.lineJoin = "round";

        this.init = function () {
            throw new Error("The initializer can be executed only once.");
        };
    };

    Whiteboard.prototype.coordinates = function (event) {
        var touches = event.originalEvent.touches || event.originalEvent.changedTouches;

        if (touches) {
            event = touches[0];
        }

        if (!event) {
            return {};
        }

        return {
            x: (event.clientX - this.offset.left) + $(window).scrollLeft()
            , y: (event.clientY - this.offset.top) + $(window).scrollTop()
        };
    };

    Whiteboard.prototype.drawLines = function (coords) {
        if (!this.history || !this.isDrawing) {
            this.history = coords;
            return;
        }

        this.draw(this.history, coords, this.lineColor, this.lineWidth);
        this.history = coords;
    };

    Whiteboard.prototype.draw = function (from, to, color, width) {
        this.context.beginPath();
        this.context.strokeStyle = color;
        this.context.lineWidth = width;
        this.context.moveTo(from.x, from.y);
        this.context.lineTo(to.x, to.y);
        this.context.stroke();
        this.context.closePath();
    };
    Whiteboard.prototype.startDrawing = function () {
        this.isDrawing = true;
    };

    Whiteboard.prototype.stopDrawing = function () {
        this.isDrawing = false;
        this.history = null;
    };

    Whiteboard.prototype.watch = function (eventName) {
        return function (event) {
            this.events[eventName].forEach(function (callback) {
                callback.call(this, this.coordinates(event));
            }, this);
        }.bind(this);
    };

    Whiteboard.prototype.on = function (event, callback) {
        this.events[event].push(callback);
    };

    Whiteboard.prototype.reset = function () {
        this.context.fillStyle = this.backgroundColor;
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
    };

    window.Whiteboard = Whiteboard;
})(window, jQuery);
