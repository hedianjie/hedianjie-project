var step = new H_step('#stepPhone', {
    list: [
        {
            step: 1,
            title: '第一步',
            description: '备注备注备注备注备注备注'
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