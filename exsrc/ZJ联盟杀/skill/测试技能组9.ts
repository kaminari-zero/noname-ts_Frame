module ZJNGEx {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "测试技能组9", NG.ImportFumType.skill,

            function (lib: Lib, game: Game, ui: UI, get: Get, ai: AI, _status: Status) {

                //妖术  【主动技】  [自]将任意两张点数之差不大于X的手牌 (X=[自]失血量) 当任一通常魔法牌使用。
                let skill1: ExSkillData = {
                    name:"妖术",
                    description:NG.Utils.translateDescTxt("【主动技】[自]将任意两张点数之差≤X[手] (X=[自]失血量) 当任一通常魔法牌使用。"),
                    // enable:[NG.EnableTrigger.chooseToUse,NG.EnableTrigger.chooseToRespond],
                    enable:NG.EnableTrigger.phaseUse,
                    filter:function(event,player){
                        //寻找手牌有两张点数差大于x的牌
                        let cards = player.getCards(NG.PositionType.Handcard);
                        for (let i = 0; i < cards.length; i++) {
                            for (let j = i+1; j < cards.length; j++) {
                                const card1 = cards[i];
                                const card2 = cards[j];
                                if(Math.abs(get.number(card1)-get.number(card2)) <= player.curLoseHp()) {
                                    return true;
                                }
                            }
                        }
                    },
                    selectCard:2,
                    position:NG.PositionType.Handcard,
                    filterCard:function(card,player) {
                        if(ui.selected.cards.length) {
                            for (let i = 0; i < ui.selected.cards.length; i++) {
                                const _card = ui.selected.cards[i];
                                console.log("每次选牌的结果===》",Math.abs(get.number(card)-get.number(_card)),player.curLoseHp());
                                if(Math.abs(get.number(card)-get.number(_card)) <= player.curLoseHp()) {
                                    return true;
                                }
                            }
                        } else {
                            return true;
                        }
                    },
                    complexCard:true,
                    content: function (event: GameEvent, player: Player, trigger: GameEvent, result: BaseCommonResultData) {
                        "step 0"
                        // event.cards = result.cards;
                        // let list = game.findCards(function(name,cardData){
                        //     return get.type(name) == NG.CardType.Trick ;
                        // });
                        let list = get.inpile(NG.CardType.Trick);
                        //排除无法直接使用的牌，经观察，有notarget=true,的牌是不对角色目标使用；
                        for (let i = list.length-1; i >= 0; i--) {
                            const skill = list[i];
                            let info = get.info({name:skill});
                            //任一就是都行：无懈也可以
                            if(info && info.notarget) {
                                list.splice(i,1);
                            } else if(!info) {
                                list.splice(i,1);
                            } else if(!game.countPlayer(function(current){ //可以使用的目标数为0
                                return player.canUse(skill,current);
                            })) {
                                list.splice(i,1);
                            }
                        }
                        player.chooseVCardButton(list,1,"视为一张通常魔法使用",true);
                        "step 1"
                        if(result.bool) {
                            // player.useCard({name:result.links[0],isCard:true},event.cards);
                            player.chooseUseTarget({name:result.links[0][2]},event.cards,true);
                        }
                    }
                };

                //妖爆  【限定技】  [自]<出牌>[自]选择一项：(1)对1-3名角色各造成1点伤害；(2)弃置四种花色的手牌各1张，对[任一]造成3点伤害。
                //原型：“yeyan”
                let skill2: ExSkillData = {
                    name:"妖爆",
                    description:NG.Utils.translateDescTxt("【限定技】[自]<出>，[自]选择一项：(1)[自]对1-3名角色各造成1点伤害；(2)[自]弃置[手]四种花色各1张，[自]对[任]造成3点伤害。"),
                    frequent:true,
                    //限定技
                    limited:true,
                    unique:true,
                    forceDie:true,
                    //发动动画：
                    animationColor:NG.NatureColorConst.metal,
				    skillAnimation:NG.AniNmaeConst.legend,
                    enable:NG.EnableTrigger.phaseUse,
                    content: function (event: GameEvent, player: Player, trigger: GameEvent, result: BaseCommonResultData) {
                        "step 0"
                        player.awakenSkill('zj_yaobao');//触发限定技
                        var _list = ["对1-3名角色各造成1点伤害"];
                        //若手牌不满足四花色，则只有一个选项：
                        let suitLists = [];
                        let cards = player.getCards(NG.PositionType.Handcard,(card)=>{
                            let suit = get.suit(card);
                            if(!suitLists.contains(suit)){
                                suitLists.push(suit);
                                return true;
                            } 
                            return false;
                        });
                        if(cards.length>=4) _list.push("弃置四种花色的手牌各1张，对任意一名角色造成3点伤害");
                        var next = player.chooseControlList(
                            // [
                            //     "对1-3名角色各造成1点伤害",
                            //     "弃置四种花色的手牌各1张，对任意一名角色造成3点伤害"
                            // ]
                            _list,true
                        );
                        // 该按钮已经直接排除掉了
                        // if(cards.length>=4) {
                        //     next.filterButton=function(button,player){
                        //         if(get.buttonIndex(button) == 1) {
                        //             let suitLists = [];
                        //             let cards = player.getCards(NG.PositionType.Handcard,(card)=>{
                        //                 let suit = get.suit(card);
                        //                 if(!suitLists.contains(suit)){
                        //                     suitLists.push(suit);
                        //                     return true;
                        //                 } 
                        //                 return false;
                        //             });
                        //         }
                        //         return false;
                        //     }
                        // }
                        "step 1"
                        // console.log("妖爆===>",event,result);
                        // debugger;//人工断点
                        event.index = result.index;
                        if(result.index === 0) {
                            player.chooseTarget(
                                [1,3],
                            );
                        } else if(result.index === 1) {
                            player.chooseTarget();
                        } else {
                            event.finish();
                        }
                        "step 2"
                        if(result.targets) {
                            event.targets = result.targets;
                            if(event.index === 0) {
                                result.targets.forEach(function(current){
                                    current.damage(1,NG.StringTypeConst.nocard,player);
                                });
                                event.finish();
                            } else if(event.index === 1) {
                                //弃置4种不同花色手牌
                                player.chooseToDiscard(4,"弃置四种花色的手牌各1张",function(card,player){
                                    var suit=get.suit(card);
                                    for(var i=0;i<ui.selected.cards.length;i++){
                                        if(get.suit(ui.selected.cards[i])==suit) return false;
                                    }
                                    return true;
                                }).set("complexCard",true);
                                
                            } else {
                                event.finish();
                            }
                        }
                        "step 3"
                        // console.log("妖爆===>",event,result);
                        // debugger;//人工断点
                        if(result.bool && event.index == 1) {
                            event.targets.forEach(function(current){
                                current.damage(3,NG.StringTypeConst.nocard,player);
                            });
                        }
                    }
                };

                let output = {
                    zj_yaoshu:skill1,
                    zj_yaobao:skill2
                }

                return output;
            });
    })();
}