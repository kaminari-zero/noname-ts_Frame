module ZJNGEx {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "势力通用技能组", NG.ImportFumType.skill,

            function (lib: Lib, game: Game, ui: UI, get: Get, ai: AI, _status: Status) {

                //势力:天
                //天使  【主动技】  [自]使用一张《血》时，[自]摸一张牌。
                let skill1: ExSkillData = {
                    name:"天使",
                    description:NG.Utils.translateDescTxt("【主动技】[自]使用一张《血》时，[自]摸一张牌。"),
                    //【主动技】 条件：[自]使用一张《血》时
                    //使用...时
                    trigger: {
                        player: NG.CardTrigger.useCardTo+NG.TriggerEnum.Begin,
                    },
                    frequent:true,
                    //《血》
                    filter: function (event: Trigger, player: Player) {
                        return get.name(event.card) == NG.CardNameConst.tao;
                    },
                    //[自]摸一张牌
                    content: function (event: GameEvent, player: Player, trigger: GameEvent, result: BaseResultData) {
                        player.draw(1);
                    }
                };

                //【新】天使  【被动技】[任]【天】使用一张《血》时，[自][摸]1 。
                let skill12: ExSkillData = {
                    name:"天使",
                    description:NG.Utils.translateDescTxt("【被动技】[任]【天】使用一张《血》时，[自][摸]1 。"),
                    audio:5,
                    //【主动技】 条件：[自]使用一张《血》时
                    //使用...时
                    trigger: {
                        global: NG.CardTrigger.useCardTo+NG.TriggerEnum.Begin,
                    },
                    frequent:true,
                    //《血》
                    filter: function (event: Trigger, player: Player) {
                        return get.name(event.card) == NG.CardNameConst.tao && get.getZJShaShili(event.player) == ZJNGEx.ZJShaGroupConst.tian;
                    },
                    //[自]摸一张牌
                    content: function (event: GameEvent, player: Player, trigger: GameEvent, result: BaseResultData) {
                        player.draw(1);
                    }
                };

                //势力:狱
                //炼狱   【被动技】  [自][反面]，[自][翻面][自]视为对[他]使用一张《杀》。 
                //新版：炼狱 【被动技】 [自][反][翻],[自]获得[他][场]的一张牌。
                let skill2:ExSkillData = {
                    name:"炼狱",
                    description:NG.Utils.translateDescTxt("【被动技】[自][反面]，[自][翻面][自]视为对[他]使用一张《杀》。"),
                    //【被动技】  [自][反面]
                    trigger: {
                        player: NG.StateTrigger.turnOver+NG.TriggerEnum.End,
                    },
                    //[反面]
                    filter: function (event: Trigger, player: Player) {
                        console.log(`炼狱发动过滤是的翻面状态：${player.isTurnedOver()?"翻面":"翻回正面"}`);
                        return player.isTurnedOver();
                    },
                    //[自][翻面][自]视为对[他]使用一张《杀》。
                    content: function (event: GameEvent, player: Player, trigger: GameEvent, result: BaseResultData) {
                        "step 0"
                        //[自][翻面]
                        player.turnOver(!player.isTurnedOver());
                        "step 1"
                        //[自]视为对[他]
                        player.chooseTarget(
                            1,
                            true,
                            function(card: Card, player: Player, target: Target){
                                return target != player;
                            },
                            `选择一名其他角色，视为对其使用一张${get.translation(NG.CardNameConst.sha)}`
                        );
                        "step 2"
                        //视为对[他]使用一张《杀》。
                        if(result && result.bool) {
                            let target = (<BaseCommonResultData>result).targets[0];
                            if(target) {
                                player.useCard({name:NG.CardNameConst.sha,isCard:true},target,false);
                            }
                        }
                    }
                };

                //新版：炼狱 【被动技】 [自][反][翻],[自]获得[他][场]的一张牌。
                let skill22:ExSkillData = {
                    name:"炼狱",
                    description:NG.Utils.translateDescTxt("【被动技】[自][反][翻],[自]获得[他][场]的一张牌。"),
                    //【被动技】  [自][反面]
                    trigger: {
                        player: NG.StateTrigger.turnOver+NG.TriggerEnum.End,
                    },
                    //[反面]
                    filter: function (event: Trigger, player: Player) {
                        // console.log(`炼狱发动过滤是的翻面状态：${player.isTurnedOver()?"翻面":"翻回正面"}`);
                        return !player.isTurnedOver() && game.countPlayer(function(current){
                            return player != current && current.countCards(NG.PositionType.Area)>0;
                        })>0;
                    },
                    
                    content: function (event: GameEvent, player: Player, trigger: GameEvent, result: BaseCommonResultData) {
                        "step 0"
                        // player.chooseCardTarget({
                        //     selectTarget:1,
                        //     filterTarget:function(card,player,target) {
                        //         return player != target;
                        //     },
                        //     selectCard:1,
                        //     position:NG.PositionType.Area,
                        // });
                        player.chooseTarget(function(card,player,target) {
                            return player != target && target.countCards(NG.PositionType.Area)>0;
                        });
                        "step 1"
                        if(result.bool && result.targets.length) {
                            event.target = result.targets[0];
                            player.choosePlayerCard(result.targets[0],NG.PositionType.Area);
                        }
                        "step 2"
                        if(result.bool && result.links.length) {
                            player.gain(result.links,event.target,NG.AniNmaeConst.gain2);
                        }
                    }
                };

                //新版第二版：炼狱 【被动技】[任]【狱】[反][翻]时，[自]获得[他][场]一张。 
                let skill222:ExSkillData = {
                    name:"炼狱",
                    description:NG.Utils.translateDescTxt("【被动技】[任]【狱】[反][翻]时，[自]获得[他][场]一张。 "),
                    audio:4,
                    //【被动技】  [自][反面]
                    trigger: {
                        global: NG.StateTrigger.turnOver+NG.TriggerEnum.End,
                    },
                    //[反面]
                    filter: function (event: Trigger, player: Player) {
                        // console.log(`炼狱发动过滤是的翻面状态：${player.isTurnedOver()?"翻面":"翻回正面"}`);
                        return !player.isTurnedOver() && game.countPlayer(function(current){
                            return player != current && current.countCards(NG.PositionType.Area)>0;
                        })>0 && get.getZJShaShili(event.player) == ZJNGEx.ZJShaGroupConst.yu;
                    },
                    
                    content: function (event: GameEvent, player: Player, trigger: GameEvent, result: BaseCommonResultData) {
                        "step 0"
                        // player.chooseCardTarget({
                        //     selectTarget:1,
                        //     filterTarget:function(card,player,target) {
                        //         return player != target;
                        //     },
                        //     selectCard:1,
                        //     position:NG.PositionType.Area,
                        // });
                        player.chooseTarget(function(card,player,target) {
                            return player != target && target.countCards(NG.PositionType.Area)>0;
                        });
                        "step 1"
                        if(result.bool && result.targets.length) {
                            event.target = result.targets[0];
                            player.choosePlayerCard(result.targets[0],NG.PositionType.Area);
                        }
                        "step 2"
                        if(result.bool && result.links.length) {
                            player.gain(result.links,event.target,NG.AniNmaeConst.gain2);
                        }
                    }
                };

                //势力:佛
                //佛门   【被动技】  [自]手牌上限+X(X=现存[佛]数+1)。
                let skill3:ExSkillData = {
                    name:"佛门",
                    description:NG.Utils.translateDescTxt("[自]手牌上限+X(X=现存[佛]数+1)。"),
                    //后续直接继承，或者获得该技能：
                    // group:["通用势力上限加手牌上限"],
                    mod:{
                        //手牌上限+X(X=现存[佛]数+1)
                        maxHandcard:function(player: Player, num: number){ 
                            //(X=现存[佛]数+1),目前还没开始做势力标记
                            return num+get.getZJShaShiliCount(ZJNGEx.ZJShaGroupConst.fo); 
                        },
                    },
                };

                //佛势力扩展技能：
                //佛祖  【被动技】 [自]获得技能“佛门”；[自]<摸>时，摸牌+1。
                let exFoSkill1:ExSkillData = {
                    name:"佛祖",
                    description:NG.Utils.translateDescTxt("【被动技】 [自]获得技能“佛门”；[自]<摸>时，摸牌+1。"),
                    audio:2,
                    group:["zj_shili_fozu_1","zj_shili_fozu_2"],
                    subSkill:{
                        1:{
                            trigger:{
                                global:NG.PhaseTrigger.gameDraw+NG.TriggerEnum.Before,
                            },
                            description:NG.Utils.translateDescTxt("[自]获得技能“佛门”。"),
                            derivation:["zj_shili_fomeng"],
                            silent:true,
                            content: function (event: GameEvent, player: Player, trigger: GameEvent, result: BaseCommonResultData) {
                                player.removeAdditionalSkill("zj_shili_fozu_1");
                                player.addAdditionalSkill("zj_shili_fozu_1","zj_shili_fomeng"); 
                            },
                        },
                        2:{
                            description:NG.Utils.translateDescTxt("[自]<摸>时，摸牌+1。"),
                            trigger:{
                                player:NG.PhaseTrigger.phaseDrawBegin,
                            },
                            silent:true,
                            content:function (event: GameEvent, player: Player, trigger: GameEvent, result: BaseCommonResultData) {
                                trigger.num++;
                            },
                        }
                    },
                };
                //菩萨  【被动技】[自]获得技能“佛门”；[自]<结束>时，[自][摸]1。
                let exFoSkill2:ExSkillData = {
                    name:"菩萨",
                    description:NG.Utils.translateDescTxt("【被动技】[自]获得技能“佛门”；[自]<结束>时，[自][摸]1。"),
                    audio:2,
                    group:["zj_shili_pusha_1","zj_shili_pusha_2"],
                    subSkill:{
                        1:{
                            trigger:{
                                global:NG.PhaseTrigger.gameDraw+NG.TriggerEnum.Before,
                            },
                            silent:true,
                            description:NG.Utils.translateDescTxt("[自]获得技能“佛门”。"),
                            derivation:["zj_shili_fomeng"],
                            content: function (event: GameEvent, player: Player, trigger: GameEvent, result: BaseCommonResultData) {
                                player.removeAdditionalSkill("zj_shili_pusha_1");
                                player.addAdditionalSkill("zj_shili_pusha_1","zj_shili_fomeng"); 
                            },
                        },
                        2:{
                            description:NG.Utils.translateDescTxt("[自]<结束>时，[自][摸]1。"),
                            trigger:{
                                player:NG.PhaseTrigger.phaseJieshuBegin,
                            },
                            silent:true,
                            content:function (event: GameEvent, player: Player, trigger: GameEvent, result: BaseCommonResultData) {
                                player.draw();
                            },
                        }
                    },
                };

                //势力:杀
                //杀手  【主动技】  [自]将一张红色牌当《杀》使用/打出；[自]使用方块《杀》无距离限制。
                let skill4:ExSkillData = {
                    name:"杀手",
                    description:NG.Utils.translateDescTxt("【主动技】[自]将一张红色牌当《杀》使用/打出；[自]使用方块《杀》无距离限制。"),
                    enable:[NG.EnableTrigger.chooseToUse,NG.EnableTrigger.chooseToRespond],
                    filter:function(event,player){
                        return player.countCards(NG.PositionType.Use,{color:NG.CardColor.Red})>0;
                    },
                    selectCard:1,
                    position:NG.PositionType.Use,
                    filterCard:function(card,player){
                        return get.color(card) == NG.CardColor.Red;
                    },
                    //视为技能的简单操作：
                    viewAs:NG.CardNameConst.sha,
                    viewAsFilter:function(player){ 
                        if(player.countCards(NG.PositionType.Use,{color:NG.CardColor.Red})) {
                            return true;
                        }; 
                    },
                    prompt:`将一张红色牌当《杀》使用/打出`,
                    // content: function (event: GameEvent, player: Player, trigger: GameEvent, result: BaseResultData) {
                    //     player.useCard();
                    // },
                    mod:{
                        //[自]使用方块《杀》无距离限制。
                        targetInRange:function(card,player,target){
                            if(get.suit(card)==NG.CardColor.Diamond && get.name(card) == NG.CardNameConst.sha){
                                return true;
                            }
                        }
                    },
                    //ai相关
                    check:lib.filter.all,
                };

                //新改版：杀手  【主动技】[自]额外使用《杀》次数+X(X=现存【杀】数)。
                let skill42:ExSkillData = {
                    name:"杀手",
                    description:NG.Utils.translateDescTxt("【被动技】[自]额外使用《杀》次数+X(X=现存【杀】数)。"),
                    // enable:NG.EnableTrigger.phaseUse,
                    // filter:function(event,player){
                    //     return player.countCards(NG.PositionType.Use,{color:NG.CardColor.Red})>0;
                    // },
                    audio:3,
                    mod:{
                        cardUsable:function(card,player,num) {
                            if(get.name(card,player) == NG.CardNameConst.sha) {
                                return num + get.getZJShaShiliCount(ZJNGEx.ZJShaGroupConst.sha);
                            }
                        },
                        // cardEnabled:function(card,player) {
                        // },
                    },

                };

                //势力:法
                //法师   【被动技】  [自]使用一张魔法牌时，展示牌堆顶一张牌，若是魔法牌获得之，否则，放回牌堆顶。
                let skill5: ExSkillData = {
                    name:"法师",
                    description:NG.Utils.translateDescTxt("【被动技】[自]使用一张魔法牌时，展示牌堆顶一张牌，若是魔法牌获得之。"),
                    trigger: {
                        player:NG.CardTrigger.useCard,
                    },
                    filter:function(event,player){
                        if(get.type2(event.card,player) == NG.CardType.Trick) {
                            return true;
                        }
                    },
                    forced:true,
                    frequent:true,
                    //展示牌堆顶一张牌，若是魔法牌获得之
                    content: function (event: GameEvent, player: Player, trigger: GameEvent, result: BaseResultData) {
                        "step 0"
                        event.cards = get.cards(1);
                        player.showCards(event.cards);
                        "step 1"
                        // console.log("法师====>",event.cards);
                        if(event.cards && get.type(event.cards[0],NG.StringTypeConst.trick) == NG.CardType.Trick) {
                            player.gain(event.cards);
                        } else {
                            player.putCardsToCardPile(event.cards);
                        }
                    }
                };

                //新版：法师【被动技】[任]【法】使用一张魔法牌时，[展]1，若是魔法牌获得之。
                let skill52: ExSkillData = {
                    name:"法师",
                    description:NG.Utils.translateDescTxt("【被动技】[任]【法】使用一张魔法牌时，[展]1，若是魔法牌获得之。"),
                    audio:4,
                    trigger: {
                        global:NG.CardTrigger.useCard,
                    },
                    filter:function(event,player){
                        if(get.type2(event.card,player) == NG.CardType.Trick && get.getZJShaShili(event.player) == ZJNGEx.ZJShaGroupConst.fa) {
                            return true;
                        }
                    },
                    priority:10,
                    forced:true,
                    frequent:true,
                    //展示牌堆顶一张牌，若是魔法牌获得之
                    content: function (event: GameEvent, player: Player, trigger: GameEvent, result: BaseResultData) {
                        "step 0"
                        event.cards = get.cards(1);
                        player.showCards(event.cards);
                        "step 1"
                        // console.log("法师====>",event.cards);
                        if(event.cards && get.type(event.cards[0],NG.StringTypeConst.trick) == NG.CardType.Trick) {
                            player.gain(event.cards);
                        } else {
                            player.putCardsToCardPile(event.cards);
                        }
                    }
                };


                //势力:龍
                //龙族   【被动技】  [自]防止受到非[龙]的魔法牌的伤害。
                //原型：摘自"青莲心灯"
                let skill6:ExSkillData = {
                    name:"龙族",
                    description:NG.Utils.translateDescTxt("【被动技】[自]防止受到非[龙]的魔法牌的伤害。"),
                    trigger:{
                        // target:[NG.StateTrigger.damageBegin3,NG.StateTrigger.damageBegin4,NG.StateTrigger.damage+NG.TriggerEnum.Before]
                        player:NG.StateTrigger.damageBegin3,
                    },
                    forced:true,
                    frequent:true,
                    filter:function(event,player){
                        if(event.source && get.getZJShaShili(event.source) == ZJNGEx.ZJShaGroupConst.long) return false;
                        //不明白
                        // if(event.source&&event.source.hasSkillTag('unequip',false,{ 
                        //     name:event.card?event.card.name:null, 
                        //     target:player, 
                        //     card:event.card 
                        // })) return false; 
                        //过滤卡牌的类型
                        return get.type2(event.card)==NG.CardType.Trick;
                    },
                    content:function(event: GameEvent, player: Player, trigger: GameEvent, result: BaseResultData){
                        player.popup("防止伤害");
                        trigger.cancel();
                    },
                    ai:{
                        notrick:true,
                        // ai日后添加
                        // effect:{
                        //     target:function(card,player,target,current){ 
                        //         // if(player.hasSkillTag('unequip',false,{ 
                        //         //     name:card?card.name:null, 
                        //         //     target:player, 
                        //         //     card:card 
                        //         // })) return; 
                        //         if(player && get.getZJShaShili(player) == ZJNGEx.ZJShaGroupConst.long) return;
                        //         if(get.type(card)=='trick'&&get.tag(card,'damage')){ 
                        //             return 'zeroplayertarget'; 
                        //         } 
                        //     },
                        // },
                    },
                };

                //新版：【被动技】 [自]防止受到非【龙】使用的红色魔法牌的伤害。
                let skill62:ExSkillData = {
                    name:"龙族",
                    description:NG.Utils.translateDescTxt("【被动技】[自]防止受到非【龙】使用的红色魔法牌的伤害。"),
                    trigger:{
                        // target:[NG.StateTrigger.damageBegin3,NG.StateTrigger.damageBegin4,NG.StateTrigger.damage+NG.TriggerEnum.Before]
                        player:NG.StateTrigger.damageBegin3,
                    },
                    forced:true,
                    frequent:true,
                    filter:function(event,player){
                        if(event.source && get.getZJShaShili(event.source) == ZJNGEx.ZJShaGroupConst.long) return false;
                        //不明白
                        // if(event.source&&event.source.hasSkillTag('unequip',false,{ 
                        //     name:event.card?event.card.name:null, 
                        //     target:player, 
                        //     card:event.card 
                        // })) return false; 
                        //过滤卡牌的类型
                        return get.type2(event.card)==NG.CardType.Trick && get.color(event.card) == NG.CardColor.Red;
                    },
                    content:function(event: GameEvent, player: Player, trigger: GameEvent, result: BaseResultData){
                        player.popup("防止伤害");
                        trigger.cancel();
                    },
                    ai:{
                        notrick:true,
                        // ai日后添加
                        // effect:{
                        //     target:function(card,player,target,current){ 
                        //         // if(player.hasSkillTag('unequip',false,{ 
                        //         //     name:card?card.name:null, 
                        //         //     target:player, 
                        //         //     card:card 
                        //         // })) return; 
                        //         if(player && get.getZJShaShili(player) == ZJNGEx.ZJShaGroupConst.long) return;
                        //         if(get.type(card)=='trick'&&get.tag(card,'damage')){ 
                        //             return 'zeroplayertarget'; 
                        //         } 
                        //     },
                        // },
                    },
                };

                //势力:骑
                //圣骑   【被动技】  [自]攻击距离+2。
                let skill7:ExSkillData = {
                    name:"圣骑",
                    description:NG.Utils.translateDescTxt("【被动技】[自]攻击距离+2。"),
                    mod:{
                        attackFrom:function(from,to,range) {
                            return range - 2;
                        }
                    },
                };
                //新版：圣骑  【被动技】[自][距]-X(X=现存【骑】数)。
                let skill72:ExSkillData = {
                    name:"圣骑",
                    description:NG.Utils.translateDescTxt("【被动技】[自][距]-X(X=现存【骑】数)。"),
                    mod:{
                        globalFrom:function(from,to,range) {
                            return range - 2;
                        }
                    },
                };

                //势力:妖
                //妖族  【被动技】  [自]<摸牌>+X(X=现存[妖]数)。
                let skill8:ExSkillData = {
                    name:"妖族",
                    description:NG.Utils.translateDescTxt("【被动技】[自]<摸牌>+X(X=现存[妖]数)。"),
                    trigger:{
                        player:NG.PhaseTrigger.phaseDraw+NG.TriggerEnum.Begin,
                    },
                    frequent:true,
                    filter:function(event,player){
                        //至少都有一个自己，所以是必发的
                        return get.getZJShaShiliCount(ZJNGEx.ZJShaGroupConst.yao)>0;
                    },
                    content:function(event,player,trigger,result){
                        trigger.num += get.getZJShaShiliCount(ZJNGEx.ZJShaGroupConst.yao);
                    }
                };

                //势力:魔 (暂时没有)
                //魔神  【被动技】  [自]角色牌不会被横置和翻面。
                let skill9:ExSkillData = {
                    name:"魔神",
                    description:NG.Utils.translateDescTxt("【被动技】[自]角色牌不会被横置和翻面。"),
                    trigger:{
                        player:[NG.StateTrigger.link+NG.TriggerEnum.After,NG.StateTrigger.turnOver+NG.TriggerEnum.After],
                    },
                    filter:lib.filter.all,
                    forced:true,
                    content:function(event: GameEvent, player: Player, trigger: GameEvent, result: BaseResultData){
                        trigger.cancel();
                    },
                };

                //势力：神
                //神魔  【被动技】  [自]角色牌不会被横置和翻面。
                let skill10:ExSkillData = {
                    name:"神魔",
                    description:NG.Utils.translateDescTxt("【被动技】[自]角色牌不会被横置和翻面。"),
                    audio:3,
                    trigger:{
                        player:[NG.StateTrigger.link+NG.TriggerEnum.Begin,NG.StateTrigger.turnOver+NG.TriggerEnum.Begin],
                    },
                    filter:lib.filter.all,
                    // forced:true,
                    silent:true,
                    content:function(event: GameEvent, player: Player, trigger: GameEvent, result: BaseResultData){
                        if(event.triggername.indexOf(NG.StateTrigger.link)>-1) {
                            player.popup("不能被横置");
                        } else {
                            player.popup("不能被翻面");
                        }
                        trigger.cancel();
                    },
                    ai:{
                       noLink:true,
                       noTurnover:true 
                    },

                    //试着将其改为mod技：（后期）
                    // mod:{
                    // },
                };

                //势力：机
                // 机界 【被动技】[自]非【机】使用的黑色通常魔法牌的目标。
                let skill11:ExSkillData = {
                    name:"机界",
                    description:NG.Utils.translateDescTxt("[自]非【机】使用的黑色通常魔法牌的目标。"),
                    mod:{
                        targetEnabled:function(card,player,target) {
                            if (get.getZJShaShili(player) != ZJNGEx.ZJShaGroupConst.ji &&
                                get.type(card, null, player) == NG.CardType.Trick &&
                                get.color(card, player) == NG.CardColor.Black
                            ) {
                                return false;
                            }
                        },
                    },
                };


                let output = {
                    zj_shili_tianshi:skill12,//新
                    zj_shili_lianyu:skill222,//新新
                    zj_shili_fomeng:skill3,
                    zj_shili_fozu:exFoSkill1,
                    zj_shili_pusha:exFoSkill2,
                    zj_shili_shashou:skill42,//新
                    zj_shili_fashi:skill52,//新
                    zj_shili_longzu:skill62,//新
                    zj_shili_shengqi:skill72,//新
                    zj_shili_yaozu:skill8,
                    zj_shili_moshen:skill9,
                    zj_shili_shenmo:skill10,
                    zj_shili_jijie:skill11,
                }

                return output;
            });
    })();
}