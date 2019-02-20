(function(){

    var requireURL = {
        create: '/api/user/create',
        sendSMSVerification: '/api/user/sendSMSVerification',
    }

    var env = {
        sendFlag: true,
    }

    var $msgBtnTxt = $('#msgBtnTxt');
    var $form = $('#form');
    var alertBox = new AlertBox('#alertBox');

    $form.formValidateData({
        fields: {
            phone: function(val){
                if(utils.isTypeOf(val, 'isPhone')){
                    alertBox.hide();
                    return true;
                }
                else {
                    alertBox.change('error', '请填写有效的手机号！');
                    return false;
                }
            },

            code: function(val){
                if(utils.isTypeOf(val, 'noEmpty')){
                    alertBox.hide();
                    return true;
                }
                else {
                    alertBox.change('error', '请填写验证码！');
                    return false;
                }
            },

            pwd: function(val){
                if(utils.isTypeOf(val, 'isPwd')){
                    alertBox.hide();
                    return true;
                }
                else {
                    alertBox.change('error', '请输入6-20个字母、数字、下划线密码！');
                    return false;
                }
            },
            username: function(val){
                if(utils.isTypeOf(val, 'isUsername')){
                    alertBox.hide();
                    return true;
                }
                else {
                    alertBox.change('error', '请输入字母开头，4-16位的密码！');
                    return false;
                }
            },

            email: function(val){
                if(utils.isTypeOf(val, 'isEmail')){
                    alertBox.hide();
                    return true;
                }
                else {
                    alertBox.change('error', '请填写一个有效的邮箱！');
                    return false;
                }
            },

            'confirm-pwd': function(val){
                if($form.find('[name=pwd]').val() == val){
                    alertBox.hide();
                    return true;
                }
                else {
                    alertBox.change('error', '两次输入密码不一致,请重新输入！');
                    return false;
                }

            }
        },

        submitHandler: {
            field: '#loginSubmit',
            callback: function(flag, data){
                delete data['confirm-pwd'];
                if(flag){
                    utils.getAjax({
                        type: 'POST',
                        data: data,
                        url: requireURL.create,
                        success: function(data){
                            alertBox.change('success', '注册成功，2秒后跳转完善个人信息！');
                            utils.setCookie('userInfo', JSON.stringify(data), true);
                            window.setTimeout(function(){
                                window.location.href = '/base/baseInfo/'
                            }, 2000);
                        },
                        error: function(err){
                            alertBox.change('error', '服务器错误，请稍后再试！')
                        }
                    })
                }
            }
        }

    })

    var setSendTime = function(){
        // 已经发送过了 还在读秒
        if(!env.sendFlag){
            return;
        }
        env.sendFlag = false;
        $msgBtnTxt.addClass('disabled');
        var t = 5;
        var s = function(){
            $msgBtnTxt.text('重新获取('+ t +')');
        }
        var time = window.setInterval(function(){
            t--;
            s();
            if(t === 0){
                window.clearInterval(time);
                env.sendFlag = true;
                $msgBtnTxt.text('获取动态码');
                $msgBtnTxt.removeClass('disabled');
                return;
            }
        }, 1000);

        s();
    }
    
    $msgBtnTxt.bind('click', function(){
        // 已经发送过了 还在读秒
        if(!env.sendFlag){
            return;
        } 

        var phone = $form.find('[name=phone]').val();
        if(!phone || !reg.phone.test(phone)){
            alertBox.change('error', '请填写正确的手机号!')
            return;
        }
        else {
            setSendTime();
            alertBox.hide();
        }

        utils.getAjax({
            type: 'GET',
            url: requireURL.sendSMSVerification,
            data: {phone: phone},
            success: function(result){
                console.log(result);
            },
            error: function(err){
                alertBox.change('error', '服务器错误，请稍后再试！')
            }
        })

    });
})();