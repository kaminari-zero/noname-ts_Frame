module ZJNGEx {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "替换游戏错误提示与重置", NG.ImportFumType.run,

            function (lib: Lib, game: Game, ui: UI, get: Get, ai: AI, _status: Status) {
                //不一定回替换成功，例如十周年之类的也会重新设置回来：
                //主要用于测试的时候

                //游戏报错时，不出现弹出的原因：
                // str+='\n'+err.stack;
                // game.print(err.stack);
                // 似乎是我本地浏览器不支持err，为空，日后有机会再研究；
                window.onerror=function(msg, src, line, column, err){
					var str=msg + '\n' + _status.event.name + ': ' + _status.event.step;
					str+='\n'+_status.event.parent.name+': '+_status.event.parent.step;
					str+='\n'+_status.event.parent.parent.name+': '+_status.event.parent.parent.step;
					var evt=_status.event;
					if(evt.player||evt.target||evt.source||evt.skill||evt.card){
						str+='\n-------------'
					}
					if(evt.player){
						str+='\nplayer: ' + evt.player.name;
					}
					if(evt.target){
						str+='\ntarget: ' + evt.target.name;
					}
					if(evt.source){
						str+='\nsource: ' + evt.source.name;
					}
					if(evt.skill){
						str+='\nskill: ' + evt.skill;
					}
					if(evt.card){
                        str+='\ncard: ' + evt.card.name;
                        if(evt.cards){
                            str+='\ncards: ' + evt.cards.toString();
                        }
					}
					str+='\n-------------';
					str+='\n'+line;
					str+='\n'+column;
					// str+='\n'+err.stack;
                    alert(str);
                    console.error(str);
					// window.ea=Array.from(arguments);
					// window.em=msg;
					// window.el=line;
					// window.ec=column;
					// window.eo=err;
					game.print(msg);
					game.print(line);
					game.print(column);
					// game.print(err.stack);
					if(!lib.config.errstop){
						_status.withError=true;
						game.loop();
					}
                };
                
                // 为本地断点调试，不重启程序：
                // window.resetGameTimeout
                // 游戏在特殊情况下超时不运行，会执行这个，这个可能导致断点断到一半就跳到这里；
                // 直接重置负责reset重置的方法就行了！
                lib.init.reset = function(){
                    console.warn("测试阶段，游戏进入异常状态，但不重置");
                }

                return null;
            });
    })();
}