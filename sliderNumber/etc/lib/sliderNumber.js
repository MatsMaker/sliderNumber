jQuery.fn.selectSlider = function(options, callback) {

  var SelectSlider = function(that) {
    var that = $(that);

    that._callback = (callback) ? callback : function(that) {
    };

    var options = $.extend({
      max: 10,
      min: 0,
      step: 1,
      defaultValue: true, // true - set value of input value, false - none initialization value, number - for explicit initialization
      speedAnimate: 300,
      displayInput: false,
      dragDrop: true,
      division: false
    }, options);

    var className = {
      cover: 'ss-cover',
      box: 'select-slider',
      item: 'ss-item',
      label: 'ss-label',
      line: 'ss-line',
      progressLine: 'ss-progress',
      active: 'ss-active',
      hover: 'ss-hover',
      curent: 'ss-curent',
      selector: 'ss-selector',
      dragged: 'ss-dragged'
    };

    that.el = {
      box: '',
      items: '',
      labels: '',
      selector: ''
    };

    function create_model(divisions_options) {

      var options = (divisions_options) ? divisions_options : that.options;

      var create_item = function(title) {
        var widthItem = 100 / (options.max - options.min);
        return '<div class="' + className.item + '" style="width:' + widthItem + '%">' + '<div class="' + className.label + '"><span>' + title + '</span></div><div class="' + className.line + '"></div></div>';
      };

      var create_selector = function() {
        return '<div class="' + className.selector + '"></div>';
      };

      var create_progressLine = function() {
        return '<div class="' + className.progressLine + '"></div>';
      };

      var crate_box = function(options, create_item) {
        var box = '<div class="' + className.box + '">';
        for (var i = options.min; options.max >= i; i += options.step) {
          box += create_item(i);
          if (options.max - options.step <= i && options.max > i) {
            box += create_selector();
            box += create_progressLine();
          }
        }
        ;
        box += '</div>';
        return box;
      };
      return crate_box(options, create_item);
    }

    function get_activ_item(event, position) {
      var nItem = 0;
      var posCursor = 0;
      if (event !== '') {
        posCursor = $(event)[0].clientX - that.el.box.position().left;
      }
      if (position) {
        posCursor = parseInt(that.el.selector.css('left'));
      }
      var widthItem = that.el.box.outerWidth();
      var devision = widthItem / (options.max - options.min);

      if (posCursor < widthItem - devision / 2) {
        nItem = (posCursor / devision).toFixed();
      } else {
        nItem = options.max;
      }

      return nItem;
    }

    function processing_status(nItem, statusClass) {
      $.each(that.el.items, function() {
        var item = $(this);
        if (item.index() <= nItem) {
          item.addClass(statusClass);
        } else {
          item.removeClass(statusClass);
        }
        item.removeClass(className.curent);
        if ( parseInt(item.index()) === parseInt(nItem) ) {
          item.addClass(className.curent);
        }
      });
      if (nItem === options.max) {
        $(that.el.items[options.max]).addClass(statusClass);
        $(that.el.items[options.max]).addClass(className.curent);
      }
    }

    that.set_value = function(nItem) {
      var val = 0;
      if (nItem < options.max) {
        val = parseInt(options.min) + parseInt(nItem);
      } else {
        val = options.max;
      }

      that.attr('value', val);
    };

    function action_fix_selector(nItem) {
      var item = $(that.el.items[nItem]);
      var moveSelector = 0;
      if (nItem < options.max) {
        moveSelector = item.position().left + item.outerWidth();
      } else {
        moveSelector = that.el.box.outerWidth();
      }
      that.set_value(nItem);
      that.el.selector.animate({'left': moveSelector}, options.speedAnimate);
      processing_status(nItem, className.active);
    }

    function action_hover() {

      that.el.box.on('mousemove', '.' + className.item, function(event) {
        var nItem = get_activ_item(event);
        processing_status(nItem, className.hover);
      });

      that.el.box.on('mouseout', function() {
        $(this).find('*').removeClass(className.hover+" "+className.curent);
      });

      that.el.box.on('click', '.' + className.item, function(event) {
        var nItem = get_activ_item(event);
        action_fix_selector(nItem);
      });

      if (options.dragDrop) {
        that.el.selector.draggable({
          axis: "x",
          containment: "parent",
          drag: function() {
            $.each(that.el.items, function() {
              $(this).removeClass(className.active);
            });
            var nItem = get_activ_item('', true);
            processing_status(nItem, className.hover);
            that.el.box.addClass(className.dragged);
          },
          stop: function() {
            var nItem = get_activ_item('', true);
            action_fix_selector(nItem);
            that.el.box.removeClass(className.dragged);
          }
        });
      }

    }

    function set_default_value() {
      if (options.defaultValue === true) {
        var value = (that.attr('value')) ? that.attr('value') : 0;
        action_fix_selector(value, className.active);
      } else if (options.defaultValue) {
        action_fix_selector(options.defaultValue, className.active);
      }
    }

    function _constructor() {

      that.after(create_model(options));
      var el = {};
      el.box = that.next('.' + className.box);
      el.items = el.box.find("." + className.item);
      el.labels = el.box.find('.' + className.label);
      el.selector = el.box.find('.' + className.selector);
      that.el = el;
      set_default_value();

      action_hover();

      if (!options.displayInput) {
        that.css('display', 'none');
      }

      return el;
    }

    function callback_function() {
      that._callback(that);
    }

    _constructor();
    callback_function();
  };

  $.each(this, function() {
    new SelectSlider(this);
  });
  
};