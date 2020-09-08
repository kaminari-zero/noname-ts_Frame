module ZJNGEx {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "测试技能组2-2", NG.ImportFumType.skill,

            function (lib: Lib, game: Game, ui: UI, get: Get, ai: AI, _status: Status) {

                //御法  【阶段技】  [自]将任一魔法牌视为任一普通魔法牌使用。
                let skill1: ExSkillData = {
                    name:"御法",
                    description:NG.Utils.translateDescTxt("【阶段技】[自]将任一魔法牌视为任一普通魔法牌使用。"),
                    enable:NG.EnableTrigger.phaseUse,
                    usable:1,
                    filter:function(event,player){
                        //读取这场游戏中所有可用非延时锦囊牌
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

                        return player.countCards(NG.PositionType.Handcard,function(card){
                            return get.type2(card) == NG.CardType.Trick;
                        })>0 && list.length>0;
                    },
                    selectCard:1,
                    filterCard:function(card,player) {
                        return get.type2(card) == NG.CardType.Trick;
                    },
                    content: function (event: GameEvent, player: Player, trigger: GameEvent, result: JudgeResultData) {
                        "step 0"
                        //读取这场游戏中所有可用非延时锦囊牌
                        let list = get.inpile(NG.CardType.Trick);
                        //排除无法直接使用的牌，经观察，有notarget=true,的牌是不对角色目标使用；
                        for (let i = list.length-1; i >= 0; i--) {
                            const skill = list[i];
                            let info = get.info({name:skill});
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
                        player.chooseVCardButton(list,true,"选择视为使用的通常魔法卡：");
                        "step 1"
                        if(result && result.bool && result.links) {
                            // let vcard = result.links[0];//虚拟卡牌的link本身是一个卡牌结构
                            // player.useCard(vcard,event.cards);
                            let vcard:CardBaseUIData = {name:result.links[0][2]};
                            player.chooseUseTarget(vcard,event.cards,true);
                        }
                    },
                };

                //赚法  【被动技】  [自]使用一张魔法牌时，摸一张牌。
                //新版：赚法 【被动技】[自]使用一张普通魔法牌时，[自][摸]1。
                let skill2: ExSkillData = {
                    name:"赚法",
                    description:NG.Utils.translateDescTxt("【被动技】[自]使用一张普通魔法牌时，[自][摸]1。"),
                    trigger:{
                        //不能使用这个：多目标的卡牌，每指定一次目标都会触发，具体要参考源码；
                        // player:NG.CardTrigger.useCardTo + NG.TriggerEnum.Begin,
                        player:NG.CardTrigger.useCard,
                    },
                    frequent:true,
                    priority:5,
                    filter:function(event,player){
                        return get.type(event.card,null,player) == NG.CardType.Trick;
                    },
                    content:function(event: GameEvent, player: Player, trigger: GameEvent, result: BaseCommonResultData) {
                        player.draw();
                    }
                };

                //炎狮   【被动技】  
                //[自]使用的《杀》需两张《闪》才能抵消；
                //与[自]进行《大对决术》的角色每次需打出两张《杀》；
                //[自]使用《杀》造成伤害时，则视为对其使用一张《大对决术》（不能被魔法牌响应）。 
                let skill3: ExSkillData = {
                    name:"炎狮",
                    description:NG.Utils.translateDescTxt("【被动技】[自]使用的《杀》需两张《闪》才能抵消；与[自]进行《大对决术》的角色每次需打出两张《杀》；[自]使用《杀》造成伤害时，则视为对其使用一张《大对决术》（不能被魔法牌响应）。"),
                    group:["zj_yanshi_1","zj_yanshi_2","zj_yanshi_3"],
                    subSkill:{
                        1:{
                            description:NG.Utils.translateDescTxt("[自]使用的《杀》需两张《闪》才能抵消"),
                            trigger:{
                                // source:NG.CardTrigger.useCardToTargeted,
                                player:NG.CardTrigger.sha+NG.TriggerEnum.Begin,
                            },
                            forced:true,
                            //无双的条件参考
                            // trigger:{player:'useCardToPlayered'},
                            // filter:function(event,player){
                            //     return event.card.name=='sha'&&!event.getParent().directHit.contains(event.target);
                            // },
                            // logTarget:'target',
                            content:function(event: GameEvent, player: Player, trigger: GameEvent, result: BaseCommonResultData) {
                                if(trigger.shanRequired) {
                                    trigger.shanRequired++;
                                } else {
                                    trigger.shanRequired = 2;
                                }

                                //原参考代码：
                                // var id=trigger.target.playerid;
                                // var map=trigger.getParent().customArgs;
                                // if(!map[id]) map[id]={};
                                // if(typeof map[id].shanRequired=='number'){
                                //     map[id].shanRequired++;
                                // }
                                // else{
                                //     map[id].shanRequired=2;
                                // }
                            }
                        },
                        2:{
                            description:NG.Utils.translateDescTxt("与[自]进行《大对决术》的角色每次需打出两张《杀》"),
                            trigger:{
                                //这样不行?
                                // player:NG.CardTrigger.juedou+NG.TriggerEnum.Begin,
                                // target:NG.CardTrigger.juedou+NG.TriggerEnum.Begin,
                                player:NG.CardTrigger.useCardToPlayered,
                                target:NG.CardTrigger.useCardToPlayered,
                            },
                            filter:function(event,player){
                                return get.name(event.card,player)==NG.CardNameConst.juedou;
                            },
                            forced:true,
                            logTarget:function(trigger,player){
                                return player==trigger.player?trigger.target:trigger.player;
                            },
                            content:function(event: GameEvent, player: Player, trigger: GameEvent, result: BaseCommonResultData) {
                                //参考原代码："无双"
                                var id=(player==trigger.player?trigger.target:trigger.player)['playerid'];
                                var idt=trigger.target.playerid;
                                var map=trigger.getParent().customArgs;
                                if(!map[idt]) map[idt]={};
                                if(!map[idt].shaReq) map[idt].shaReq={};
                                if(!map[idt].shaReq[id]) map[idt].shaReq[id]=1;
                                map[idt].shaReq[id]++;
                            }
                        },
                        3:{
                            description:NG.Utils.translateDescTxt("[自]使用《杀》造成伤害后，则视为对其使用一张《大对决术》（不能被魔法牌响应）"),
                            trigger:{
                                // player:NG.CardTrigger.shaDamage,
                                source:NG.StateTrigger.damage+NG.TriggerEnum.End,
                            },
                            filter:function(event,player){
                                // debugger;
                                // return event.player == player && event.num > 0;
                                return get.name(event.card) == NG.CardNameConst.sha && event.num > 0;
                            },
                            content:function(event: GameEvent, player: Player, trigger: GameEvent, result: BaseCommonResultData) {
                                player.useCard({name:NG.CardNameConst.juedou},trigger.player,NG.StringTypeConst.nowuxie);
                            }
                        },
                    },
                }


                let output = {
                    zj_yufa:skill1,
                    zj_zuanfa:skill2,

                    zj_yanshi:skill3,
                }

                return output;
            });
    })();
}