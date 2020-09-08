module ZJNGEx {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "测试技能组2", NG.ImportFumType.skill,

            function (lib: Lib, game: Game, ui: UI, get: Get, ai: AI, _status: Status) {

                //炼狱   【被动技】  [自][反面]，[自][翻面][自]视为对[他]使用一张《杀》。
                // let skill1: ExSkillData = {
                //     name:"炼狱",
                //     description:"",//
                //     //【被动技】  [自][反面]
                //     trigger: {
                //         player: NG.StateTrigger.turnOver+NG.TriggerEnum.End,
                //     },
                //     //[反面]
                //     filter: function (event: Trigger, player: Player) {
                //         console.log(`炼狱发动过滤是的翻面状态：${player.isTurnedOver()?"翻面":"翻回正面"}`);
                //         return player.isTurnedOver();
                //     },
                //     //[自][翻面][自]视为对[他]使用一张《杀》。
                //     content: function (event: GameEvent, player: Player, trigger: GameEvent, result: BaseResultData) {
                //         "step 0"
                //         //[自][翻面]
                //         player.turnOver(!player.isTurnedOver());
                //         "step 1"
                //         //[自]视为对[他]
                //         player.chooseTarget(
                //             1,
                //             true,
                //             function(card: Card, player: Player, target: Target){
                //                 return target != player;
                //             },
                //             `选择一名其他角色，视为对其使用一张《${lib.translate[NG.CardNameConst.sha]}》`
                //         );
                //         "step 2"
                //         //视为对[他]使用一张《杀》。
                //         if(result && result.bool) {
                //             let target = (<BaseCommonResultData>result).targets[0];
                //             if(target) {
                //                 player.useCard({name:NG.CardNameConst.sha,isCard:true},target,false);
                //             }
                //         }
                //     }
                // };

                //新华富
                //华富   【阶段技】  [自]弃置X张手牌令手牌数为≤10（X至少为1），[自]须跳过<弃牌>，[自][翻面]。
                let skill2:ExSkillData = {
                    // name:"新华富测试",
                    name:"华富",
                    description:NG.Utils.translateDescTxt("【主动技】[自]弃置X张[手]令[手]数为≤10（X≥1），[自]须跳过<弃>，[自][翻]。"),
                    enable:NG.EnableTrigger.phaseUse,
                    usable:1,
                    // selectCard:function(){
                    //     let player = _status.event.player;
                    // },
                    filter:function(event: Trigger, player: Player){
                        return player.countCards(NG.PositionType.Handcard)>0;
                    },
                    content:function(event: GameEvent, player: Player, trigger: GameEvent, result: BaseResultData) {
                        "step 0"
                        //[自]弃置X张手牌令手牌数为≤10（X至少为1）
                        var hCount = player.countCards(NG.PositionType.Handcard);
                        var minCount = hCount>=10?hCount-10:1;
                        //改成必须弃置指定数量
                        player.chooseToDiscard(minCount,NG.PositionType.Handcard);
                        "step 1"
                        //[自]须跳过<弃牌>，[自][翻面]
                        if(result && result.bool) {
                            //跳过<弃牌>
                            player.addTempSkill("zj_skip_PhaseDiscard");

                            //[自][翻面]
                            player.turnOver(true);
                        }
                    }
                };

                //佛门   【被动技】  [自]手牌上限+X(X=现存[佛]数+1)。
                // let skill3:ExSkillData = {
                //     name:"新佛门测试",

                //     //实际上为锁定技
                //     mod:{
                //         //手牌上限+X(X=现存[佛]数+1)
                //         maxHandcard:function(player: Player, num: number){ 
                //             //(X=现存[佛]数+1),目前还没开始做势力标记
                //             return num+get.getZJShaShiliCount(ZJNGEx.ZJShaGroupConst.fo); 
                //         },
                //     },
                // };

                //间反【阶段技】 [自]展示一张[手]并交给[他]，其选择一项：(1)其展示所有[手]并弃置与此牌花色相同的所有牌；(2)其除去1点血量。
                let skill4:ExSkillData = {
                    name:"间反",
                    description:NG.Utils.translateDescTxt("【阶段技】[自]展示一张[手]并交给[他]，其选择一项：(1)其展示所有[手]并弃置与此牌花色相同的所有牌；(2)其除去1点血量。"),
                    enable:NG.EnableTrigger.phaseUse,
                    usable:1,
                    filter:function(event,player) {
                        return player.countCards(NG.PositionType.Handcard)>0;
                    },
                    selectCard:1,
                    filterCard:lib.filter.all,
                    position:NG.PositionType.Handcard,
                    selectTarget:1,
                    filterTarget:function(card,player,target) {
                        return player != target;
                    },
                    content:function(event: GameEvent, player: Player, trigger: GameEvent, result: BaseCommonResultData){
                        "step 0"
                        // if(result && result.cards) {
                        //     event.cards = result.cards;
                        //     player.showCards(result.cards);
                        // } else event.finish();
                        player.showCards(event.cards);
                        "step 1"
                        // event.target.gain(result.cards);
                        event.targets[0].gain(event.cards,player,NG.AniNmaeConst.gain2);
                        "step 2"
                        // var next = event.target.chooseControlList([
                        //     "展示所有手牌并弃置与此牌花色相同的所有牌",
                        //     "除去1点血量"
                        // ],true);
                        var next = event.targets[0].chooseControlList([
                            "展示所有手牌并弃置与此牌花色相同的所有牌",
                            "除去1点血量"
                        ],true);
                        "step 3"
                        if(result.index == 0) {
                            event.targets[0].showHandcards(result.control);
                        } else if(result.index == 1) {
                            event.targets[0].loseHp();
                            event.finish();
                        }
                        "step 4"
                        //继续第一个选项得操作：
                        // let basecard:CardBaseUIData = {suit:get.suit(event.cards)};
                        // let _cards = event.target.getCards(NG.PositionType.Handcard,basecard);
                        let basecard:CardBaseUIData = {suit:get.suit(event.cards)};
                        let _cards = event.targets[0].getCards(NG.PositionType.Handcard,basecard);
                        event.target.discard(_cards);
                    }
                };

                //汉伦   【被动技】  [自]非[他](装备区里没有武器牌)使用的《杀》/《大对决术》/《奥义秘术》的目标。
                let skill5:ExSkillData = {
                    name:"汉伦",
                    description:NG.Utils.translateDescTxt("【被动技】[自]非[他]({武}没牌时)使用的《杀》/《大对决术》/《奥义秘术》的目标。"),
                    mod:{
                        targetEnabled:function(card,player,target){
                            let cardName:string[] = [NG.CardNameConst.sha,NG.CardNameConst.juedou,NG.CardNameConst.aoyi];
                            if(!target.hasCard((card)=>{
                                return get.subtype(card) == NG.CardType.Equip1;
                            },NG.PositionType.Equip) && cardName.contains(get.name(card))) return false;
                            // return true;
                        },
                    }
                };

                let output = {
                    zj_huafu2:skill2,

                    zj_jianfan:skill4,
                    zj_hanlun:skill5,

                }
                
                return output;
            });
    })();
}