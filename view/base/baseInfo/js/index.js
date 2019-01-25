var picModal = new H_modal('#editPhone');
var picModal2 = new H_modal('#editEmail');
var picModal3 = new H_modal('#editName');
var step = new H_step('#stepPhone', {
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
            title: '第二步',
        }
    ],
    callback: function(index, status){ console.log(index, status); }
});
var step2 = new H_step('#stepEmail', {
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
            title: '第二步',
        }
    ],
    callback: function(index, status){ console.log(index, status); }
})
picModal.on('bs-beforeSubmit', function(){
    console.log(1);
})