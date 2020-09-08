module ZJNGEx {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "测试技能组15", NG.ImportFumType.skill,

            function (lib: Lib, game: Game, ui: UI, get: Get, ai: AI, _status: Status) {

                //法师   【被动技】  [自]使用一张魔法牌时，展示牌堆顶一张牌，若是魔法牌获得之。(通用技)
                let skill1: ExSkillData = {
                    name:"法师",
                    trigger: {
                        player:NG.CardTrigger.useCard,
                    },
                    filter:function(event,player){
                        if(get.type(event.card,NG.StringTypeConst.toStorage) == NG.CardType.Trick) {
                            return true;
                        }
                    },
                    forced:true,
                    //展示牌堆顶一张牌，若是魔法牌获得之
                    content: function (event: GameEvent, player: Player, trigger: GameEvent, result: BaseResultData) {
                        "step 0"
                        event.cards = get.cards(1);
                        player.showCards(event.cards);
                        "step 1"
                        if(event.cards && get.type(event.cards[0],NG.StringTypeConst.trick) == NG.CardType.Trick) {
                            player.gain(event.cards);
                        } else {
                            game.cardsDiscard(event.cards);
                        }
                    }
                };

                // 博览   【被动技】  [他]使用的通常魔法牌（《干扰魔术》/《二重魔术》和转化牌除外）在结算后置入弃牌堆时，将其[叠置]。
                let skill2: ExSkillData = {
                    name:"博览",
                    // description:NG.Utils.translateDescTxt("【被动技】[他]使用的通常魔法牌（《干扰魔术》/《二重魔术》和转化牌除外）在结算后置入弃牌堆时，将其[置]。"),
                    description:NG.Utils.translateDescTxt("【被动技】[他]使用的通常魔法牌（《干扰魔术》/《二重魔术》和转化牌除外）在结算后置入弃牌堆时，将其[置]“法”。"),
                    trigger:{
                        global:NG.CardTrigger.useCard+NG.TriggerEnum.After,
                    },
                    frequent:true,
                    filter:function(event,player) {
                        // console.log("法师====>",event.cards,event.card,get.position(event.cards[0],true),get.itemtype(event.cards));
                        let inclueldCard:string[] = [NG.CardNameConst.wuxie];
                        return event.cards &&
                            player != event.player &&
                            event.card.isCard && 
                            get.type2(event.card) == NG.CardType.Trick && 
                            !inclueldCard.contains(event.card.name) && 
                            get.itemtype(event.cards) == NG.ItemType.CARDS &&
                            //event.card是作为最终的卡牌
                            get.position(event.cards[0],true) == NG.PositionType.Ordering;
                    },

                    //标记相关：
                    init:function(player){
                        if(!player.storage.zj_bolang) player.storage.zj_bolang = [];
                    },
                    // mark:NG.MarkTypeConst.cards,
                    marktext:"法",
                    intro:{
                        content:NG.MarkContentConst.cards,
                        onunmark:NG.StringTypeConst.throw,
                    },

                    //将其[叠置]
                    content: function (event: GameEvent, player: Player, trigger: GameEvent, result: BaseResultData) {
                        "step 0"
                        // player.storage.zj_bolang.push(...trigger.cards);
                        // //同步标记
                        // player.syncStorage('zj_bolang');
                        // player.markSkill('zj_bolang');
                        // 可以尝试下这种简化写法
                        // game.log(player,'将'+get.cnNumber(player.lose(result.cards,ui.special,'toStorage').cards.length)+'张牌置于其武将牌上');
                        // player.lose(trigger.cards,ui.special,NG.StringTypeConst.toStorage);
                        // player.markAuto('zj_bolang',trigger.cards);
                        player.markAutoBySpecial('zj_bolang',trigger.cards);
                    }
                };


                //神法   【主动技】  [任一]<结束>，[自]可将[自]所有[D]加入手牌，[自]将手牌的张数弃置至血槽值。
                let skill3:ExSkillData = {
                    name:"神法",
                    // description:NG.Utils.translateDescTxt("【主动技】[任]<结>，[自]可将[自]所有[D]加入手牌，[自]将手牌的张数弃置至血槽值。"),
                    description:NG.Utils.translateDescTxt("【主动技】[任]<结>，[自]可将[自]所有[D]加入手牌，[自]将手牌的张数弃置至现存角色数。"),
                    trigger:{
                        global:NG.PhaseTrigger.phaseJieshuBegin,
                    },
                    filter:function(event,player) {
                        return player.storage.zj_bolang && player.storage.zj_bolang.length>0;
                    },
                    content:function(event: GameEvent, player: Player, trigger: GameEvent, result: BaseResultData) {
                        "step 0"
                        player.gain(player.storage.zj_bolang,NG.StringTypeConst.fromStorage);
                        player.unmarkAuto('zj_bolang',player.storage.zj_bolang);
                        "step 1"
                        // player.storage.zj_bolang.length = 0;
                        // player.syncStorage('zj_bolang');
                        // player.markSkill('zj_bolang');

                        //旧版：
                        // let count = player.maxHp - player.countCards(NG.PositionType.Handcard);
                        // if(count >= 0) {
                        //     count = 0;
                        // } else {
                        //     count = Math.abs(count);
                        // }
                        // if(count){
                        //     // player.discard(count,"将手牌的张数弃置至血槽值");
                        //     player.chooseToDiscard(count,"将手牌的张数弃置至血槽值");
                        // } 
                        
                        // 新版技能：弃置至现存角色数
                        let count = get.players().length;
                        let num = Math.max(0,player.countCards(NG.PositionType.Handcard)-count);
                        if(num>0) player.chooseToDiscard(num,"将手牌的张数弃置至现存角色数",true);
                    }
                };

                // 神法   【主动技】  [自]两张[D]可以当任一通常魔法牌使用。
                let skill4:ExSkillData = {
                    name:"圣法",
                    // description:NG.Utils.translateDescTxt("【主动技】[自]两张[D]可以当任一通常魔法牌使用。"),
                    //新版描述
                    description:NG.Utils.translateDescTxt("【主动技】[自]两张“法”可以当任一通常魔法牌使用。"),
                    // enable:[NG.EnableTrigger.chooseToRespond,NG.EnableTrigger.chooseToUse,NG.EnableTrigger.phaseUse],
                    group:["zj_shenfa2_trick","zj_shenfa2_wuxie"],
                    subSkill:{
                        trick:{
                            enable:NG.EnableTrigger.phaseUse,
                            filter:function(event,player) {
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
        
                                return player.getStorage("zj_bolang").length >= 2 && list.length>0;
                            },
                            content:function(event: GameEvent, player: Player, trigger: GameEvent, result: BaseCommonResultData){
                                "step 0"
                                player.chooseCardButton(2,player.storage.zj_bolang,"选择两张置于武将牌上的‘法’");
                                "step 1"
                                // console.log("圣法===>",result);
                                if(result.bool && result.links && result.links.length>=2) {
                                    //保存选中的卡牌
                                    event.cards = result.links;
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
                                    // console.log("圣法===>",list);
                                    // player.chooseControlList(list,"选择视为使用的通常魔法卡：");
                                    if(list.length) {
                                        player.chooseVCardButton(list,true,"选择视为使用的通常魔法卡：").filterButton = function(button: Button, player: Player) {
                                            //该button是vcard， vcard基本结构：[类型?不知为什么用get.type，数字，卡牌名]
                                            let link = button.link as CardBaseData;
                                            // let card:CardBaseUIData = {name:link.name};
                                            // return link && lib.filter.cardUsable
                                            return link && lib.filter.filterCard({name:link[2]},player);
                                        };
                                        return;
                                    }
                                } 
                                event.finish();
                                "step 2"
                                // console.log("圣法 step 2===>",result,event.cards);
                                if(result && result.bool && result.links) {
                                    //该button是vcard， vcard基本结构：[类型?不知为什么用get.type，数字，卡牌名]
                                    // let vcard = result.links[0];
                                    let vcard:CardBaseUIData = {name:result.links[0][2]};
                                    //useCard，需要自己设置，目标，现在发现有一个使用canUse过滤目标，chooseUseTarget
                                    // player.useCard(vcard,event.cards);
                                    player.chooseUseTarget({name:result.links[0][2]},event.cards,true);
                                    //移除标记（使用的话，应该不需要自己移除）
                                    // player.lose(result.cards);
                                    // player.unmarkAuto("zj_bolang",event.cards);
                                    player.unmarkAutoBySpecial("zj_bolang",event.cards,NG.PositionType.Ordering)
                                }
                            },
                        },
                        //发动无懈做成独立的子技能
                        wuxie:{
                            enable:[NG.EnableTrigger.chooseToUse],//NG.EnableTrigger.chooseToRespond,
                            filter:function(event,player){
                                return player.getStorage("zj_bolang").length >= 2 && event.type == NG.GameEventType.wuxie;
                            },
                            //不知为何，涉及标记操作，总是这么多bug，哎
                            chooseButton:{
                                dialog:function(event,player){
                                    return ui.create.dialog(`圣法:选择置于武将牌上的‘法’当作【${get.translation(NG.CardNameConst.wuxie)}】使用`,player.storage.zj_bolang,'hidden');
                                },
                                select:2,
                                prompt:function (links,player){
                                    // return '选择'+get.translation(links)+`置于武将牌上的‘法’当作【${get.translation(NG.CardNameConst.wuxie)}】使用`;
                                    return `当作【${get.translation(NG.CardNameConst.wuxie)}】使用`;
                                },
                                backup:function (links,player){
                                    // var evt=_status.event;
                                    // var result=evt._result as BaseCommonResultData;
                                    // player.unmarkAuto("zj_bolang",links);
                                    // 标记没有去掉
                                    // console.log("backup===>",player,game.me);
                                    // player.unmarkAutoBySpecial("zj_bolang",links,NG.PositionType.Ordering);
                                    /*
                                    * 在backup执行方法无法触发通信的原因：
                                    * 苏婆玛丽奥  11:50:33
                                       主机不需要执行
                                       这玩意是直接客机执行的
                                       执行完了 把总的结果和生成的backup技能发过去
                                    */
                                    return {
                                        viewAs:{name:NG.CardNameConst.wuxie,cards:links},
                                        selectCard:0,
                                        onuse:function(result,player){
                                            // console.log("onuse===>",result.card.cards);
                                            //把视为牌上的cards在处理该backup技能时，onuse时，处理该卡牌
                                            player.unmarkAutoBySpecial("zj_bolang",result.card.cards,NG.PositionType.Ordering);
                                        },
                                        
                                    };
                                },
                            },
                            // 还是老问题，常规使用useCard，chooseToUse，需要，目标，卡牌(不过想尽办法，给它找到正确的目标，卡牌，也不行，无法加入“_wuxie”的流程中)
                            // content:function(event: GameEvent, player: Player, trigger: GameEvent, result: BaseCommonResultData){
                            //     "step 0"
                            //     player.chooseCardButton(2,player.storage.zj_bolang,"选择两张置于武将牌上的‘法’");
                            //     "step 1"
                            //     // console.log("圣法===>",result);
                            //     if(result.bool && result.links && result.links.length>=2) {
                            //         if(result && result.bool && result.links) {
                            //             //强制在enable中直接发动useCard，虽然发动成功，但是该“wuxie”不是_wuxie流程中使用，无法触发无效的效果
                            //             let respondTo = event.getParent().respondTo;
                            //             event._trigger = event.getParent(5);//递归到使用卡牌那里，看看效果;getParent(2)是_wuxie
                            //             console.log("圣法--wuxie===》",event._trigger,respondTo);
                            //             //强制式断点
                            //             // while(true) {
                            //             //     //强制式断点
                            //             // }
                            //             player.useCard({name:NG.CardNameConst.wuxie},result.links,respondTo[0]);
                            //             player.unmarkAutoBySpecial("zj_bolang",result.links,NG.PositionType.Ordering);
                            //         }
                            //     } 
                            // },
                            hiddenCard:function(player,name){
                                // console.log("shengfa_wuxie===>",player,name);
                                return player.getStorage("zj_bolang").length >= 2 && name == NG.CardNameConst.wuxie;
                            }
                        },
                    },
                    //这种，当作，视为的技能，可能需要直接采用视为技标准来开发:
                    //这种动态变化视为牌的技能，需要chooseButton的写法：

                    //感觉还不行：因为场外区的操作暂时无法直接在game.check操作
                    // chooseButton:{
                    //     dialog:function(event,player){
                    //         return ui.create.dialog('圣法',player.storage.zj_bolang,'hidden');
                    //     },
                    //     select:2,
                    //     prompt:function (links,player){
                    //         var evt=_status.event;
                    //         var result=evt._result as BaseCommonResultData;
                    //         if(result.bool && result.links) {
                    //             return '选择'+get.translation(result.links)+'置于武将牌上的‘法’';
                    //         }
                    //     },
                    //     backup:function (links,player){
                    //         var evt=_status.event;
                    //         var result=evt._result as BaseCommonResultData;
                    //         evt.oCards = result.links;
                    //         return {
                    //             viewAs:{name:evt.oCard.name,cards:evt.oCards},
                    //             selectButton:1,
                    //             chooseButton:{
                    //                 //第一步：创建选择视为的牌所使用的牌（当前从标记中）
                    //                 dialog:function(event: GameEvent, player: Player){
                    //                     let list = get.inpile(NG.CardType.Trick);
                    //                     // var evt=_status.event.getParent();
                    //                     //排除无法直接使用的牌，经观察，有notarget=true,的牌是不对角色目标使用；
                    //                     for (let i = list.length-1; i >= 0; i--) {
                    //                         const skill = list[i];
                    //                         // let info = get.info({name:skill});
                    //                         //任一就是都行：无懈也可以(无懈可能要令开一个方法来)
                    //                         // if(info && info.notarget) {
                    //                         //     list.splice(i,1);
                    //                         // } else if(!info) {
                    //                         //     list.splice(i,1);
                    //                         // }
                    //                         if(!lib.filter.filterCard({name:skill},player,event)) {
                    //                             list.splice(i,1);
                    //                         }
                    //                     }
                    //                     let vList = [];
                    //                     for (let i = 0; i < list.length; i++) {
                    //                         const skill = list[i];
                    //                         vList.push([NG.CardType.Trick,"",skill]);
                    //                     }
                    //                     return ui.create.dialog('圣法',[vList,'vcard']);
                    //                 },
                    //                 backup:function (links,player){
                    //                     var evt=_status.event;
                    //                     evt.oCard = {name:links[0][2]};
                    //                     // return {
                    //                     //     viewAs:{name:links[0][2],cards:evt.oCards},
                    //                     // }
                    //                     return {};
                    //                 },
                    //                 prompt:function (links,player){
                    //                     return '当'+get.translation(links[0][2])+'使用';
                    //                 },
                    //             },
                                
                    //         }
                    //         // if(result.bool && result.links) {
                    //         // } else {
                    //         //     return {};
                    //         // }
                    //     },
                    // },

                    //第三解决方案：将流程反过来，先选择变化的牌的，再选择需要弃置的牌
                //     chooseButton:{
                //         //第一步：创建选择视为的牌所使用的牌（当前从标记中）
                //         dialog:function(event: GameEvent, player: Player){
                //             let list = get.inpile(NG.CardType.Trick);
                //             for (let i = list.length-1; i >= 0; i--) {
                //                 const skill = list[i];
                //                 if(!lib.filter.filterCard({name:skill},player,event)) {
                //                     list.splice(i,1);
                //                 }
                //             }
                //             let vList = [];
                //             for (let i = 0; i < list.length; i++) {
                //                 const skill = list[i];
                //                 vList.push([NG.CardType.Trick,"",skill]);
                //             }
                //             return ui.create.dialog('圣法',[vList,'vcard']);
                //         },
                //         backup:function (links,player){
                //             var evt=_status.event;
                //             evt.oCard = {name:links[0][2]};
                //             return {
                //                 viewAs:{name:evt.oCard.name,cards:links},
                //                 chooseButton:{
                //                     dialog:function(event,player){
                //                         return ui.create.dialog('圣法',player.storage.zj_bolang,'hidden');
                //                     },
                //                     select:2,
                //                     prompt:function (links,player){
                //                         var evt=_status.event;
                //                         // var result=evt._result as BaseCommonResultData;
                //                         return '当'+get.translation(evt.oCard)+'使用';
                //                     },
                //                     backup:function (links,player){
                //                         return {};
                //                     },
                //                 }
                //             };
                //         },
                //         prompt:function (links,player){
                //             return '需要弃置两个【法】当'+get.translation(links[0][2])+'使用';
                //         },             
                //     },
                };


                let output = {
                    // test_skill1:skill1,
                    zj_bolang:skill2,
                    zj_shenfa:skill3,
                    zj_shenfa2:skill4,
                }

                return output;
            });
    })();
}