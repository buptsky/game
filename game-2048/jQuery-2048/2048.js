/**
 * Created by sky on 2017/3/18.
 */
/*game对象装载和游戏相关的所有状态和相关函数；
 start->游戏启动时调用函数
 isFull->判断4*4网格是否已经被填满
 randomNum->在随机位置生成2或4，用于每次操作后的新数据填充
 canLeft,canRight,canUp,canDown->判断各个方向上是否可以进行网格移动
 getNextRight，getNextLeft，getNextDown，getNextUp->用于获取指定方向下一个位置不为0的数字
 moveLeftInRow，moveRightInRow，moveUpInCol，moveDownInCol->单行或单列的移动操作
 */
var game={
    data:[],//存储4*4网格的所有数字
    score:0,//游戏统计分数
    state:1,//游戏状态信息
    //常量命名规范：使用大写字母和下划线来组合命名，下划线用以分割单词。
    RUNNING:1,//游戏进行状态
    GAME_OVER:0,//游戏结束状态
    PLAYING:2,//动画播放状态
    start:function(){//启动游戏时调用
        //data数组用于保存4*4网格状态
        this.data=[ [0,0,0,0],
            [0,0,0,0],
            [0,0,0,0],
            [0,0,0,0] ];
        //设置初始分数和游戏状态
        this.score=0;
        this.state=this.RUNNING;
        //在随机位置生成2或4，用于游戏起始状态
        this.randomNum();
        this.randomNum();
        //更新游戏数据信息
        this.updateView();
        //隐藏游戏结束状态面板，使游戏结束后点击开始可以顺利进入下一局游戏
        $("#gameOver").css("display","none");
    },
    /*判断网格是否已经被填满，
     遍历data数组，只要发现==0即返回false，否则返回true*/
    isFull:function(){
        for(var row=0;row<4;row++){
            for(var col=0;col<4;col++){
                if(this.data[row][col]==0){
                    return false;
                }
            }
        }
        return true;
    },
    //在随机位置生成2或4
    randomNum:function(){
        if(this.isFull()){return;}//网格被占满则不生成
        /*
         随机在0到3行中生成一个行下标row
         随机在0到3列中生成一个列下标col
         如果该位置==0，随机选择2或4，放入该位置并退出循环*/
        while(true){
            // Math.random()生成0-1的随机数，将其*4并向下取整得到0-3随机数
            var row=Math.floor(Math.random()*4);
            var col=Math.floor(Math.random()*4);
            if(this.data[row][col]==0){
                this.data[row][col]=Math.random()<0.5?2:4;
                break;
            }
        }
    },

    //以下canLeft,canRight,canUp,canDown对应的函数用于移动可行性判断

    canLeft:function(){
        /*遍历每个元素（最左侧列除外），只要发现任意元素左侧数为0（网格可移动），或者当前值等于左侧值（网格可合并）则返回              true，否循环正常结束*/
        for(var row=0;row<4;row++){
            for(var col=1;col<4;col++){
                //首先该判断元素不能为0
                if(this.data[row][col]!=0){
                    if(this.data[row][col-1]==0||this.data[row][col]==this.data[row][col-1]){
                        return true;
                    }
                }
            }
        }
        return false;
    },
    canRight:function(){//判断能否右移，原理同上
        for(var row=0;row<4;row++){
            for(var col=2;col>=0;col--){
                if(this.data[row][col]!=0){
                    if(this.data[row][col+1]==0||this.data[row][col]==this.data[row][col+1]){
                        return true;
                    }
                }
            }
        }
        return false;
    },
    canUp:function(){//判断能否上移，原理同上
        for(var row=1;row<4;row++){
            for(var col=0;col<4;col++){
                if(this.data[row][col]!=0){
                    if(this.data[row-1][col]==0||this.data[row][col]==this.data[row-1][col]){
                        return true;
                    }
                }
            }
        }
        return false;
    },
    canDown:function(){//判断能否下移，原理同上
        for(var row=0;row<3;row++){
            for(var col=0;col<4;col++){
                if(this.data[row][col]!=0){
                    if(this.data[row+1][col]==0||this.data[row][col]==this.data[row+1][col]){
                        return true;
                    }
                }
            }
        }
        return false;
    },

    /*以下getNextRight，getNextLeft，getNextDown，getNextUp对应函数用于获取指定方向下一个位置不为0的数字，
     在确定相应方向可以移动的前提下，获得的不为0的数字用于进行移动操作
     */

    getNextRight:function(row,col){//用于左移判断中
        //获得当前行中，指定位置右侧第一个不为0的数的位置，不存在则返回-1
        for(var i=col+1;i<4;i++){
            if(this.data[row][i]!=0){
                return i;
            }
        }
        return -1;
    },
    getNextLeft:function(row,col){//用于右移判断中
        //获得当前行中，指定位置左侧第一个不为0的数的位置，不存在则返回-1
        for(var i=col-1;i>=0;i--){
            if(this.data[row][i]!=0){
                return i;
            }
        }
        return -1;
    },
    getNextDown:function(row,col){//用于上移判断中
        //获得当前列中，指定位置下侧第一个不为0的数的位置，不存在则返回-1
        for(var i=row+1;i<4;i++){
            if(this.data[i][col]!=0){
                return i;
            }
        }
        return -1;
    },
    getNextUp:function(row,col){//用于下移判断中
        //获得当前列中，指定位置上侧第一个不为0的数的位置，不存在则返回-1
        for(var i=row-1;i>=0;i--){
            if(this.data[i][col]!=0){
                return i;
            }
        }
        return -1;
    },

    /*moveLeftInRow，moveRightInRow，moveUpInCol，moveDownInCol为单行或单列的移动操作
     */

    moveLeftInRow:function(row){//左移一行，传入的参数为当前要移动的行号，此函数被将执行4次，从第1行开始
        /*从0位置开始到2结束遍历row行中的每个元素，获得一个下一个不为0的元素的nextCol下标
         若均为0则，判断合并：
         如果自己等于0，用下一个元素的值替换自己，将下一个元素的值设为0，col--重置列数
         如果自己等于下一个元素，将自己*2并将下一个元素设为0*/
        for(var col=0;col<=2;col++){
            var nextCol=this.getNextRight(row,col);
            //返回-1代表此元素的右侧均为0，表明此行的移动已经完毕
            if(nextCol==-1){
                break;
            }else{
                if(this.data[row][col]==0){
                    this.data[row][col]=this.data[row][nextCol];
                    this.data[row][nextCol]=0;
                    //传递待移动网格位置和移动目的地位置给动画任务，后者为目标位置
                    animation.addTask(""+row+nextCol,""+row+col);
                    /*重要，列位置减少的目的是要在下一次循环增加后保持比较位置不变，只有左侧网格无法再叠加之后才能进行下                         一个位置的比较，因此空位置网格至少需要两次比较操作*/
                    col--;
                }else if(this.data[row][col]==this.data[row][nextCol]){
                    this.data[row][col]*=2;
                    this.score+=this.data[row][col];//相加网格块的值即为所得分数
                    this.data[row][nextCol]=0;
                    animation.addTask(""+row+nextCol,""+row+col);
                }
            }
        }
    },
    moveRightInRow:function(row){//右移当前行
        //从右向左遍历检查，（最左边元素除外），原理同上
        for(var col=3;col>0;col--){
            var nextCol=this.getNextLeft(row,col);
            if(nextCol==-1){
                break;
            }else{
                if(this.data[row][col]==0){
                    this.data[row][col]=this.data[row][nextCol];
                    this.data[row][nextCol]=0;
                    animation.addTask(""+row+nextCol,""+row+col);
                    col++;
                }else if(this.data[row][col]==this.data[row][nextCol]){
                    this.data[row][col]*=2;
                    this.score+=this.data[row][col];
                    this.data[row][nextCol]=0;
                    animation.addTask(""+row+nextCol,""+row+col);
                }
            }
        }
    },
    moveUpInCol:function(col){//上移当前列
        //从上向下遍历检查，（最下边元素除外），原理同上
        for(var row=0;row<3;row++){
            var nextRow=this.getNextDown(row,col);
            if(nextRow==-1){
                break;
            }else{
                if(this.data[row][col]==0){
                    this.data[row][col]=this.data[nextRow][col];
                    this.data[nextRow][col]=0;
                    animation.addTask(""+nextRow+col,""+row+col);
                    row--;
                }else if(this.data[row][col]==this.data[nextRow][col]){
                    this.data[row][col]*=2;
                    this.score+=this.data[row][col];
                    this.data[nextRow][col]=0;
                    animation.addTask(""+nextRow+col,""+row+col);
                }
            }
        }
    },
    moveDownInCol:function(col){//下移当前列
        /*从下向上遍历检查，（最上边元素除外），原理同上*/
        for(var row=3;row>0;row--){
            var nextRow=this.getNextUp(row,col);
            if(nextRow==-1){
                break;
            }else{
                if(this.data[row][col]==0){
                    this.data[row][col]=this.data[nextRow][col];
                    this.data[nextRow][col]=0;
                    animation.addTask(""+nextRow+col,""+row+col);
                    row++;
                }else if(this.data[row][col]==this.data[nextRow][col]){
                    this.data[row][col]*=2;
                    this.score+=this.data[row][col];
                    this.data[nextRow][col]=0;
                    animation.addTask(""+nextRow+col,""+row+col);
                }
            }
        }
    },

    /* moveLeft, moveRight,moveUp,moveDown在指定方向上移动所以行或列
     */

    moveLeft:function(){//左移所有行
        if(this.canLeft()){//判断能否左移
            for(var row=0;row<4;row++){
                this.moveLeftInRow(row);//拆解为每一行分别进行左移
            }
            this.state=this.PLAYING;//当前状态进入动画播放状态，此时不能按键继续下一次操作
            animation.start();
        }
    },
    moveRight:function(){//向右移动所有行
        if(this.canRight()){//判断能否右移
            for(var row=0;row<4;row++){
                this.moveRightInRow(row);
            }
            this.state=this.PLAYING;
            animation.start();
        }
    },
    moveUp:function(){
        if(this.canUp()){//先判断能否上移
            for(var col=0;col<4;col++){
                this.moveUpInCol(col);
            }
            this.state=this.PLAYING;
            animation.start();
        }
    },
    moveDown:function(){//向下移动所有行
        if(this.canDown()){
            for(var col=0;col<4;col++){
                this.moveDownInCol(col);
            }
            this.state=this.PLAYING;
            animation.start();
        }
    },

    //判断游戏是否结束

    isGameOver:function(){
        //网格未被填满，不需要继续检查
        if(!this.isFull()){return false;}
        //此时网格已满，需检查相邻网格是否可以叠加，无法叠加则返回游戏结束标志
        for(var row=0;row<4;row++){
            for(var col=0;col<4;col++){
                if(col<3){//检查右侧相邻，不符合则表示左右无法移动
                    if(this.data[row][col]==this.data[row][col+1]){
                        return false;
                    }
                }
                if(row<3){//检查下方相邻，不符合则表示上下无法移动
                    if(this.data[row][col]==this.data[row+1][col]){
                        return false;
                    }
                }
            }
        }
        //所有网格均无法移动，返回游戏结束标志
        return true;
    },

    //更新游戏信息数据

    updateView:function(){
        //更新网格信息数据
        for(var row=0;row<4;row++){
            for(var col=0;col<4;col++){
                //获取到当前元素并更改网格数值，如果当前值==0，就放入“”（在网格中不显示），否则放入当前值
                $("#c"+row+col).html(this.data[row][col]==0?"":this.data[row][col]);
                //更改网格颜色，如果当前值==0，className=“cell”，否则className=“cell n”+当前值
                $("#c"+row+col).attr("class",this.data[row][col]==0?"cell":"cell n"+this.data[row][col]);
            }
        }
        //更新游戏分数
        $("#score").html(this.score);
        //判断游戏是否结束
        if(this.isGameOver()){
            this.state=this.GAME_OVER;//游戏状态设置为结束状态
            $("#gameOver").show();//显示游戏结束面板
            $("#finalScore").html(this.score);//显示最终得分
        }
    }

}
//jQuery入口函数
$(function(){
    game.start();
    $(document).on("keydown",function (event) {
        console.log(1);
        if(game.state!=game.PLAYING) {
            if (game.state == game.RUNNING) {
                if (event.keyCode == 37) {
                    game.moveLeft();
                } else if (event.keyCode == 39) {
                    game.moveRight();
                }
                else if (event.keyCode == 38) {
                    game.moveUp();
                }
                else if (event.keyCode == 40) {
                    game.moveDown();
                }
            } else if (event.keyCode == 13) {//只有游戏结束时按下回车键才有用
                game.start();
            }
        }
    });
    $(".test").on("click",function () {
        console.log(333);
        $("#c"+00).css("left","100px");
    })
})
//用于存储运动元素的自身信息
function Task(obj,topLocation,leftLocation){
    this.obj=obj;
    this.topLocation=topLocation;
    this.leftLocation=leftLocation;
}
var animation={
        tasks:[],//保存每次需要移动的任务
        //获取移动元素的位置信息及运动信息并装入任务数组
        addTask:function(source,target){
            console.log(source,target);
            var sourceDiv = $("#c"+source);
            var targetDiv = $("#c"+target);
            //获取元素样式
            var topLocation=targetDiv.css("top");
            var leftLocation=targetDiv.css("left");
            var task=new Task(sourceDiv,topLocation,leftLocation);
            this.tasks.push(task);//将包含运动信息的task对象装入运动任务数组
        },
        start:function () {
            console.log(2);
            for(var i=0;i<animation.tasks.length;i++) {
                $(animation.tasks[i].obj).animate({
                    top: animation.tasks[i].topLocation,
                    left: animation.tasks[i].leftLocation
                },200,function () {
                    game.updateView();//更新游戏状态信息
                    //console.log(111);
                    for(var i = 0;i < 4;i++){
                        for(var j = 0;j < 4;j++){
                            $("#c"+i+j).css({
                                "left":"",
                                "top":""
                                });
                            }
                        }
                    }
                );
            }
            animation.tasks=[];
            game.randomNum();//产生新的随机位置随机数
            game.state = game.RUNNING;
        }
    }