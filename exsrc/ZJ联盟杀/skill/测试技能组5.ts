module ZJNGEx {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "测试技能组5", NG.ImportFumType.skill,

            function (lib: Lib, game: Game, ui: UI, get: Get, ai: AI, _status: Status) {
                //剑制   【主动技】  [自]<准备>，[自]展示牌堆顶的4张牌，[自]获得武器牌和《杀》，并将其余的牌置入弃牌堆，回合内，[自]使用的《杀》的伤害值+1且受到此伤害的角色进入[重伤状态]。 
                //原型：“new_reluoyi”,“wansha”
                let skill1: ExSkillData = {
                    name:"剑制",
                    description:NG.Utils.translateDescTxt("【主动技】[自]<准>，[捡]2，[自]获得武器牌和《杀》，回合内，[自]使用的《杀》的伤害值+1且受到此伤害的角色进入[重伤]。 "),
                    trigger: {
                        player: NG.PhaseTrigger.phaseZhunbeiBegin,
                    },
                    content: function (event: GameEvent, player: Player, trigger: GameEvent, result: BaseCommonResultData) {
                        "step 0"
                        //展示牌堆顶的2张牌
                        var cards=get.cards(2);
                        game.cardsGotoOrdering(cards); //希望以后处理区放在
                        player.showCards(cards,`【${get.translation(player)}】获得武器牌和《杀》`); 
                        //获得武器牌和《杀》
                        var cardsx=[]; 
                        var discardsx = [];
                        for(var i=0;i<cards.length;i++){ 
                            if(get.name(cards[i])==NG.CardNameConst.sha ||
                                get.subtype(cards[i])==NG.CardType.Equip1){ 
                                cardsx.push(cards[i]); 
                            } else {
                                discardsx.push(cards[i]);
                            }
                        } 
                        event.cards = cardsx;
                        event.oCards = discardsx;
                        "step 1"
                        if(event.cards.length) {
                            player.gain(event.cards,NG.AniNmaeConst.gain2);
                            player.discard(event.oCards);
                        }
                        //额外发动
                        //添加持续加伤技能：
                        player.storage.shaDamageAdd = 1;
                        player.addTempSkill("shaDamageAdd");
                        //添加重伤状态：
                        player.addTempSkill('addZhongshangState');
                    }
                };


                //杀造成伤害时，添加“重伤状态”
                let addZhongshangState:ExSkillData = {
                    name:"重伤",
                    description:"【附加重伤】：你可以附加【重伤状态】（回合内，重伤状态的角色不能成为《血》的目标。）",
                    trigger:{
                        source:NG.StateTrigger.damageBegin1,
                    },
                    silent:true,
                    locked:true,
                    global:"zhongshangState2",
                    // mark:character，只能在表示一个角色时使用，标记已角色牌形式显示
                    mark:true,
                    marktext:"重",
                    intro:{
                        // content:NG.MarkContentConst.character, 
                        // content:`当前回合，你对$施加了【重伤状态】(当前回合，除你以外，不处于濒死状态的角色不能使用《血》)`
                        // content:function(storage,player,name) {
                        //     if(storage.addZhongshangState && storage.addZhongshangState.length) {
                        //         return `当前回合，你对【${get.translation(storage.addZhongshangState)}】施加了【重伤状态】(当前回合，除你以外，不处于濒死状态的角色不能使用《${get.translation(NG.CardNameConst.tao)}》)`
                        //     } else {
                        //         return "当前回合，你暂时没附加【重伤状态】给其他角色";
                        //     }
                        // },
                        content:NG.MarkContentConst.players,
                        // onunmark:
                    },
                    filter:function(event,player) {
                        if(event.source!=player) return false;
                        if(event.card && get.name(event.card) == NG.CardNameConst.sha) return true;
                    },
                    init:function(player){
                        player.storage.addZhongshangState = [];
                    },
                    onremove:function(player,skill){
                        (<Player[]>player.storage.addZhongshangState).forEach(function(player){
                            player.removeSkill("zhongshangState");
                        });
                        delete player.storage.addZhongshangState;
                        // player.unmarkSkill("zhongshangState");
                    },
                    content:function(event: GameEvent, player: Player, trigger: GameEvent, result: BaseCommonResultData) {
                        // trigger.player.addTempSkill();
                        //和完杀有点不一样，每次由杀造成一次伤害的该角色，才进入被完杀的状态
                        // console.log("【附加重伤】,目标：",trigger.player,event);
                        if(!player.storage.addZhongshangState.contains(trigger.player)) {
                            player.storage.addZhongshangState.push(trigger.player);
                            trigger.player.storage.zhongshangState = player;
                            trigger.player.addTempSkill("zhongshangState");
                            player.markSkill('addZhongshangState');//主动显示
                            player.syncStorage('addZhongshangState'); 
                        }
                    },
                };

                //重伤状态：自己不能是“血”的目标（和完杀有点不一样）
                //[重伤]重伤状态：回合内，重伤状态的角色[自]非《血》的目标。 
                //标记重伤状态角色
                let zhongshangState:ExSkillData = {
                    name:"重伤状态",
                    description:"【重伤状态】",
                    mark:NG.MarkTypeConst.character,
                    marktext:"重",
                    //该标记已经新由发起重伤的人添加了
                    //该标记的描述：
                    intro:{
                        // content:function(storage,player,skill){
                        //     let source:Player = storage;  
                        //     return `当前回合，除${get.translation(source)}以外，不处于濒死状态的角色不能使用【桃】。`;
                        // },
                        // content:`当前回合，除$以外，不处于濒死状态的角色不能使用《血》。`,
                        content:`回合内，重伤状态的角色不能成为《血》的目标。`,
                    },
                    //技能被移除时，该技能名的标记也被移除
                    onremove:true,
                    // onremove:function(player,skill){
                    //     player.unmarkSkill("zhongshangState");
                    // },
                    ai:{
                        zhongshangState:true,
                    },
                };

                //响应重伤状态
                let zhongshangState2:ExSkillData = {
                    //后续，整理每个mod主要触发的范围：（核心阶段，get方法，filter方法）
                    mod:{
                        //“cardEnabled2”，“cardSavable”mod都是直接用于濒死阶段，filterCard的过滤条件
                        //能用卡牌救人：
                        cardSavable:function(card,player){
                            if(!_status.currentPhase) return;
                            //当前阶段玩家存活：
                            //当前阶段玩家拥有技能“addZhongshangState”
                            //player不是当前玩家：（不需要）
                            //不处于濒死状态的玩家，不能使用tao救人：
                            //当前处于濒死状态的玩家要拥有“zhongshangState”标记技能；
                            if(!_status.event.dying) return;
                            //_status.event.dying
                            if(_status.currentPhase.isAlive()&&
                                _status.currentPhase.hasSkill('addZhongshangState')&&
                                (<Player[]>_status.currentPhase.storage.addZhongshangState).contains(_status.event.dying)
                                ){
                                //&&player.hasSkill("zhongshangState")
                                if(get.name(card,player) == NG.CardNameConst.tao) return false;
                            }
                        },
                        //额外增加
                        // cardEnabled2:function(card,player){
                        //     if(!_status.currentPhase) return;
                        //     if(!_status.event.dying) return;
                        //     if(_status.currentPhase.isAlive()&&
                        //         _status.currentPhase.hasSkill('addZhongshangState')&&
                        //         _status.currentPhase!=player&&
                        //         (<Player[]>_status.currentPhase.storage.addZhongshangState).contains(_status.event.dying)
                        //         ){
                        //         //&&player.hasSkill("zhongshangState")
                        //         if(get.name(card,player) == NG.CardNameConst.tao && !player.isDying()) return false;
                        //     }
                        // },

                        //原版完杀，是判定这个的
                        //能用的卡牌：
                        cardEnabled:function(card,player){
                            // if(!_status.currentPhase) return;
                            // if(!_status.event.dying) return;
                            // if(_status.currentPhase.isAlive()&&
                            //     _status.currentPhase.hasSkill('addZhongshangState')&&
                            //     _status.currentPhase!=player&&
                            //     (<Player[]>_status.currentPhase.storage.addZhongshangState).contains(_status.event.dying)
                            //     ){
                            //     //&&player.hasSkill("zhongshangState")
                            //     if(get.name(card,player) == NG.CardNameConst.tao && !player.isDying()) return false;
                            // }

                            if(!_status.currentPhase) return;
                            if(!_status.event.dying) return;
                            if(_status.currentPhase.isAlive()&&
                                _status.currentPhase.hasSkill('addZhongshangState')&&
                                (<Player[]>_status.currentPhase.storage.addZhongshangState).contains(_status.event.dying)
                                ){
                                if(get.name(card,player) == NG.CardNameConst.tao) return false;
                            }
                        }
                    }
                };

                //参考，如何临时给全员添加某种buff
                //当需要该buff技能时，加载一个临时技能：player.addTempSkill('wansha');lose
                //完杀的触发代码
                // 描述：锁定技，你的回合内，除你以外，不处于濒死状态的角色不能使用【桃】。
                // let zhongshangState:ExSkillData = {
                //     locked:true,
                //     //关键：当你拥有此技能时，所有角色拥有此技能，这样就不需要给所有角色都上一个临时技能
                //     global:"wansha2",
                //     trigger:{
                //         global:"dying",
                //     },
                //     priority:15,
                //     forced:true,
                //     filter:function(event,player){ 
                //         return _status.currentPhase==player&&event.player!=player; 
                //     },
                //     content:function(){},
                // }
                // let wansha2:ExSkillData = {
                //     mod:{
                //         //能用卡牌救人：
                //         cardSavable:function(card,player){
                //             if(!_status.currentPhase) return;
                //             if(_status.currentPhase.isAlive()&&_status.currentPhase.hasSkill('wansha')&&_status.currentPhase!=player){
                //                 if(card.name=='tao'&&!player.isDying()) return false;
                //             }
                //         },
                //         //能用的卡牌：
                //         cardEnabled:function(card,player){
                //             if(!_status.currentPhase) return;
                //             if(_status.currentPhase.isAlive()&&_status.currentPhase.hasSkill('wansha')&&_status.currentPhase!=player){
                //                 if(card.name=='tao'&&!player.isDying()) return false;
                //             }
                //         }
                //     }
                // };

                
                let output = {
                    zj_jianzhi:skill1,
                    //【重伤状态】
                    addZhongshangState:addZhongshangState,//添加重伤状态
                    zhongshangState:zhongshangState,//重伤状态
                    zhongshangState2:zhongshangState2,//响应重伤
                }

                return output;
            });
    })();
}