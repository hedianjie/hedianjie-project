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
                    alertBox.change('error', '请6-20个字母、数字、下划线密码！');
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
                            console.log(data);
                        },
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

        setSendTime();

        var phone = $form.find('[name=phone]').val();
        if(!phone || !reg.phone.test(phone)){
            alertBox.change('error', '请填写正确的手机号!')
            return;
        }

        utils.getAjax({
            type: 'GET',
            url: requireURL.sendSMSVerification,
            data: {phone: phone},
            success: function(data){
                console.log(data);
            }
        })

    });
})();