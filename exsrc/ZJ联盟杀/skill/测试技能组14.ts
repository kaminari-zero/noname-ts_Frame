module ZJNGEx {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "测试技能组14", NG.ImportFumType.skill,

            function (lib: Lib, game: Game, ui: UI, get: Get, ai: AI, _status: Status) {

                //魔志 【回合技】  [任一]<结束>，[自]令其任一暗置手牌明置，称为“魔”，“魔”视为《魔》使用。
                let skill1: ExSkillData = {
                    name:"魔志",
                    description:NG.Utils.translateDescTxt("【回合技】[任]<结束>，[自]令其一张暗置手牌明置，称为“魔”；“魔”视为《魔》使用。"),
                    trigger:{
                        global:NG.PhaseTrigger.phaseJieshuBegin,
                    },  
                    usable:1,
                    filter:function(event,player){
                        // return game.countPlayer(function(current){
                        //     return current.countCards(NG.PositionType.Handcard,(card)=>{
                        //         return !lib.filter.filterMingzhiCard(current,card);
                        //     })>0;
                        // }) > 0;
                        return event.player.countCards(NG.PositionType.Handcard,(card)=>{
                                    return !lib.filter.filterMingzhiCard(event.player,card);
                                })>0;
                    },  
                    // 非主动使用，不会使用这些条件
                    // selectTarget:1,
                    // filterTarget:function(card,player,target) {
                    //     return target.countCards(NG.PositionType.Handcard,(card)=>{
                    //         // return !player.storage.mingzhi || (<Card[]>player.storage.mingzhi).contains(card);
                    //         return !lib.filter.filterMingzhiCard(player,card);
                    //     })>0;
                    // },
                    // selectCard:1,
                    // filterCard:function(card,player){
                    //     return lib.filter.filterMingzhiCard(player,card);
                    // },
                    // position:NG.PositionType.Handcard,
                    global:["mingzhi_mo","mingzhi_mo_lose"],       
                    content:function(event: GameEvent, step: number, source: Player, player: Player, target: Player, targets: Player[], card: Card, cards: Card[], skill: string, forced: boolean, num: number, trigger: GameEvent, result: BaseCommonResultData){  
                    // content: function (event: GameEvent, player: Player, trigger: GameEvent, result: BaseCommonResultData) {
                        // console.log("魔志：过滤结构：",result);
                        // event.target = result.targets[0];
                        // player.chooseTarget(function(card:Card,player:Player,target:Player) {
                        //     return target.countCards(NG.PositionType.Handcard,(card)=>{
                        //         return !lib.filter.filterMingzhiCard(target,card);
                        //     })>0;
                        // },true);
                        "step 0"
                        //魔幻bug：
                        player.choosePlayerCard(1,trigger.player,NG.PositionType.Handcard).set("filterButton",function(button: Button, current: Player){
                            //current指的是当前事件的玩家，所以不管怎么执行都是指自己，目标直接取当前事件的目标就行了：
                            let target = _status.event.target;
                            let card = button.link as Card;
                            // console.log("魔志choosePlayerCard===>",!lib.filter.filterMingzhiCard(target,card),card,target);
                            return !lib.filter.filterMingzhiCard(target,card);
                        });
                        "step 1"
                        // console.log("魔志：过滤结构：",result,event);
                        if(result.bool && result.buttons) {
                            let cards = result.links as Card[];
                            trigger.player.mingzhiCard(cards);
                        }
                        "step 2"
                        // console.log("魔志：过滤上一个明置===》",result);
                        if(result.bool && result.cards) {
                            trigger.player.addMark("mingzhi_mo",result.cards.length);
                        }
                    }
                };

                //问题：该标记的问题，就是明牌机制的问题，问题1：被顺手获取的牌(有lose)，不取消标记；问题2：仍然可以明置同一张牌；
                let mingzhi_mo:ExSkillData = {
                    name:"魔志",
                    enable:[NG.EnableTrigger.chooseToUse,NG.EnableTrigger.chooseToRespond],
                    // group:["mingzhi_mo_lose"],
                    // global:"mingzhi_mo_lose",
                    filter:function(event,player) {
                        return player.storage.mingzhi_mo;
                    },
                    filterCard:function(card,player){
                        return player.storage.mingzhi && (<Card[]>player.storage.mingzhi).contains(card);
                    },
                    prompt:"“魔”视为《魔》使用",
                    viewAs:{name:NG.CardNameConst.jiu},
                    viewAsFilter:function(player){
                        return player.storage.mingzhi_mo;
                    },
                    mark:"mingzhi_mo",
                    marktext:"魔",
                    intro:{
                        content:NG.MarkContentConst.mark,
                    },
                    //目前来看，可能需要onuse，才能在使用视为技时，做操作
                    // onuse:function(result,player){
                    //     // if(lib.filter.filterMingzhiCard(player,result.cards[0])) {
                    //     // }
                    //     //可以自己使用时失去
                    //     //大胆点，确实这时候还有标记
                    //     player.removeMingzhiCard(result.cards);
                    //     player.removeMark("mingzhi_mo",1);
                    // },
                    subSkill:{
                        lose:{
                            trigger:{
                                player:"loseMingzhi",
                            },
                            silent:true,
                            filter:function(event,player) {
                                return player.storage.mingzhi_mo && event.source == player;
                            },
                            content: function (event: GameEvent, player: Player, trigger: GameEvent, result: BaseCommonResultData) {
                                // console.log("mingzhi_mo_lose===>",player.storage,event);
                                player.removeMark("mingzhi_mo",trigger.oCards.length);
                            }
                        }
                    },
                    ai:{
                        save:true,
                    }
                };

                //魔海 【流血技】  [自]弃置任一角色的“魔”，令其摸两张牌并将角色牌翻面。
                let skill2: ExSkillData = {
                    name:"魔海",
                    description:NG.Utils.translateDescTxt("【流血技】[自]弃置[任]“魔”，令其[摸]2并将角色牌翻面。"),
                    trigger:{
                        // player:NG.StateTrigger.damageBegin3
                        player:NG.StateTrigger.damage + NG.TriggerEnum.End,
                    },
                    filter:function(event,player){
                        return game.countPlayer(function(player){
                            if(player.storage.mingzhi_mo) {
                                return true;
                            }
                        }) > 0 && event.num > 0;
                    },
                    // selectTarget:1,
                    // filterTarget:function(card,player,target){
                    //     if(target.storage.mingzhi_mo && target.storage.mingzhi_mo.length) {
                    //         return true;
                    //     }
                    // },
                    content: function (event: GameEvent, player: Player, trigger: GameEvent, result: BaseCommonResultData) {
                        "step 0"
                        player.chooseTarget(function(card,player,target){
                                if(target.storage.mingzhi_mo) {
                                    return true;
                                }
                            }
                        );
                        "step 1"
                        if(result.bool && result.targets.length) {
                            var target = event.target = result.targets[0];
                            //选择弃置的魔标记
                            player.chooseCardButton(target.storage.mingzhi);
                        }
                        "step 2"
                        if(result.bool && result.links.length) {
                            event.target.discard(result.links,player,true);
                            event.target.draw(2);
                            event.target.turnOver(!event.target.isTurnedOver());
                            //需要把移除魔标记独立出来，正常失去明置牌时，魔标记无法自动更新
                            // target.removeMark("mingzhi_mo",1);
                            //同时移除一张明置卡牌
                            // (<Card[]>target.storage.mingzhi_mo).randomRemove
                            // let removeCard = (<Card[]>target.storage.mingzhi_mo).randomGet();
                            // target.removeMingzhiCard(removeCard);
                        }
                    },
                    ai:{
                        maixie_hp:true,
                    },
                };


                let output = {
                    zj_mozhi:skill1,
                    zj_mohai:skill2,
                    mingzhi_mo:mingzhi_mo,
                }

                return output;
            });
    })();
}