module ZJNGEx {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "测试技能组3", NG.ImportFumType.skill,

            function (lib: Lib, game: Game, ui: UI, get: Get, ai: AI, _status: Status) {
                //自闭   【阶段技】  [自]可将一张方块牌当《圣水牢术》对[自]使用，然后[自]血量+1。
                let skill1: ExSkillData = {
                    name:"自闭",
                    description:NG.Utils.translateDescTxt("【阶段技】[自]可将一张方块牌当【圣水牢术】对[自]使用，然后[自]血量+1。"),
                    enable:NG.EnableTrigger.phaseUse,
                    usable:1,
                    //手牌需要有方块牌
                    filter:function(event,player){
                        return player.countCards(NG.PositionType.Handcard,{suit:NG.CardColor.Diamond})>0;
                    },
                    content:function(event: GameEvent, player: Player, trigger: GameEvent, result: BaseCommonResultData){
                        "step 0"
                        // player.chooseToUse({suit:NG.CardColor.Diamond},`选择一张方块牌当《${lib.translate[NG.CardNameConst.lebu]}》对自己使用`);
                        player.chooseCard({suit:NG.CardColor.Diamond},`选择一张方块牌当《${lib.translate[NG.CardNameConst.lebu]}》对自己使用`);
                        "step 1"
                        if(result && result.bool && result.cards) {
                            // let seletedCard = result.cards[0];
                            player.useCard({name:NG.CardNameConst.lebu}, result.cards,player,"noai");
                            player.recover();
                        }
                    }
                };

                //财康   【被动技】  [自]判定区里有牌：(1)受到伤害前，该伤害-1；(2)不会被翻面；(3)对攻击范围内的角色使用牌无距离限制。
                //新版：(3)对攻击范围内的角色使用牌无限次数。
                let skill2: ExSkillData = {
                    name:"财康",
                    description:NG.Utils.translateDescTxt("【被动技】[自]判定区里有牌：(1)受到伤害前，该伤害-1；(2)不会被翻面；(3)对攻击范围内的角色使用牌无限次数。"),
                    trigger: {
                        player: [
                            NG.CardTrigger.useCard + NG.TriggerEnum.Begin,//(3)使用牌
                            NG.StateTrigger.damageBegin3, //(1)受到伤害前
                            NG.StateTrigger.turnOver + NG.TriggerEnum.Begin,//(2)翻面
                        ],
                        // target: [
                        //     NG.StateTrigger.damage + NG.TriggerEnum.End, //(1)受到伤害前
                        //     NG.StateTrigger.turnOver + NG.TriggerEnum.Begin,//(2)翻面
                        // ],
                    },
                    forced:true,
                    //[自]判定区里有牌
                    filter:function(event,player){
                        return player.countCards(NG.PositionType.Judge)>0;
                    },
                    content: function (event: GameEvent, player: Player, trigger: GameEvent, result: BaseResultData) {
                        "step 0"
                        //判断当前触发的事件类型：
                        let triggerName = event.triggername;
                        if(triggerName == NG.StateTrigger.damageBegin3) {
                            trigger.num--;//该伤害-1
                            player.popup("伤害-1");
                        } else if(triggerName == NG.StateTrigger.turnOver + NG.TriggerEnum.Begin) {
                            trigger.cancel();//不会被翻面
                            player.popup("不会被翻面");
                        } else {
                            //对攻击范围内的角色使用牌无距离限制的实现：
                            //如何改变解决方法讨论：1.使用mod，没试验；2.根据触发事件，设置event.parent的filterTarget,取消选中，重新game.check;
                            //3.标记当前有这状态........
                            // if(trigger.getParent().name == NG.CardTrigger.useCard) {
                            //     let targets =  event.targets;
                            //     let globalto = player.getGlobalTo();
                            //     //重新筛选目标：
                            //     // let curPlayers = game.players;
                            //     // let playersByGlobal = [];
                            //     game.filterPlayer((player)=>{
                            //     },targets);
                            //     game.check
                            // }   
                        }
                    },
                    mod:{
                        // targetInRange:function(card,player,target){ 
                        //     //判断有判定牌时的时候，目标的使用距离为你的攻击距离
                        //     if(player.countCards(NG.PositionType.Judge)>0 && player.inRange(target)) {
                        //         return true;
                        //     }
                        // },
                        //新版：(3)对攻击范围内的角色使用牌无限次数。
                        cardUsable:function(card,player,num){ 
                            if(player.countCards(NG.PositionType.Judge)>0) {
                                return true;
                            }
                        },
                    },
                };

                let output = {
                    zj_zibi:skill1,
                    zj_caikang:skill2,
                }

                return output;
            });
    })();
}