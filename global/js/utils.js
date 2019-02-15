var reg = {
    username: /^[a-zA-z]\w{3,15}$/,
    phone: /^1[345678]\d{9}$/,
    pwd: /^(\w|\.){8,16}$/,
    email: /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,})$/
}

var utils = {

    /**
     * 查找cookie
     * @param {String} c_name cookie字段名
     */
    getCookie: function (c_name) {
        if (document.cookie.length > 0) {
            c_start = document.cookie.indexOf(c_name + "=")
            if (c_start != -1) {
                c_start = c_start + c_name.length + 1
                c_end = document.cookie.indexOf(";", c_start)
                if (c_end == -1) c_end = document.cookie.length
                return unescape(document.cookie.substring(c_start, c_end))
            }
        }
        return ""
    },

    setCookie: function (name,value, path) { 
        var Days = 30; 
        var exp = new Date(); 
        exp.setTime(exp.getTime() + Days*24*60*60*1000); 
        document.cookie = name + "="+ escape (value) + ";"+ (path ? 'path=/;' : null) +"expires=" + exp.toGMTString(); 
    },

    /**
     * 获取表单提交数据
     * @param {any} form 表单
     * @param {any} type 查询表单方式 true->原生 false->jQ序列化
     * @returns {Object} 查找到的表单数据
     */
    getFormData: function (form, type) {
        var returnObj = {};
        var i;
        var dataAry;

        if (!type) {
            dataAry = $(form).serializeArray();
        }
        else {
            dataAry = $(form)[0];
        }
        for (i = 0; i < dataAry.length; i++) {
            if (dataAry[i].type === 'radio') {
                dataAry[i].checked ? returnObj[dataAry[i].name] = $.trim(dataAry[i].value) : null;
            }
            else {
                returnObj[dataAry[i].name] = $.trim(dataAry[i].value);
            }
        }
        i = null;
        dataAry = null;
        return returnObj;
    },

    /**
     * 设置表单
     * @param {any} form form元素（原生）
     * @param {any} data 表单数据
     */
    setForm: function (form, data) {
        var obj = {};
        for (var k in data) {
            if (data.hasOwnProperty(k)) {
                obj[k.toLowerCase()] = data[k];
            }
        }
        data = obj;
        for (var i = 0; i < form.length; i++) {
            var cur = form[i];
            var type = cur.type;
            var key = cur.name.toLowerCase();
            var val = cur.value;
    
            switch (type) {
                case 'file': {
                    break;
                }
                case 'checkbox': {
                    //data[k] 数组
                    cur.checked = (data[key].indexOf(val) === -1) ? false : true;
                    break;
                }
                case 'radio': {
                    cur.checked = (data[key] == val) ? true : false;
                    break;
                }
                default: {
                    cur.value = (data[key] === undefined || data[key] === null ? '' : data[key]);
                    break;
                }
            }
            
        }
    },

    /**
     * ajax请求
     * @param {Object} data 传递的参数
     * @param {String} type 类型
     * @param {String} url 地址
     * @param {Function} callback 回调
     * @param {Boolean} alert 是否弹出提示  false强制不弹出（错误、失败也不弹出）
     * @param {Boolean} upload 是否上传
     * @param {Function} errorback 失败回调
     */
    getAjax: function (opt) {
        var data = opt.data || {};
        var type = opt.type || 'POST';
        var url = opt.url || '/';
        var success = opt.success || null;
        var error = opt.error || null;
        var complete = opt.complete || null;
        var alert = opt.alert === undefined ? undefined : opt.alert;
        var obj = {
            url: url,
            data: data,
            type: type,
            dataType: 'JSON',
            beforeSend: function(xhr, settings) {
                xhr.setRequestHeader('x-csrf-token', utils.getCookie('csrfToken'));
            },
            success: function (result) {
                if (result.state) {
                    typeof success === 'function' ? success(result.data) : null;
                    if (alert)
                        utils.alert(true, result.msg);
                }
                else {
                    alert === false ? null : utils.alert(false, result.msg);
                    typeof error === 'function' ? error(result) : null;
                }
            },
            error: function (err) {
                typeof error === 'function' ? error(err) : null;
            },
            complete: function () {
                typeof complete === 'function' ? complete() : null;
            }
        }
        $.ajax(obj);
    },

    /**
     * 深度拷贝对象
     * @param  {Object} obj 需要拷贝的对象
     * @return {Object} 拷贝后的对象
     */
    deepCopy: function (obj) {
        var returnObj = {};
        try {
            returnObj = JSON.parse(JSON.stringify(obj));
        } catch (e) {
            returnObj = {};
            for (var k in obj) {
                returnObj[k] = obj[k];
            }
        }
        return returnObj;
    },

    /**
     * 解析时间
     * @param {Date/String} paseStr 需要解析的时间串
     * @param {String} format 返回格式
     * @return {String} 返回解析后的时间格式
     */
    paseDate: function (paseStr, format) {
        format = format || 'yyyy-MM-dd';
        var flag = /\d{2}T\d{2}/.test(paseStr); // 是否为UTC格式的时间
        var timeOffset = new Date().getTimezoneOffset() * 60000; // 获取本地时间与格林威治时间差（毫秒）;
        var date;
    
        try {
            if (flag) {
                // 如果UTC时间 没有Z后缀 加上Z后缀
                !/Z$/.test(paseStr) ? paseStr += 'Z' : null;
                date = new Date(new Date(paseStr) * 1 + timeOffset);
            }
            else {
                date = paseStr ? new Date(paseStr) : new Date();
            }
            
            var dict = {
                "yyyy": date.getFullYear(),
                "M": date.getMonth() + 1,
                "d": date.getDate(),
                "H": date.getHours(),
                "m": date.getMinutes(),
                "s": date.getSeconds(),
                "l": date.getMilliseconds(),
                "MM": ("" + (date.getMonth() + 101)).substr(1),
                "dd": ("" + (date.getDate() + 100)).substr(1),
                "HH": ("" + (date.getHours() + 100)).substr(1),
                "mm": ("" + (date.getMinutes() + 100)).substr(1),
                "ss": ("" + (date.getSeconds() + 100)).substr(1),
                "ll": ("" + (date.getMilliseconds() + 1000)).substr(1),
            };
            return format.replace(/(yyyy|MM?|dd?|HH?|ss?|mm?|ll?)/g, function () {
                return dict[arguments[0]];
            });
        }
        catch (e) {
            alert(true, '需要正确的时间格式,当前时间格式为' + paseStr, '解析时间失败');
        }
    },

    /**
     * 格式化时间格式
     * @param {any} s 需要格式化的时间
     * @return {String} 格式化后的值
     */
    formatDate: function (s) {
        return s ? s.replace(/\.(\d{2})$/, function () { return '.0' + arguments[1]; }) : '';
    },

    /**
     * 获取URL参数
     * @param {String} search URL地址
     * @param {any} name 参数名
     * @return {String} 查询到的值
     */
    getURL: function (search, name) {
        var reg = new RegExp("[?&]" + name + "=([^&]*)(&|$)", "i");
        var r = search.match(reg);
        if (r != null) return unescape(r[1]);
        return null;
    },

    alert: function(flag, msg){
        alert(msg);
    },

    /**
   * 根据规则验证数据
   * @param {Object} data 数据
   * @param {Object} rule 规则
   */
  validateData (data, rule) {
    for(let k in rule){
      const type = rule[k];
      const val = data[k];
      let field = null;
      switch (Object.prototype.toString.call(type)) {
        //true->不为空
        case '[object Boolean]': {
          !this.isTypeOf(val, 'noEmpty') ? field = k : null;
          break;
        }
        //function->执行function
        case '[object Function]': {
          !type(val, data) ? field = k : null;
          break;
        }
        //string->检测值数据类型
        case '[object String]': {
          !this.isTypeOf(val, type) ? field = k : null;
          break;
        }
      }

      // 如果没通过 返回失败
      if(field !== null) {
        return field;
      }
    }

    return true;
  },

  /**
   * 检测值是否是预期数据类型
   * @param {All} val 值
   * @param {string} type 预期类型
   */
  isTypeOf (val, type) {
    switch (type) {
      case 'noEmpty': { // 不为空
        return val !== '';
      }
      case 'isPhone': {
        return reg.phone.test(val);
      }
      case 'isPwd': {
        return val && reg.pwd.test(val);
      }
      case 'isEmail': {
        return val && reg.email.test(val);
      }
      case 'isUsername': {
        return val && reg.username.test(val);
      }
      default : {
        return Object.prototype.toString.call(val).toLowerCase() === `[object ${type.toLowerCase()}]`;
      }
    }
  },

};

(function(){

    var AlertBox = function(id, opt){
        var defaultOpt = {
            body: '',
            status: 'default'
        }
        this.opt = $.extend({}, defaultOpt, opt);
        this.ele = $(id);
        this.body = this.ele.find('.alert-body');
        this.init();
    }

    var _proto = AlertBox.prototype;

    _proto.init = function(){
        var _this = this;
        this.ele.find('[data-methods=close]').bind('click', function(){
            _this.hide();
        });
    }

    _proto.change = function(status, str){
        this.opt.status = status;
        switch (status) {
            case 'default':
            case '': {
                this.ele.attr('class', 'alert-box');
                break;
            }
            case 'info': {
                this.ele.attr('class', 'alert-box alert-info');
                break;
            }
            case 'success': {
                this.ele.attr('class', 'alert-box alert-success');
                break;
            }
            case 'error': {
                this.ele.attr('class', 'alert-box alert-error');
                break;
            }
            case 'warning': {
                this.ele.attr('class', 'alert-box alert-warning');
                break;
            }
        }
        this.ele.show();
        str === undefined ? null : this.html(str);
        return this;
    }

    _proto.show = function(){
        this.ele.show();
        return this;
    }
    _proto.hide = function(){
        this.ele.hide();
        return this;
    }

    _proto.html = function(str){
        this.body.html(str);
        return this;
    }

    window.AlertBox = AlertBox;
})();

(function(){

    var FormValidateData = function(ele, opt){
        
        this.$form = ele;
        this.fields = opt.fields;
        this.submitHandler = opt.submitHandler;
        this.submitBtn = this.$form.find(this.submitHandler.field);
        this.flag = true;
        this.init();
    }

    var _proto = FormValidateData.prototype;

    _proto.init = function(){
        var _this = this;
        for(var k in this.fields){
            var cur = this.$form.find('[name='+k+']');
            if(!cur.length){
                continue;
            }
            var type = cur.attr('type') || cur.prop('tagName').toLowerCase();
            this.bind(cur, type, k, this.fields[k]);
        }

        this.submitBtn.bind('click', function(){
            var result = _this.submitValidateData();
            _this.submitHandler.callback(result.flag, result.data, _this.$form);
        })
    }

    _proto.bind = function(ele, type, k, callback){
        var _this = this;
        switch (type) {
            case 'text':
            case 'password':
            case 'hidden':
            case 'textarea':{
                ele.bind('blur', function(){
                    _this.flag = callback(this.value, k);
                });
                break;
            }
            case 'checkbox':
            case 'radio': {
                ele.bind('click', function(){
                    _this.flag = callback(this.checked, k);
                });
                break;
            }
            case 'select': {
                ele.bind('change', function(){
                    _this.flag = callback(this.value, k);
                });
                break;
            }
            
        }
    }

    _proto.submitValidateData = function(){
        var data = utils.getFormData(this.$form);

        for(var k in this.fields){
            this.flag = this.fields[k](data[k], k);
            if(!this.flag){
                return {
                    flag: false,
                    data:data,
                };
            }
        }
        return {
            flag: true,
            data: data,
        };
    }


    $.fn.formValidateData = function(option){
        return new FormValidateData($(this), option);
    }
})();

(function(){

    var NavRadio = function(id, option){
        var ele = id ? $(id) : $('#navRadio');

        if(!ele.length) {
            throw new Error('You need a correct ID and the default ID is "navRadio"!');
        }

        this.radioGroup = ele.find('.nav-radio-group');
        this.radioContent = ele.find('.nav-radio-content');
        
        this.opt = option || {};
        this.gather = {};

        this.index = this.opt.index || this.radioGroup.children().eq(0).data('type');
        this.lastIndex = '';

        this.init();
    }

    var _proto = NavRadio.prototype;

    _proto.init = function(){
        var _this = this;
        
        this.radioGroup.children().each(function(){
            var $this = $(this);
            var type = $this.data('type');
            
            _this.gather[type] = {
                group: $this,
                content: _this.radioContent.find('[data-type='+ type +']')
            }

            $this.bind('click', function(){
                _this.change(type);
            })
        });

        this.change(this.index);
    }

    _proto.change = function(index){
        if(index === this.lastIndex){
            return;
        }
        if(this.lastIndex !== '' && this.lastIndex !== undefined && this.lastIndex !== null){
            this.gather[this.lastIndex].group.removeClass('active');
            this.gather[this.lastIndex].content.hide();
        }
        this.gather[index].group.addClass('active');
        this.gather[index].content.show();

        this.lastIndex = index;

        typeof this.opt.callback === 'function' ? this.opt.callback(index) : null;
    }

    $.fn.navRadio = function(option){
        return new NavRadio($(this), option);
    }

})()