(function(){

    var requireURL = {
        login: '/api/user/login'
    }

    var alertBox = new AlertBox('#alertBox');
    var $form = $('#form');

    $form.formValidateData({
        fields: {
            field: function(val){
                if(utils.isTypeOf(val, 'noEmpty')){
                    alertBox.hide();
                    return true;
                }
                else {
                    alertBox.change('error', '请填写用户名、手机号或邮箱！');
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
        },

        submitHandler: {
            field: '#loginSubmit',
            callback: function(flag, data){
                if(flag) {
                    utils.getAjax({
                        type: 'POST',
                        data: data,
                        url: requireURL.login,
                        success: function(result){
                            alertBox.change('success', '登录成功！');
                            utils.setCookie('userInfo', JSON.stringify(result), true);
                            window.location.href = '/home'
                        },
                        error: function(err){
                            alertBox.change('error', '服务器错误，请稍后再试！')
                        }
                    })
                }
            }
        }

    })

})();