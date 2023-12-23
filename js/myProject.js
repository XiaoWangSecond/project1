const canvas = document.getElementById("myCanvas")
//console.log(canvas);
// 设置绘图
let ctx = canvas.getContext("2d")
//console.log(ctx);
//设置格子
//行
const rows = 10
//列
const cols = 8
//格子大小
const brickwidth = 50;

//定义图片数组
let coinImages = document.querySelectorAll(".treasures img")
//console.log(coinImages);


//定义历史记录显示对象
let historyView = document.getElementById('recordItem');

//已经实现的功能 开始和结束  随机关卡 能够进行 上下左右移动  
//在遇到障碍物时能够判断并且不能移动到障碍物  拆弹功能已经实现 能够 实现本地存储 从而显示游戏记录

let boy = new Array();

let boom = new Array()
//测试炸弹总数
let totalBoom = 0

// 定义成绩显示
let scoreView = document.getElementById("score")
//总得分
let totalScore

//定义计时显示
let timeView = document.getElementById('timer');

let timer = null;
let time = 0;
let interval = 100;

//存储已拆除的炸弹的位置
let boomed = new Array()
//初始化格子
function init() {

    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            ctx.rect(j * brickwidth, i * brickwidth, brickwidth, brickwidth)
            ctx.StrokeStyle = "black"
            ctx.stroke();
        }
    }
    boy = genboy();
    //console.log(boy);
}
function start() {
    //游戏开始后不能点击 开始按钮

    document.getElementById('startBtn').disabled = true;

    //重新设置初始化
    totalScore = 0
    totalBoom = 0
    boy.col = 0
    boy.row = 9
    //随机生成障碍物和炸弹的位置（对应某个格子）
    for (let i = 0; i < rows; i++) {
        boom[i] = genBoom(i);
        //不让炸弹和障碍物在人物上
        if (i == 9 && boom[i].col == 0) {
            //console.log(boom[i].col);
            boom[i].col = 5

        }
        //不让 障碍物 堵住人物
        if (i == 9 && boom[i].col == 1 && boom[i - 1].col == 0) {
            //console.log(boom[i].col);
            boom[i].col = 3
        }
        //console.log(boom[i]);
    }
    let sum = 0
    for (let i in boom) {
        if (boom[i].sign == 1) {
            sum = 1;
        }
    }
    if (sum != 1) {
        boom[2].sign = 1;
        boom[2].img = coinImages[1]
    }



    drawinterface();
    keyboard()
    //启动计时器
    time = 0;
    timer = setInterval(refresh, interval)
}


// //定义道具的对象
function genBoom(i) {
    let imag = Math.floor(Math.random() * 3)
    return {
        row: i,
        col: Math.floor(Math.random() * (cols - 1)),
        sign: imag, //sign 道具类别的标志
        img: coinImages[imag],
        cnt: 0,   //判断炸弹是否已经被拆除
    }
}

//定义拆弹员
function genboy() {
    return {
        row: 9,
        col: 0,
        img: coinImages[3],
    }
}

//绘制关卡
function drawinterface() {
    clearBricks()
    //绘制炸弹和障碍物
    totalBoom = 0;
    for (let i = 0; i < rows; i++) {
        if (boom[i] !== null) {
            let myboom = boom[i];
            if (myboom.cnt == 0) {
                //判断是否是炸弹
                if (myboom.img.attributes[0].value == "../img/boom.png") {
                    //console.log(myboom);
                    totalBoom++;
                }
                ctx.drawImage(myboom.img, myboom.col * brickwidth, myboom.row * brickwidth, brickwidth, brickwidth)
            }

        }
    }
    //绘制起点的人物
    ctx.drawImage(boy.img, boy.col * brickwidth, boy.row * brickwidth, brickwidth, brickwidth)
}

//关闭关卡
function stop() {
    document.getElementById('startBtn').disabled = false;
    //清空格子
    clearBricks();
    clearInterval(timer);
    totalScore = 0
    scoreView.innerHTML = '0';
    timeView.innerHTML = '0';

}
//清空格子
function clearBricks() {
    for (let i = 0; i < rows; i++) {
        for (let j = 0; j < cols; j++) {
            ctx.clearRect(j * brickwidth + 1, i * brickwidth + 1, brickwidth - 2, brickwidth - 2)
        }
    }

}

//移动拆弹员
//键盘事件处理
function keyboard() {
    document.onkeydown = function (e) {
        if (e.keyCode === 37) //左
            if (boy.col != 0) {
                boy.col--;
                findNext(boy, e.keyCode)
                //drawinterface()
            }
        if (e.keyCode === 39) //右
            if (boy.col != 7) {
                boy.col++;

                //drawinterface()
                findNext(boy, e.keyCode)
            }

        if (e.keyCode === 38) //上
            if (boy.row != 0) {
                boy.row--;
                findNext(boy, e.keyCode)
            }

        if (e.keyCode === 40) //下
            if (boy.row != 9) {
                boy.row++;
                findNext(boy, e.keyCode)
            }
        if (e.keyCode === 69) //按下拆弹键E
            remove()
    }
}


//判断下一步是走到什么地方 障碍物就不能走
function findNext(myboy, keyCode) {
    for (let i = 0; i < rows; i++) {
        if (myboy.row == i && myboy.col == boom[i].col && boom[i].sign == 0) {
            if (keyCode == 37)
                myboy.col++;
            if (keyCode == 39)
                myboy.col--;
            if (keyCode == 38)
                myboy.row++;
            if (keyCode == 40)
                myboy.row--;
        }
    }
    drawinterface()
}

//拆弹事件
function remove() {
    for (let i in boom) {
        if (boom[i].row == boy.row && boom[i].col == boy.col && boom[i].sign == 1 && boom[i].cnt == 0) {
            boom[i].cnt = 1;
            totalScore++;
            scoreView.innerHTML = totalScore
            drawinterface()
            if (totalBoom == 0) {
                clearInterval(timer);
                alert('炸弹已经拆除完毕')
                //游戏记录
                let dateTime = new Date();
                let dtStr = dateTime.toLocaleString();
                let successPrefix = '<label style="color: green">游戏成功';
                let itemStr = successPrefix + dtStr +
                    '，耗时 ' + time / 1000 + ' 秒 ' + '得分 ' + totalScore + '分' + '</label>';
                // localStorage本地存储
                let storage = window.localStorage
                if (typeof (storage) == 'undefined') {
                    alert("浏览器不支持LocalStorge")

                    //直接写在页面上
                    let span = document.createElement('span')
                    span.innerHTML = itemStr
                    document.getElementById('recordItem').append(span);

                } else {
                    historyStore(itemStr);
                    historyView.innerHTML = storage.getItem('historyList');
                }
            }
            break;
        }
    }
}


//定义刷新
function refresh() {
    time += interval;
    timeView.innerHTML = time / 1000;
}

//历史记录
function historyStore(info) {
    let storage = window.localStorage
    let history = ''
    if (storage.getItem("historyList") == null) {
        storage.setItem("historyList", info)

    } else {
        history = storage.getItem("historyList") + '<br />'
        history = history + info;
        storage.setItem('historyList', history);
    }
}

//清除历史记录
function clearHistory() {
    historyView.innerHTML = '';
    if (!window.localStorage) {
        alert('浏览器不支持LocalStorge！');
        return;
    } else {
        window.localStorage.removeItem('historyList');
    }
}