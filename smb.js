var SlotMachine = Backbone.Model.extend({
    
    reels: [],
    spun: 0,
    prizes: {
        coffee: 0,
        tea: 0,
        ess: 0
    },
    prizeText: {
        coffee: "Have a cuppa on me.",
        tea: "Relax - you deserve it.",
        ess: "Excellent taste is its own reward."
    },
    faded: 0,
    
    initialize: function() {
        var _this = this;
        this.button = new Button({el: $('.btn'), model: this});
        ['#reel-1', '#reel-2', '#reel-3'].forEach(function (selector) {
            _this.reels.push( new Reel({el: $(selector), model: _this}) );
        });
        this.on("reel", function(prize) {
            _this.prizes[prize] += 1;
            _this.spun += 1;
            if (_this.prizes[prize] == 3) {
                _this.win(prize);
            } else if (_this.spun == 3) {
                _this.reset();
            }
        });
        this.on("fade", function() {
            _this.faded += 1;
            if (this.faded == 4) {
                $(".prize").fadeIn(350);
            }
        });
        return this;
    },
    
    spin: function() {
        var _this = this;
        this.reels.map(function(reel) {
            reel.spin();
        });
    },

    reset: function() {
        console.log(this.prizes);
        this.spun = 0;
        this.prizes = {coffee: 0, tea: 0, ess: 0};
    },

    fade: function() {
        var _this = this;
        this.button.fade();
        _.delay(function() {
            _this.reels.map(function(reel) {
                reel.fade();
            });
        }, 500);
    },

    win: function(prize) {
        $("img.prize").attr("src", "img/" + prize + "4.jpg");
        $("h2.prize").text(this.prizeText[prize]);
        this.fade();
    }
});

var Reel = Backbone.View.extend({
    symbol: 0,
    speed: 0.1,
    spins: -1,
    coffeeSymbols: [0,3,6],
    teaSymbols: [1,4,7],
    essSymbols: [2,5,8],
    
    initialize: function() {
        var _this = this;
        setInterval(function () {
            if (_this.spins > 0) {
                _this.spins -= 1;
                _this.symbol += 1;
                if (_this.symbol > 8) {
                    _this.symbol = 0;
                }
                _this.rotate_to(_this.symbol);
            } else if (_this.spins == 0) {
                _this.spins -= 1;
                _this.stop();
            }
        }, (this.speed * 1000));
    },

    rotate_to: function(i) {
        var _this = this
        var deg = (i * 40);
        this.$el.css("transition-duration", this.speed + "s");
        this.$el.css("-webkit-transform", "rotateX(-" + deg + "deg)");
        return this;
    },
    
    stop: function() {
        console.log(this.$el.attr("id") + " stopped at " + this.symbol);
        if (this.coffeeSymbols.indexOf(this.symbol) > -1) {
            this.model.trigger("reel", "coffee");
        } else if (this.teaSymbols.indexOf(this.symbol) > -1) {
            this.model.trigger("reel", "tea");
        } else {
            this.model.trigger("reel", "ess");
        }
    },
    
    spin: function() {
        var _this = this;
        this.spins = _.random(9, 18) 
        return this;
    },

    fade: function() {
        var _this = this;
        this.$el.fadeOut(250, function() {
            _this.model.trigger("fade");
        });
    }
});

var Button = Backbone.View.extend({
    events: {
        click: 'click'
    },
    
    click: function(e) {
        this.model.spin()
    },

    fade: function() {
        var _this = this;
        this.$el.fadeOut(250, function() {
            _this.model.trigger("fade");
        });
    }
});

$(document).ready(function() {
     slots = new SlotMachine();
});