// var ddd={};

// (function(golbal){

//     var aaaa = 1;
//     var bbbb = 2;

//     //声明到全局：
//     var g = golbal;
//     g["ccc"] = {
//         a:aaaa,
//         b:bbbb
//     }
// })(ddd);

// // var g = globalThis;
// console.log("测试简单导出222：",ddd.ccc,window["ddd"]);

//随便添加点测试方法进去
//添加一些测试用的方法：

/**
 * 检测卡牌的配置
 */
window.checkCardsOpt = function (fieldName,isshowUndefined) {
    for (let i in lib.card) {
        let info = lib.card[i];
        if (!info) return "不存在该配置"
        if (!isshowUndefined && info[fieldName] === undefined) continue;
        console.log(i, ":", info[fieldName], ";类型：", info.type, "|子类型：", info.subtype);
    }
}
/**
 * 检测技能skill的配置
 */
window.checkSkillsOpt = function (fieldName,isshowUndefined) {
    for (let i in lib.skill) {
        let info = lib.skill[i];
        if (!info) return "不存在该配置"
        if (!isshowUndefined && info[fieldName] === undefined) continue;
        console.log(i, ":", info[fieldName]);
    }
}

/**
 * 是否显示自定义日志
 */
var isShowLog = true;
/**
 * 自定义一些log，需要自己手动写入源代码中执行
 */
window.testLog = function (type, name) {
    if (!isShowLog) return;
    let startTime = new Date().toLocaleString();
    let name2 = "";
    let body = "";
    let rest = Array.prototype.splice.call(arguments, 2);
    let body2 = "";
    if (rest && rest.length > 0) {
        body2 = rest.join(",");
    }
    //添加一个测试用日志，用来记录trigger触发：
    switch (type) {
        case 0:
            name2 = "Event";
            body = `创建事件${name}`;
            break;
        case 1:
            name2 = "EventEnd";
            body = `事件结束${name}`;
            break;
        case 2:
            name2 = "Trigger";
            body = `触发名${name}`;
            break;
        case 3:
            name2 = "TriggerList";
            body = `${name}触发列表`;
            break;
        case 4:
            name2 = "EventStart";
            body = `开始事件${name}`;
            break;
        case 5:
            name2 = "PhaseLoop";
            body = `${name}的回合开始`;
            break;
    }
    console.log(`【${name2}】${startTime}：[${body}]->${body2};`);
}
/*
添加流程调试代码：(自己手动添加)
第一部分：phaseLoop（打印当前回合开始）
phaseLoop:function(){
    "step 0"
    window.testLog(5,player.name,`别名：${player.name2}`)

第二部分：trigger:function（打印触发事件名）
var event=this;
window.testLog(2,name,`事件名:${event.name}`)
var start=event.player||game.me||game.players[0];

第三部分：trigger:function（打印当前触发事件的筛选出待触发技能）【核心】
list.sort(function(a,b){
    return b[2]-a[2];
});
window.testLog(3,name,`执行trigger事件名:${event.name}`,`收集技能:${list.toString()}`)

第四部分：createEvent（打印正在创建事件，并且打印当前运行中的事件）
(triggerevent||_status.event).next.push(next);
window.testLog(0,name,`当前运行中事件:${_status.event?_status.event.name:"null"}`)
return next;

第五部分：game.loop（打印当前事件队列中，进入下一个事件，打印父节点）
        next.player.skipList.remove(next.name);
    }
    else{
        next.parent=event;
        _status.event=next;
        window.testLog(4,next.name,`设置父节点:${next.parent.name}`)
    }
}

第六部分：game.loop（打印当前事件完成已完成，主动权回溯父节点）
在event.finished中：
else{
    window.testLog(1,event.name,`父节点:${event.parent?event.parent.name:"null"}`)
    if(event.parent){
        if(event.result){
            event.parent._result=event.result;
        }
        _status.event=event.parent;
    }
    ......
}
*/

window.gameTestLog = function(){
    let curEvent = (_status && _status.event)||{name:"loop未启动",step:0};
    // console.log.call(null, [`【${curEvent.name}】 step:${curEvent.step} 的”${arguments[0]}“log:`, Array.prototype.splice.call(arguments, 1)]);
    // let logStr = `【${curEvent.name}】 step:${curEvent.step} 的”${arguments[0]}“log:`;
    // let parames = (Array.prototype.splice.call(arguments, 1)).unshift(logStr);
    arguments[0] = `【${curEvent.name}】step${curEvent.step} 的”${arguments[0]}“log:`;
    console.log.apply(null, arguments);
}


/**
 * 方便扩展自己的扩展（动态加载进去，方便测试，后期可能把扩展包分离）
 * 自己的扩展，指的是，编译再build/exsrc文件夹内的扩展；
 * 
 * 直接整合进config.js:
 * loadSelfExtensionConfig:["ZJ联盟杀"],//"加载测试扩展"【直接整合进来】
 * 
 * 还需要：
 * source.js：
 * 'build/exsrc/ZJ联盟杀/extension.js',
 * 
 * update.js：
 * 'build/exsrc/ZJ联盟杀/extension.js',
 * 
 * 注：添加扩展需知：第一次加载的扩展，是没有生效的，需要重启一次再生效；
 */
window.loadSelfExtensionConfig = ["ZJ联盟杀","十六人扩展精简版"];//,"加载测试扩展"
//以后将全部移植到extension中，走正式加载流程，毕竟有css，jpg，它们默认的相对路径都在那里
//正式加载的，都是别人完整的扩展，即extension/ 里面的扩展
window.loadExtensionConfig = ["代码搜索器","武将搜索器","未来科技"/*,"十周年UI"*/];//,"自由选将" 感觉没什么用
/*
代码保存，代码添加到loadPack方法得末尾
搜索关键字：var loadPack=function()

第一种编译方式：指定编译后文件输出的位置，输出的文件不合并（缺点，编写代码的单文件庞大）
导入方式：
code:
//最终还是选择改代码，增加自定义扩展简单导入
//个人扩展
let loadSelfExtensionConfig = window.loadSelfExtensionConfig||lib.config.loadSelfExtensionConfig;
if(Array.isArray(loadSelfExtensionConfig)) {
    toLoad += loadSelfExtensionConfig.length;
    for (var i = 0; i < loadSelfExtensionConfig.length;i++){
        lib.init.js(lib.assetURL + "build/exsrc/" + loadSelfExtensionConfig[i], "extension", packLoaded, packLoaded);
    }
}
// 正式扩展加载
let loadExtensionConfig = window.loadExtensionConfig||lib.config.loadExtensionConfig;
if(Array.isArray(loadExtensionConfig)) {
    toLoad += loadExtensionConfig.length;
    for (var i = 0; i < loadExtensionConfig.length;i++){
        lib.init.js(lib.assetURL + "extension/" + loadExtensionConfig[i], "extension", packLoaded, packLoaded);
    }
}

//game/config.js
loadSelfExtensionConfig:["ZJ联盟杀","十六人扩展精简版"],//"加载测试扩展"【直接整合进来】
loadExtensionConfig:["十周年UI","未来科技"],//正规扩展

第二种编译方式：编译后输出的文件，输出文件合并成一个指定js（缺点：每次只能指定编译成一个文件，不利于多扩展编译）
临时解决方案：可在另一个项目内完成，编译完后，打包扩展；
导入方式：
1.制作成extension扩展，采用游戏的扩展导入方式导入；
2.每次新扩展，手动改tsconfig文件的编译，输出路径，可以做到类似的独立，就是很麻烦；
3.快速测试用：直接代码中导入

准备写个专门测试用扩展
*/

/*
一些修改备注：
游戏报错时，不出现弹出的原因：
str+='\n'+err.stack;
game.print(err.stack);
似乎是我本地浏览器不支持err，为空，日后有机会再研究；

测试时可以选择注释掉弹窗：
// alert(str);
console.log(str);

为本地断点调试，不重启程序：
window.resetGameTimeout
游戏在特殊情况下超时不运行，会执行这个，这个可能导致断点断到一半就跳到这里；


//需要通过配置来屏蔽神将选势力
get.config('choose_group') && game.zhu.group=='shen'
shen.length
后续修改：
重新添加新势力！
*/