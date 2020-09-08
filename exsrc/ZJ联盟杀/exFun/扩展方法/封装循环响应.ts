//@ts-nocheck
module ZJNGEx {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "封装循环响应", NG.ImportFumType.run,

            function (lib: Lib, game: Game, ui: UI, get: Get, ai: AI, _status: Status) {
                //循环响应：
                lib.element.content.chooseToRespondByAll = function (event: GameEvent, step: number, source: Player, player: Player, target: Player, targets: Player[], card: Card, cards: Card[], skill: string, forced: boolean, num: number, trigger: GameEvent, result: BaseResultData) {
                    "step 0"
                    if (!event.sourceTrigger) event.sourceTrigger = event.getParent()._trigger;
                    event.respondPlayer = game.filterPlayer(event.filterPlayer).sort(lib.sort.seat);
                    event.respondTargets = [];//记录响应目标
                    event.noRespondTargets = [];//记录不响应目标
                    event.allPlayers = event.respondPlayer.concat();
                    event.num = 0;
                    "step 1"
                    if (event.respondPlayer && event.respondPlayer.length) { //响应
                        let current = event.respondPlayer.shift();
                        if (current) event.current = current;
                        else event.redo();
                    } else {
                        // event.finish();
                        event.goto(4);
                    }
                    "step 2"
                    let _prompt;
                    if (typeof event.prompt == "function") {
                        _prompt = event.prompt.apply(null, [event.sourceTrigger, player, event.current]);
                    } else {
                        _prompt = event.prompt;
                    }
                    //'是否替' + get.translation(player) + '对' + get.translation(target) + '使用一张'+ get.translation(NG.CardNameConst.sha)
                    // let _respondFun = event.respondFun;
                    //重新规划参数，传参，采用执行回调的方式，在回调里执行事件：
                    // let _respondFunParms = event.respondFunParms as Array<any>;
                    // if (_respondFunParms && get.objtype(_respondFunParms) == NG.ObjType.Array) {
                    //     //触发的技能事件
                    //     _respondFunParms.unshift(...[trigger, player, event.current, _prompt]);
                    // } else {
                    //     _respondFunParms = [event, event.sourceTrigger, player, event.current,_prompt];
                    // }
                    let _respondFunParms = [event, event.sourceTrigger, player, event.current, _prompt];
                    // var next = event.respondFun.apply(null, _respondFunParms);//执行响应的方法1
                    event.respondFun.apply(null, _respondFunParms);//回调执行响应
                    "step 3"
                    let resultBool = event.resultFun(result, player, event.current);
                    if (resultBool) { //是否所有人都需要响应
                        let _respondResultParms = [event, event.sourceTrigger, result, player, event.current];
                        //响应结果
                        event.respondResultFun.apply(null, _respondResultParms);//处理响应的结果方法1
                        if (event.isContinue) {
                            event.goto(1);
                        }
                        //记录响应的玩家：
                        event.respondTargets.push(event.current);
                    } else {
                        event.goto(1);//若不响应，则询问下一个
                        event.noRespondTargets.push(event.current);
                    }
                    "step 4"
                    if (!event._result) {
                        event._result = {
                            bool: event.respondTargets.length > 0,
                            noTargets: event.noRespondTargets,//不响应
                            targets: event.respondTargets,//响应
                            notTargets: event.respondPlayer,//未响应
                            players: event.allPlayers,//当前参与响应的玩家
                        };
                    }
                }

                lib.element.player.chooseToRespondByAll = function (parames: {
                    filterPlayer?: (event: GameEvent, player: Player) => boolean,
                    isContinue?: boolean,
                    prompt?: string | FourParmFun<GameEvent, Trigger, Player, Current, string>,
                    // respondFunParms?: any[],
                    respondFun?: (event: GameEvent, trigger: GameEvent, player: Player, current: Player, ..._args) => void,
                    resultFun?: (result: BaseResultData, player: Player, current: Player) => boolean;
                    respondResultFun?: (event: GameEvent, trigger: GameEvent, player: Player, current: Player) => void
                }) {
                    var next = game.createEvent('chooseToRespondByAll');
                    next.player = this;
                    // if (parames.filterPlayer) {
                    //     next.filterPlayer = parames.filterPlayer;
                    // } else {
                    //     next.filterPlayer = lib.filter.all;
                    // } 
                    // if (parames.respondFunParms) {
                    //     next.respondFunParms = parames.respondFunParms;
                    // } else {
                    //     next.respondFunParms = [];
                    // }
                    // if (parames.prompt) 
                    // next.prompt = event.prompt;
                    // next.respondFun = parames.respondFun;
                    // next.respondResultFun = parames.respondResultFun;
                    // if(next.ai1==undefined) next.ai1=get.unuseful2;
                    // if(next.ai2==undefined) next.ai2=get.attitude2;
                    for (const key in parames) {
                        const element = parames[key];
                        next[key] = element;
                    }
                    if (!next.filterPlayer) {
                        next.filterPlayer = lib.filter.all;
                    }
                    if (!next.resultFun) {
                        next.resultFun = function (result: BaseResultData, player: Player, current: Player) {
                            return result.bool;
                        }
                    }
                    // next.isContinue = !!parames.isContinue;
                    next.setContent('chooseToRespondByAll');
                    next._args = Array.from(arguments);
                    return next;
                };

                return null;
            });
    })();
}