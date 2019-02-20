
var ENV = {
    defaultAvatar: '',
    userInfo: JSON.parse(utils.getCookie('userInfo')),
};

render();

// 编辑图片
(function(){

    var editModal = new H_modal('#editPic');

    var CropperImage = function(){

        this.src = '';

        this.left = 0;
        this.top = 0;
        this.width = 0;
        this.height = 0;

        this.$image = $('#image');
        this.$fileUpload = $('#fileUpload');
        this.$imageView = $('.image-view');
        this.$imageViewOuter = $('#imageViewOuter');

        this.init();
    }

    var _proto = CropperImage.prototype;

    _proto.init = function(){

        var _this = this;
        this.$image.css('display', 'none');
        
        // 绑定图片onload事件 获取到初始宽度高度
        this.$image.bind('load', function(){
            _this.$image.css('display', 'block');
            _this.startCropper();
        });

        // 绑定选中图片事件
        this.$fileUpload.bind('change', function(e){
            if(this.files && this.files[0]){
                _this.src = window.URL.createObjectURL(this.files[0]);
                _this.$image.prop('src', _this.src);
            }
        });

        // 绑定cropper渲染完成加载完成事件
        this.$image.on('built.cropper', function(){

            // 刷新modal的位置
            editModal.getPosition();
            // // 获取图片的大小 让选中区域选中整个图片
            // var position = _this.$image.cropper('getCanvasData');
            // var w = position.width;
            // var h = position.height;
            // if (w > h) {
            //     _this.width = h;
            //     _this.height = h;
            //     _this.top = 0;
            //     _this.left = w / 2 - h / 2;
            // }
            // else if (w < h) {
            //     _this.width = w;
            //     _this.height = w;
            //     _this.left = 0;
            //     _this.top = h / 2 - w / 2;
            // }
            // else {
            //     _this.width = w;
            //     _this.height = h;
            //     _this.top = 0;
            //     _this.left = 0;
            // }
            
            // _this.$image.cropper('setCropBoxData', {
            //     top: _this.top,
            //     left: _this.left,
            //     width: _this.width,
            //     height: _this.height,
            // });
        });

        // 编辑图片
        this.$imageViewOuter.bind('click', function(){
            _this.showEditPic(this.src);
        });

        // 
        $('#editPic').on('bs-beforeSubmit', function() {
            var canvas = _this.getCanvas();
            canvas.toBlob(function(e){
                console.log(e);
                // 上传图片
            })
        
        });

    }

    /**
     * 重置
     */
    _proto.reset = function(){

        this.$fileUpload.val('');
        this.src = '';
        this.$image.css('display', 'none');
        if(this.$image.data('cropper')){
            this.$image.cropper('destroy');
        }
        // 刷新modal的位置
        editModal.getPosition();

    }

    _proto.set = function(url){
        this.src = url;
        this.$image.prop('src', url);
    }

    /**
     * 初始化Cropper
     */
    _proto.startCropper = function(){

        var _this = this;
        // 如果没有图片链接 不操作
        if(!this.src){
            throw new Error('A valid image "blob" format is required');
        }

        if(this.$image.data('cropper')){
            this.$image.cropper('destroy');
        }

        this.$image.cropper({
            aspectRatio: 1,
            preview: _this.$imageView,
        });
    }

    _proto.getCanvas = function(){

        // 返回当前canvas
        return this.$image.cropper('getCroppedCanvas');

    }

    /**
     * 打开modal
     * @param {String} url 图片链接地址
     */
    _proto.showEditPic = function (url) {
        if(url){
            this.set(url);
        }
        else {
            this.reset();
        }

        editModal.show();
    }

    window.cropperImage = new CropperImage();

})();

// 修改手机号
(function(){

    var step = new H_step('#stepPhone', {
        size: 'sm',
        list: [
            {
                step: 1,
                title: '第一步',
            },
            {
                step: 2,
                title: '第二步',
            },
            {
                step: 3,
                title: '第三步',
            }
        ]

    });

    var editModal = new H_modal('#editPhone');
    
    var EditPhone = function(){
        
        this.$step_0 = $('#step-0'); // 步骤1
        this.$step_1 = $('#step-1'); // 步骤2
        this.$step_2 = $('#step-2'); // 步骤3

        this.$btnPhone = $('#btnPhone'); // 更改按钮
        this.$phone = $('#p_modal_phone'); // 手机号
        this.$email = $('#p_modal_email'); // 邮箱
        this.$getCode0 = $('#p_modal_getCode0'); // 步骤一获取验证码
        this.$getCode1 = $('#p_modal_getCode1'); // 步骤二获取验证码
        this.$code0 = $('#p_modal_code0'); // 步骤一验证码
        this.$code1 = $('#p_modal_code1'); // 步骤二验证码
        this.$newPhone = $('#p_modal_newPhone'); // 新手机号
        this.$changeEmail = $('#change_to_email'); // 切换邮箱按钮
        this.$changePhone = $('#change_to_phone'); // 切换手机号按钮
        this.$emailWrapper = this.$changeEmail.closest('.form-group');
        this.$phoneWrapper = this.$changePhone.closest('.form-group');

        this.$next0 = $('#p_modal_next0'); // 步骤一下一步
        this.$next1 = $('#p_modal_next1'); // 步骤二下一步

        this.env = {
            index: 0, // 默认步骤1
            change: 'phone', // 默认手机号 ‘email’ 邮箱
            code0Flag: true, // 
            code1Flag: true
        }

        this.init();
        
    }

    var _proto = EditPhone.prototype;


    _proto.init = function(){

        var _this = this;

        // 绑定index 当更改
        var index = this.env.index;
        Object.defineProperty(this.env, 'index', {
            configurable: true,
            enumerable: true,
            set: function(val){
                index = val;
                _this.$step_0.hide();
                _this.$step_1.hide();
                _this.$step_2.hide();
                _this.$code0.val('');
                switch (val) {
                    case 0: {
                        _this.$step_0.show();
                        
                        step.jump(0);
                        break;
                    }
                    case 1: {
                        _this.$step_1.show();
                        step.jump(1);
                        break;
                    }
                    case 2: {
                        _this.$step_2.show();
                        step.jump(2);
                        break;
                    }
                } 
            },
            get: function(){
                return index;
            }
        });

        // 绑定change更改
        var change = this.env.change;
        Object.defineProperty(this.env, 'change', {
            configurable: true,
            enumerable: true,
            set: function(val){
                change = val;
                _this.$phoneWrapper.hide();
                _this.$emailWrapper.hide();
                switch (val) {
                    case 'phone': {
                        _this.$emailWrapper.show();
                        break;
                    }
                    case 'email': {
                        _this.$phoneWrapper.show();
                        break;
                    }
                }
            },
            get: function(){
                return change;
            }
        })
        
        // 绑定展开modal
        this.$btnPhone.bind('click', function(){
            _this.showModal();
        });

        // 绑定change变更
        this.$changeEmail.bind('click', function(){
            _this.env.change = 'email';
        });

        // 绑定index更改
        this.$changePhone.bind('click', function(){
            _this.env.change = 'phone';
        });

        // 步骤一 下一步
        this.$next0.bind('click', function(){
            // _this.env.index = 1;
            _this.sendMessage0();
        });
        
        // 步骤二 下一步
        this.$next1.bind('click', function(){
            // _this.env.index = 2;
            _this.sendMessage1();
        });

        this.$getCode0.bind('click', function(){
            _this.getCode0();
        });

        this.$getCode1.bind('click', function(){
            _this.getCode1();
        })

    }

    _proto.showModal = function(){
        this.reset();
        editModal.show();
    }

    _proto.setSendTime = function(btn, flag){

        var _this = this;
        // 已经发送过了 还在读秒
        if(!this.env[flag]){
            return;
        }
        this.env[flag] = false;
        btn.addClass('disabled');
        var t = 5;
        var s = function(){
            btn.text('重新获取('+ t +')');
        }
        var time = window.setInterval(function(){
            t--;
            s();
            if(t === 0){
                window.clearInterval(time);
                _this.env[flag] = true;
                btn.text('获取动态码');
                btn.removeClass('disabled');
                return;
            }
        }, 1000);

        s();
    }


    _proto.getCode0 = function(){
        var _this = this;
        if(!this.env.code0Flag){
            return;
        }

        this.setSendTime(this.$getCode0, 'code0Flag');

        // ajax
    }

    _proto.sendMessage0 = function(){
        // ajax
        this.env.index = 1;
    }

    _proto.getCode1 = function(){
        var _this = this;
        if(!this.env.code1Flag){
            return;
        }

        this.setSendTime(this.$getCode1, 'code1Flag');

        // ajax
    }

    _proto.sendMessage1 = function(){
        // ajax
        this.env.index = 2;
    }
    
    _proto.reset = function(){
        this.env.index = 0;
        this.env.change = 'phone';
        this.$code0.val('');
        this.$code1.val('');
    }

    window.editPhone = new EditPhone();

})();

// 修改用户名
(function(){

    var editModal = new H_modal('#editName');

    var $btnName = $('#btnName');
    var $name = $('#n_modal_name');

    $btnName.bind('click', function(){
        $name.val(ENV.userInfo.name);
        editModal.show();
    });

    $('#editName').on('bs-beforeSubmit', function() {
        // ajax
    });

})();

function render() {
    var $username = $('#username');
    var $phone = $('#phone');
    var $m_phone = $('#p_modal_phone');
    var $email = $('#email');
    var $m_email = $('#p_modal_email');
    var $avatar = $('#imageViewOuter');
    var $name = $('#name');

    var data = ENV.userInfo;
    $username.html(data.username);
    $phone.html(data.phone.substr(0, 3) + '****' + data.phone.substr(7, 4));
    $m_phone.html(data.phone.substr(0, 3) + '****' + data.phone.substr(7, 4));
    $email.html(data.email);
    $m_email.html(data.email);
    $avatar.prop('src', data.avatar);
    $name.html(data.name || '未设置');

}

function init() {
    utils.getAjax({
        type: 'GET',
        url: '/api/user/info',
        success: function(data){
            utils.setCookie('userInfo', JSON.stringify(data), true);
            ENV.userInfo = data;
            render();
        }
    })
}