// @ts-nocheck
module ZJNGEx {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "优化使chrome可以直接显示动态脚本扩展", NG.ImportFumType.none,

            function (lib: Lib, game: Game, ui: UI, get: Get, ai: AI, _status: Status) {
                //注：只用于本地浏览器测试；
                // 使用下面标记，可以在chrome的控制台输出该名字的动态脚本：不过同名覆盖，所以后续需要自己对每个new Function进行命名
                //@ sourceURL=dynamicScript.js

                //需要时用于记录debug的id：目前可用于记录当前游戏setContent的次数
                lib.status.debugFunId = 0;

                //目前优化方案：替换lib.init.parse ,lib.init.setContent方法的方式，修改方法构成时，添加“//@ sourceURL=xxx方法.js”指导生成chrome可显示的动态js文件
                lib.element.event.setContent = function(name){
                    let ingnoreFun = ["_usecard","arrangeTrigger","createTrigger","_discard"]; //排除显示一些不必要的方法名log
					if(typeof name=='function'){
                        let tempName = this.name;
                        if(name.name == "emptyEvent") {
                            tempName = this.name+"_emptyEvent";
                        }
                        this.content=lib.init.parse(name,tempName);
                        // if(!ingnoreFun.contains(tempName)) { //简便调试，事件
                        //     console.log("调试当前content方法名：",tempName+"_"+(++lib.status.debugFunId));
                        // }
					}
					else{
                        if(!lib.element.content[name]._parsed){
							lib.element.content[name]=lib.init.parse(lib.element.content[name],name);
                            lib.element.content[name]._parsed=true;
						}
                        this.content=lib.element.content[name];
                        // let tempName = name;
                        // if(name == "emptyEvent") {
                        //     tempName = this.name+"_emptyEvent";
                        // }
                        // if(!ingnoreFun.contains(tempName)) {
                        //     console.log("调试当前content方法名：",tempName+"_"+(++lib.status.debugFunId));
                        // }
					}
					return this;
                };
                
                lib.init.parse = function(func,name){
                    var str=func.toString();
                    str=str.slice(str.indexOf('{')+1);
                    if(str.indexOf('step 0')==-1){
                        str=`//@ sourceURL=VM-${name}.js\n{\n\t\t\t\tif(event.step==1) {\n\t\t\t\t\tevent.finish();\n\t\t\t\t\treturn;\n\t\t\t\t}`+str;
                    }
                    else{
                        for(var k=1;k<99;k++){
                            if(str.indexOf('step '+k)==-1) break;
                            str=str.replace(new RegExp("'step "+k+"'",'g'),"break;case "+k+":");
                            str=str.replace(new RegExp('"step '+k+'"','g'),"break;case "+k+":");
                        }
                        str=str.replace(/'step 0'|"step 0"/,`//@ sourceURL=VM-${name}.js\n\t\t\t\tif(event.step==`+k+') {\n\t\t\t\t\tevent.finish();\n\t\t\t\t\treturn;\n\t\t\t\t}\n\t\t\t\tswitch(step){\n\t\t\t\t\tcase 0:');
                    }
                    return (new Function('event','step','source','player','target','targets',
                        'card','cards','skill','forced','num','trigger','result',
                        '_status','lib','game','ui','get','ai',str));
                };

                // 注：测试动态方法，还有一种强行断点的方式，在需要断点的地方 写上：debugger; 运行时，回在这里停下来；

                return null;
            });
    })();
}