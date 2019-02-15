// var picModal = new H_modal('#editPhone');
// var picModal2 = new H_modal('#editEmail');
// var picModal3 = new H_modal('#editName');
// var pic = new H_modal('#editPic2');
// var step = new H_step('#stepPhone', {
//     size: 'sm',
//     list: [
//         {
//             step: 1,
//             title: '第一步',
//         },
//         {
//             step: 2,
//             title: '第二步',
//         },
//         {
//             step: 3,
//             title: '第二步',
//         }
//     ],
//     callback: function(index, status){ console.log(index, status); }
// });
// var step2 = new H_step('#stepEmail', {
//     size: 'sm',
//     list: [
//         {
//             step: 1,
//             title: '第一步',
//         },
//         {
//             step: 2,
//             title: '第二步',
//         },
//         {
//             step: 3,
//             title: '第二步',
//         }
//     ],
//     callback: function(index, status){ console.log(index, status); }
// })
// picModal.on('bs-beforeSubmit', function(){
//     console.log(1);
// })
// $('#image').cropper({
//     aspectRatio: 1,
//     crop: function(e){
//         console.log(e);
//     }
// })
// new Cropper(document.getElementById('#image'), {
//     aspectRatio: 1,
//     crop: function(e){
//         console.log(e);
//     }
// })

(function(){


    var CropperImage = function(){

        this.src = '';

        this.left = 0;
        this.top = 0;
        this.width = 0;
        this.height = 0;

        this.$image = $('#image');
        this.$fileUpload = $('#fileUpload');
        this.$imageView = $('.image-view');

        this.init();
    }

    var _proto = CropperImage.prototype;

    _proto.init = function(){

        var _this = this;
        // 绑定图片onload事件 获取到初始宽度高度
        this.$image.bind('load', function(){
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
            editPic.getPosition();
            // 获取图片的大小 让选中区域选中整个图片
            var position = _this.$image.cropper('getCanvasData');
            var w = position.width;
            var h = position.height;
            if (w > h) {
                _this.width = h;
                _this.height = h;
                _this.top = 0;
                _this.left = w / 2 - h / 2;
            }
            else if (w < h) {
                _this.width = w;
                _this.height = w;
                _this.left = 0;
                _this.top = h / 2 - w / 2;
            }
            else {
                _this.width = w;
                _this.height = h;
                _this.top = 0;
                _this.left = 0;
            }
            
            _this.$image.cropper('setCropBoxData', {
                top: _this.top,
                left: _this.left,
                width: _this.width,
                height: _this.height,
            });
        })

    }

    /**
     * 重置
     */
    _proto.reset = function(){

        this.$fileUpload.val('');
        this.src = '';

        if(this.$image.data('cropper')){
            this.$image.cropper('destroy');
        }

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

    new CropperImage()

})()

// var image = $('#image');
// var fileUpload = $('#fileUpload');
// var imageViewLg = $('#imageViewLg');
// var imageViewSm = $('#imageViewSm');
// var imageViewXs = $('#imageViewXs');


// image.bind('load', function(){
//     console.log(1)
//     editPic.getPosition();
// })



var editPic = new H_modal('#editPic');

// fileUpload.bind('change', function(e){
//     if(image.data('cropper')){
//         image.cropper('destroy');
//     }
//     var file = this.files[0];
//     var url = window.URL.createObjectURL(file);
//     image.prop('src', url);

//     image.cropper({
//         aspectRatio: 1,
//         crop: function(e){
//             console.log(e);
//         }
//     });
// });






