module ZJNGEx {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "一些单技能组1", NG.ImportFumType.skill,

            function (lib: Lib, game: Game, ui: UI, get: Get, ai: AI, _status: Status) {

                //子龙   【回合技】  [自]<准备>[自]弃置区域内任意数量的装备牌/魔法牌。每以此法弃置一张牌，视为对[任一]使用一张《杀》。【补充：此杀不计入使用次数】
                let skill1: ExSkillData = {
                    name:"子龙",
                    description:NG.Utils.translateDescTxt("【回合技】[自]<准备>，[自]弃置[自][区]任意数量的装备牌/魔法牌。每以此法弃置一张牌，视为对[他]使用一张《杀》(此《杀》不计入使用次数)。"),
                    trigger:{
                        player:NG.PhaseTrigger.phaseZhunbeiBegin,
                    },
                    usable:1,
                    filter:function(event,player){
                        return player.countCards(NG.PositionType.All,function(card){
                            return get.type(card) == NG.CardType.Equip || get.type(card,NG.StringTypeConst.trick) == NG.CardType.Trick;
                        })>0 && game.countPlayer(function(current){
                            return player != current && player.canUse({name:NG.CardNameConst.sha},current);
                        })>0;
                    },
                    // position:NG.PositionType.All,
                    // selectCard:[1,Infinity],
                    // filterCard:function(card,player){
                    //     return get.type(card) == NG.CardType.Equip || get.type(card,NG.StringTypeConst.trick) == NG.CardType.Trick;
                    // }, 
                    content: function (event: GameEvent, player: Player, trigger: GameEvent, result: BaseCommonResultData) {
                        "step 0"
                        // 这个不能选择判定区的牌
                        // player.chooseCard([1,Infinity],NG.PositionType.All,function(card,player){
                        //     return get.type(card) == NG.CardType.Equip || get.type(card,NG.StringTypeConst.trick) == NG.CardType.Trick;
                        // });
                        player.choosePlayerCard([1,Infinity],NG.PositionType.All,player).set("filterButton",function(button:Button,player:Player){
                            let card = button.link as Card;
                            return get.type(card) == NG.CardType.Equip || get.type(card,NG.StringTypeConst.trick) == NG.CardType.Trick;
                        });
                        "step 1"
                        if(result.bool && result.links.length) {
                            event.num = 0;
                            event.cards = result.links;
                            if(event.cards.length) {
                                event.num = event.cards.length;
                                // player.lose(event.cards,ui.ordering,NG.StringTypeConst.visible);
                                player.discard(event.cards,ui.ordering,player);
                            }
                            if(event.num == 0){
                                event.finish();
                            }
                        } else {
                            event.finish();
                        }
                        // player.chooseTarget(1,true);
                        "step 2"
                        // if(result.bool) {
                        //     player.useCard({name:NG.CardNameConst.sha,isCard:true},result.targets[0],false);
                        // }
                        player.chooseUseTarget({name:NG.CardNameConst.sha},false,true);//,[event.cards[event.num-1]]
                        "step 3"
                        if(result.bool && result.targets) {
                            event.num--;
                            if(event.num > 0) {
                                event.goto(2);
                                // event.redo();
                            } 
                        }
                    }
                };

                //健鹏   【主动技】  [自]使用《杀》指定角色为目标后，其不能使用《闪》；[自]使用《杀》对其造成伤害时，[判定]红色，然后其血槽-1。
                let skill2: ExSkillData = {
                    name:"健鹏",
                    description:NG.Utils.translateDescTxt("【主动技】[自]使用《杀》指定角色为目标后，其不能使用《闪》；[自]使用《杀》对其造成伤害时，[判定]红色，然后其血槽-1。"),
                    group:["zj_jianpeng_1","zj_jianpeng_2"],
                    subSkill: {
                        1: {
                            description:NG.Utils.translateDescTxt("[自]使用《杀》指定角色为目标后，其不能使用《闪》"),
                            trigger: {
                                player: NG.CardTrigger.useCardToPlayered,
                            },
                            filter:function(event,player){
                                return get.name(event.card,player) == NG.CardNameConst.sha;
                            },
                            forced: true,
                            content: function (event: GameEvent, player: Player, trigger: GameEvent, result: BaseCommonResultData) {
                                (<Player[]>trigger.getParent().directHit).add(trigger.target);
                            },

                        },
                        2:{
                            description:NG.Utils.translateDescTxt("[自]使用《杀》对其造成伤害时，[判定]红色，然后其血槽-1"),
                            trigger:{
                                player:NG.CardTrigger.shaDamage,
                            },
                            // filter:function(event,player){
                            //     return event.source == player;
                            // },
                            content:function(event: GameEvent, player: Player, trigger: GameEvent, result: BaseCommonResultData){
                                "step 0"
                                player.judge(function(jResult: JudgeResultData){
                                    return jResult.color == NG.CardColor.Red?1:0;
                                });
                                "step 1"
                                if(result.bool) {
                                    trigger.target.loseMaxHp();
                                }
                            }
                        }
                    },
                    // content:function(event: GameEvent, player: Player, trigger: GameEvent, result: BaseCommonResultData){
                    // }
                };

                // let jiangpang1: ExSkillData = {
                //     trigger:{
                //         player:NG.CardTrigger.useCardToPlayered,
                //     },
                //     forced:true,
                //     content:function(event: GameEvent, player: Player, trigger: GameEvent, result: BaseCommonResultData){
                //         (<Player[]>trigger.getParent().directHit).add(trigger.target);
                //     }
                // };

                // let jiangpang2: ExSkillData = {
                //     trigger:{
                //         source:NG.CardTrigger.shaDamage,
                //     },
                //     prompt:NG.Utils.translateDescTxt("[自]使用《杀》对其造成伤害时，[判定]红色，然后其血槽-1"),
                //     content:function(event: GameEvent, player: Player, trigger: GameEvent, result: BaseCommonResultData){
                //         "step 0"
                //         player.judge(function(jResult: JudgeResultData){
                //             return jResult.color == NG.CardColor.Red?1:0;
                //         });
                //         "step 1"
                //         if(result.bool) {
                //             event.target.loseMaxHp();
                //         }
                //     }
                // };


                let output = {
                    zj_zilong:skill1,
                    zj_jianpeng:skill2,
                }

                return output;
            });
    })();
}