(function(){

    var H_step = function(ele, opt){
        /**
         * ele: '#id'
         * opt = {
         *      index: 1 // 默认第几步
         *      list: [
         *          {
         *              step: 1 // 圆圈中的第几步
         *              title: '第一步' // 标题
         *              description： '备注'
         *          }
         *      ]
         * }
         * callback: function // 点击步骤回调
         */

        if(!opt.list || !$.isArray(opt.list) || !opt.list.length){
            alert('The list parameter is incorrect！');
            return;
        }
        this.opt = opt;
        this.ele = $(ele);
        this.index = opt.index || 0;
        this.list = {};
        this.max = this.opt.list.length - 1;
        this.min = 0;
        this.init();
    }

    var _proto = H_step.prototype;

    _proto.init = function(){
        this.outer = $('<div class="step-container step-lay-sm"></div>');

        for(var i = 0; i < this.opt.list.length; i++){
            var cur = this.opt.list[i];
            var element = this.render(cur, i);
            this.list[i] = cur;
            // 设置状态
            if(i < this.index){
                cur.status = 'finished';
            }
            else if(i == this.index) {
                cur.status = 'progress';
            }
            else {
                cur.status = 'waiting';
            }
            this.vmBind(this.list[i], element, cur.status);
            this.outer.append(element);
        }
        this.ele.append(this.outer);
        this.jump(this.index);
    }

    _proto.vmBind = function(obj, element, status){

        Object.defineProperty(obj, 'status', {
            configurable: true,
			enumerable: true,
			set: function (val) {
                status = val;
                element.find('.step').attr('class', 'step step-item-' + status);
			},
			get: function () {
                return status;
			}
        })

    }

    _proto.render = function(data, i){
        var _this = this;
        var ele = $('<div class="step-layout">'+
                    '    <div class="step">'+
                    '        <div class="step-circle">'+ data.step +'</div>'+
                    '        <div class="step-content">'+
                    '            <div class="step-title">'+ data.title +'</div>'+
                    '            <div class="step-description '+ (data.description ? '' : 'hide') +'">'+ data.description +'</div>'+
                    '        </div>'+
                    '    </div>'+
                    '</div>');

        ele.find('.step-circle,.step-title').bind('click', function(){
            var status = '';
            if(i < _this.index){
                status = 'finished';
            }
            else if(i == _this.index) {
                status = 'progress';
            }
            else {
                status = 'waiting';
            }
            _this.opt.callback(i, status)
        });
        
        return ele;
    }

    _proto.jump = function(index){

        if(index < this.min){
            index = this.min;
        }
        if(index > this.max) {
            index = this.max;
        }

        this.index = index;

        for(var k in this.list){
            this.list[k];

            if(k < index){
                this.list[k].status = 'finished';
            }
            else if(k == index) {
                this.list[k].status = 'progress';
            }
            else {
                this.list[k].status = 'waiting';
            }
        }
    }

    _proto.next = function(){
        this.jump(++this.index);
    }
    _proto.prev = function(){
        this.jump(--this.index);
    }
    _proto.refresh = function(){
        this.jump(0);
    }
    // _proto.on = function(type, fn){
    //     this.ele.on(type, fn);
    // }
    window.H_step = H_step;

})();