module ZJNGEx {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "测试技能组6", NG.ImportFumType.skill,

            function (lib: Lib, game: Game, ui: UI, get: Get, ai: AI, _status: Status) {

                //龙魂   【被动技】  [自]<准备>，[自]从牌堆顶展示一张牌，若为黑色，[叠置]。
                let zj_longhun: ExSkillData = {
                    name:"龙魂",
                    // description:NG.Utils.translateDescTxt("【被动技】[自]<准>，[自][捡]1，若为黑色，将其[置]。"),
                    description:NG.Utils.translateDescTxt("【被动技】[自]<准备>，[自][捡]1，若为黑色，将其[置]“龙”。"),
                    trigger: {
                        player: NG.PhaseTrigger.phaseZhunbeiBegin,
                    },
                    frequent:true,
                    filter:lib.filter.all,
                    content: function (event: GameEvent, player: Player, trigger: GameEvent, result: BaseResultData) {
                        //从牌堆顶展示一张牌，若为黑色，[叠置]（将牌置于角色牌下）
                        "step 0"
                        //亮牌，并没什么特殊操作，故没有影响到result，需要自己把亮出牌设置到cards
                        event.cards = get.cards(1);
                        player.showCards(event.cards);
                        //自己手动构造设置判定结果：(不设result，可能时因为result不稳定，可能会被直接覆盖)
                        event.bool = get.color(event.cards[0]) == NG.CardColor.Black;
                        "step 1"
                        if(event.bool) {
                            //将牌置于武将牌下
                            //步骤：
                            //1.将指定的卡牌弃置到玩家的ui.special区域；
                            // player.lose(event.cards,ui.special,NG.StringTypeConst.toStorage);
                            // //2.设置到玩家对应缓存中
                            // player.storage.zj_longhun=player.storage.zj_longhun.concat(event.cards); 
                            // //手动同步标记
                            // player.syncStorage('zj_longhun'); 
                            // player.markSkill('zj_longhun');

                            //简化
                            player.markAutoBySpecial('zj_longhun',event.cards);
                        } else {
                            game.cardsDiscard(event.cards);
                        }
                    },
                    //[D]，[叠置]，这些都是标准的“标记”型技能，需要一定的标记使用，标记的简单使用：
                    //拥有此技能时，初始化一个该标记的缓存在玩家身上：
                    //简化：
                    // init:function(player){
                    //     //标记的key需要和技能名一致，游戏内都是通过对应skill取得对应的标记key
                    //     if(!player.storage) player.storage.zj_longhun = [];
                    //     //改为数字:
                    //     // if(!player.storage) player.storage.zj_longhun = 0;
                    // },
                    // mark:true,
                    marktext:"龙",
                    //该标记的描述：
                    intro:{
                        //该标记显示的内容时cards
                        content:NG.MarkContentConst.cards,
                        //移除该标记时为“丢弃”
                        onunmark:NG.StringTypeConst.throw
                    },
                    check:lib.filter.all
                };

                //龙力   【主动技】  [自]弃置一张[D]令[他]除去1点血量。
                let skill2: ExSkillData = {
                    name:"龙力",
                    // description:NG.Utils.translateDescTxt("【主动技】[自]弃置一张[D]令[他]除去1点血量。"),
                    description:NG.Utils.translateDescTxt("【主动技】[自]弃置一张“龙”和《杀》令[他]除去1点血量。"),
                    //【阶段技】
                    enable: NG.EnableTrigger.phaseUse,
                    // usable:1,
                    filter:function(event,player){ 
                        // if(player.storage.zj_longhun && player.storage.zj_longhun.length) return true; 
                        // 简化：
                        if(player.getStorage('zj_longhun').length && player.hasSha()) return true;
                    },
                    selectTarget:1,
                    filterTarget:function(card,player,target){
                        return player != target;
                    },
                    selectCard:1,
                    filterCard:{name:NG.CardNameConst.sha},
                    content: function (event: GameEvent, player: Player, trigger: GameEvent, result: BaseCommonResultData) {
                        //弃置一张[D] (目前先随机)
                        // console.log("龙力===>",event);
                        // player.storage.zj_longhun.randomGet();
                        // player.updateMark('zj_longhun');
                        // player.syncStorage('zj_longhun'); 
                        // 简化:
                        // player.unmarkAuto('zj_longhun',player.getStorage('zj_longhun').randomGets(1));
                        // console.log("测试longli--unmarkAutoBySpecial===>");
                        player.unmarkAutoBySpecial('zj_longhun',player.getStorage('zj_longhun').randomGets(1));
                        //新版需要弃置一张”sha“
                        player.discard(event.cards);
                        event.target.loseHp(1);
                    }
                };

                //龙甲   【被动技】  [自]受到伤害前，若有[D]，此伤害-1。
                let skill3:ExSkillData = {
                    name:"龙甲",
                    // description:NG.Utils.translateDescTxt("【被动技】[自]受到伤害前，[自]若有[D]，该伤害-1。"),
                    description:NG.Utils.translateDescTxt("【被动技】[自]受到魔法牌以外的伤害前，[自]若有“龙”，该伤害-1。"),
                    trigger:{
                        player:NG.StateTrigger.damageBegin3,
                    },
                    forced:true,
                    frequent:true,
                    popup:"龙甲",
                    filter:function(event,player){ 
                        //新版：扩展受到魔法牌以外的伤害前：
                        //不挡技能伤害：
                        if(!event.card || get.type2(event.card) == NG.CardType.Trick) return false;
                        // if(player.storage.zj_longhun && player.storage.zj_longhun.length) return true; 
                        // 简化：
                        if(player.getStorage('zj_longhun').length) return true;
                    },
                    content: function (event: GameEvent, player: Player, trigger: GameEvent, result: BaseResultData) {
                        trigger.num--;
                    }
                };

                let output = {
                    zj_longhun:zj_longhun,
                    zj_longli:skill2,
                    zj_longjia:skill3,
                }

                return output;
            });
    })();
}