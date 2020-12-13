 // 所有的游戏都是在点击start才开始
    // 获取到开始按钮
    var startBtn = document.querySelector("#start");
    // head
    var head = document.querySelector("#head");

    var ductWrap = document.querySelector("#ductWrap");
    // 获取小鸟元素
    var bird = document.querySelector("#bird");

    // 创建管道定时器
    var creatDuctTimer = null;

    // 是否删除管道移动定时器
    var isDelTimer = false;

    // 获取分数
    var score = document.querySelector(".scoring");

    // 获取游戏结束画面
    var gameover = document.querySelector("#gameover");

    // 获取音频标签
    var audio = document.querySelector("audio");
    // js  点击事件 onclick
    startBtn.onclick = function () {
        // 页面中初始的head/鸟/start图片消失
        // 隐藏开始按钮和head
        head.style.display = "none";
        // parentNode 获取当前元素的父元素
        this.parentNode.style.display = "none";
        // 小鸟出现
        bird.style.display = "block";
        // 设置小鸟的飞翔速度,给小鸟speed 初始值为0，通过定时器让小鸟速度每个0.3s加0.5
        bird.speed = 0;
        // 小鸟的飞翔
        bird.moveTimer = setInterval(function () {
            // speed值每个0.3s加0.5
            bird.speed += 0.5;
            // 递增值默认向下飞翔  值为负数代表向上飞翔
            // 小鸟为上升状态是 显示向上图片
            if (bird.speed <= 0) {
                bird.children[0].src = "img/up_bird0.png";
            } else {
                bird.children[0].src = "img/down_bird1.png";
            }
            // 小鸟飞翔的区域及状态  小鸟位置相对于画面顶部没有距离时，不再飞翔  距
            // 离底部没有距离时，游戏结束 管道移动停止
            // offsetTop 小鸟距离游戏画面顶部的偏移值
            if (bird.offsetTop <= 0) {
                bird.style.top = "0px";
            } else if (bird.offsetTop >= 394) {
                bird.style.top = "394px";
                // 游戏结束 小鸟不在移动 清除小鸟移动定时器
                clearInterval(bird.moveTimer);
                // 清除管道创建定时器
                clearInterval(creatDuctTimer);
                // 清除管道移动定时器
                isDelTimer = true;
                // 4 出现游戏结束画面
                gameover.style.display = "block";
                // 6 添加游戏结束音频
                audio.src="game_over.mp3";
            }
            // 小鸟在画面中的高度
            bird.style.top = bird.offsetTop + bird.speed + "px";
            
            // 小鸟碰撞检测
            // 获取到上下管道元素
            var ductRow = document.querySelectorAll(".duct_row");
            // 管道不断循环的 只要管道出现 则判断碰撞检测
            for(var i = 0; i < ductRow.length; i++){
                var isCarsh = CrashFn(bird,ductRow[i]);
                if(isCarsh == true){
                    // 游戏结束
                    // 1 清除小鸟移动
                    clearInterval(bird.moveTimer);
                    // 2 清除管道创建
                    clearInterval(creatDuctTimer);
                    // 3 清除管道移动
                    isDelTimer = true;
                    // 4 出现游戏结束画面
                    gameover.style.display = "block";
                    // 5 添加小鸟坠地的样式
                    bird.className ="die";
                    // 6 添加游戏结束音频
                    audio.src="game_over.mp3";
                }
            }
        }, 30);
        // 小鸟向上移动
        // onmousedown 鼠标按下状态   事件对象  event 
        document.onmousedown = function (e) {
            // 阻止鼠标点击时会出现的默认事件
            var ev = e || window.event;
            event.preventDefault();
            // speed  负数就代表小鸟上升
            bird.speed = -5;
            // 设置小鸟上升的音乐
            audio.src="bullet.mp3";
        }
        // 随机函数  用来随机产生管道的高度  最大值和最小值的随机整数
        function randFn(min, max) {
            // parseInt 向下取整
            return parseInt(Math.random() * (max - min + 1) + min);
        }
        // 创建管道 在点击开始按钮之前，通过计时器创建  每隔三秒在页面中产生一根管道
        creatDuctTimer = setInterval(function () {
            // createElement 创建li元素 创建每一根管道
            var duct = document.createElement("li");
            // 上半截管道的高度
            var upHeight = randFn(60, 240);
            // 下半截管道的高度   100是管道间固定间距
            var downHeight = 432 - upHeight - 100;
            duct.innerHTML = '<div class="duct_up duct_row" style="height:' + upHeight + 'px"><img src="img/up_pipe.png"></div><div class="duct_down duct_row" style="height: ' + downHeight + 'px"><img src="img/down_pipe.png"></div>';
            // 定义柱子出现的初始位置
            duct.l = 300;
            // 给管道添加Bol 用来判断是否加分
            duct.scoreBol = true;

            // 管道的移动 通过循环定时器设置使管道的left值不断递减实现管道从右往左持续的移动
            duct.moveTimer = setInterval(function () {
                // 每隔30ms向左位移3px
                duct.l -= 3;
                duct.style.left = duct.l + "px";

                // 判断当管道移出到游戏画面以外时，清除管道 停止管道的移动
                // 当小鸟通过柱子时 分数+1
                if (duct.l <= -62) {
                    // 删除元素   清除ductWrap里面的duct
                    ductWrap.removeChild(duct);
                    clearInterval(duct.moveTimer);
                    // 当管道距离左边-31px时，代表小鸟通过
                } else if (duct.l <= -31) {
                    if (duct.scoreBol == true) {
                        // 分数+1
                        score.innerHTML = parseInt(score.innerHTML) + 1;
                    }
                    duct.scoreBol = false;
                }
                // 如果isDelTimer == true 就要做清除处理
                if (isDelTimer == true) {
                    clearInterval(duct.moveTimer)
                }
            }, 30)
            // 将创建的管道添加到外层的ul中  
            ductWrap.appendChild(duct);
        }, 3000)

        // 定义一个碰撞检测的方法
        // 获取到小鸟元素位置 以及 管道位置   obj1小鸟   obj2管道
        function CrashFn(obj1,obj2){
            // 获取小鸟左边距离页面的偏移值
            var obj1Left = obj1.offsetLeft;
            // 获取整个小鸟在页面中水平方向的位置  左侧距离+自身宽度
            var obj1Right = obj1Left + obj1.offsetWidth;
            // 获取小鸟顶部距离页面的偏移值
            var obj1Top = obj1.offsetTop;
            // 获取整个小鸟在页面中垂直方向的位置  顶部距离+自身高度
            var obj1Bottom = obj1Top + obj1.offsetHeight;
            // 获取管道距离页面左侧偏移值
            var obj2Left = obj2.parentNode.offsetLeft;
            var obj2Right = obj2Left + obj2.offsetWidth;
            var obj2Top = obj2.offsetTop;
            var obj2Bottom = obj2Top + obj2.offsetHeight;
            // 1: obj1的右边 大于等于 obj2的左边
            // 2：obj1的下边 大于等于 obj2的上边
            // 3：obj1的左边 小于等于 obj2的右边
            // 4: obj1的上边 小于等于 obj2的下边 
            // 满足以上四个条件 我们可以判断当前发生了碰撞  
            if(obj1Right >= obj2Left && obj1Bottom >= obj2Top && obj1Left <= obj2Right && obj1Top <= obj2Bottom){
                // 碰撞发生  游戏结束
                return true;
                // true 代表游戏结束
            }else{
                // 碰撞没有发生 游戏继续
                return false;
            }
        }
    }