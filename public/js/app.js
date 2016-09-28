;
(function () {
    var Drawing = {};
    Drawing.CANVAS_WIDTH = window.screen.availWidth-15;
    Drawing.CANVAS_HEIGHT = window.screen.availHeight-80;

    Drawing.init = function () {
        this.html = $("#whiteboard");
        this.canvas = document.createElement("canvas");
        this.canvas.width = this.CANVAS_WIDTH;
        this.canvas.height = this.CANVAS_HEIGHT;
        this.html.append(this.canvas);
        this.whiteboard = new Whiteboard(this.canvas);

        this.resetButton = new Drawing.ResetButton(this.whiteboard, $(".reset"));
        this.colorToolbar = new Drawing.ColorToolbar(this.whiteboard, $(".color"));
        this.connection = new Drawing.Connection(location);
        this.listener = new Drawing.listen(this.connection, this.whiteboard);
        this.whiteboard.init();
    };

    Drawing.Connection = function (location) {
        this.location = location;
        this.uri = "http://" + location.host;
        this.socket = io.connect(this.uri);

        this.on = this.socket.on.bind(this.socket);
        this.emit = this.socket.emit.bind(this.socket);
    };

    Drawing.listen = function (connection, whiteboard) {
        this.connection = connection;
        this.whiteboard = whiteboard;
        this.connection.on("draw", this.draw.bind(this));
        this.whiteboard.on("move", this.emitDrawing.bind(this));
    };

    Drawing.listen.prototype.draw = function (info) {
        this.whiteboard.draw(
            info.from
            , info.to
            , info.lineColor
            , info.lineWidth
        );
    };

    Drawing.listen.prototype.emitDrawing = function (coords) {
        if (!this.whiteboard.isDrawing) {
            return;
        }

        this.connection.emit("draw", {
            from: this.whiteboard.history
            , to: coords
            , lineWidth: this.whiteboard.lineWidth
            , lineColor: this.whiteboard.lineColor
        });
    };

    Drawing.ColorToolbar = function (whiteboard, buttons) {
        this.buttons = buttons;
        this.whiteboard = whiteboard;
        this.buttons.on("click", this.onActivate.bind(this)).on("touchstart", this.onActivate.bind(this));
        this.renderBackground();
    };

    Drawing.ColorToolbar.prototype.onActivate = function (event) {
        var button = $(event.target);
        this.whiteboard.lineColor = button.data("color");
        this.whiteboard.lineWidth = button.data("width");
    };

    Drawing.ColorToolbar.prototype.renderBackground = function () {
        this.buttons.each(function () {
            $(this).css({
                background: $(this).data("color")
            });
        });
    };

    Drawing.ResetButton = function (whiteboard, button) {
        button.on("click", function () {
            whiteboard.reset()
        }).on("touchstart", function () {
            whiteboard.reset()
        })
    };

    Drawing.init();
})();
