/**
 *  var m = new H_modal('#id');
 *  
 * // 点击提交按钮 触发bs-beforeSubmit 监听此事件
 *  m.on('bs-beforeSubmit', function(){
 *      console.log(1)
 *  });
 * 
 * // 关闭modal 触发bs-beforeClose
 *  m.on('bs-beforeClose', function(){
 *      console.log('close');
 *  })
 * 
 */

(function(){

    var H_modal = function(id, opt){
        this.ele = $(id);
        this.width = (opt && opt.width) || this.ele.data('width') || 500;
        // …………
        this.ele.width(this.width);
        this.ele.resize(this.getPosition);

        var _this = this;
        this.ele.find('[data-methods=close]').bind('click', function(){
            _this.ele.trigger('bs-beforeClose');
            _this.hide();
        });
        this.ele.find('[data-methods=submit]').bind('click', function(){
            _this.ele.trigger('bs-beforeSubmit');
        });
    }

    var _proto = H_modal.prototype;

    _proto.init = function(){
        var _this = this;
        if(!this.opacity){
            this.opacity = $('<div class="h-modal-opacity"></div>');
            this.opacity.bind('click', function(){
                _this.hide();
            });
        }
        this.getPosition();
        $('body').append(this.opacity);
        $('body').append(this.ele);
    }

    _proto.getPosition = function(){
        this.eleH = this.ele.height();
        this.eleW = this.ele.width();
        this.ele.css({
            'marginTop': -1 * this.eleH / 2 + 'px',
            'marginLeft': -1 * this.eleW / 2 + 'px',
        });
    }

    _proto.show = function(){

        var _this = this;

        _this.init();

        window.setTimeout(function(){

            _this.opacity.addClass('show');

            window.setTimeout(function(){

                _this.ele.addClass('show');

            }, 200);

        },12);
    }

    _proto.hide = function(){

        var _this = this;

        if(!_this.opacity){

            return;

        }

        _this.ele.removeClass('show');

        window.setTimeout(function(){

            _this.opacity.removeClass('show');

            window.setTimeout(function(){

                _this.opacity.remove();

                _this.opacity = null;

            }, 200)

        }, 300)

    }

    _proto.on = function(type, fn){
        this.ele.on(type, fn);
    }

    window.H_modal = H_modal;

})();

