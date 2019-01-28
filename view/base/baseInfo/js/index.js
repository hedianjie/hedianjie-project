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

// class A {
//     constructor () {
//         this.x = 1;
//         this.y = 2;
//     }

//     aPoint () {
//         this.x = this.x + '.0';
//         this.y = this.y + '.0';
//     }
// }

// class B extends A {
//     constructor () {
//         super();
//         this.a = 11;
//         this.b = 22;
//     }

//     bPoint() {
//         this.a = this.a + '.0';
//         this.b = this.b + '.0';
//     }
// }
// var A = function(){
//     this.x =1;
//     this.y = 1;
// }
// A.prototype.aPoint = function(){
//     this.x = this.x + '.0';
//     this.y = this.y + '.0';
// }

// var F = function(){};
// F.prototype = A.prototype;

// var B = function(){
//     A.call(this);
//     this.a = 11;
//     this.b = 22;
// }
// B.prototype = new F();
// B.constructor = B;

// B.prototype.bPoint = function() {
//     this.a = this.a + '.0';
//     this.b = this.b + '.0';
//     console.log(this.aPoint)
// }