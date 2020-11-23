module ZJNGEx {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "测试技能组14", NG.ImportFumType.skill,

            function (lib: Lib, game: Game, ui: UI, get: Get, ai: AI, _status: Status) {

                //炼狱   【被动技】  [自][反翻]，[自]视为对[他]使用一张《杀》。 
                let skill1: ExSkillData = {
                    group:["炼狱"]
                };
                
                //神伟   【改判技】  [自]获得该判定牌并令其重新进行一次判定。(旧版，过强)
                let skill2: ExSkillData = {
                    name:"神伟",
                    description:NG.Utils.translateDescTxt("【改判技】[自]获得该判定牌并令其重新进行一次判定。"),
                    trigger:{
                        global:NG.PhaseTrigger.judge,
                    },
                    filter:function(event,player){
                        //这样每次都会询问我该技能的触发
                        //解决方法：有一个歪技，不需要去添加额外技能之类：
                        //直接再filter中处理，若有，则删除标记，并且返回false过滤掉技能

                        //不确定可以，目前info.filter有两个时机调用：1.game.check;2.lib.filter.filterTrigger
                        //特别是game.check调用特别频繁（这样一看，好像不行，不能再filter中处理）
                        // let trigger = event._trigger;
                        // if(trigger.name == NG.PhaseTrigger.judge && 
                        //     player.storage.shenwei && 
                        //     player.storage.shenwei.player == trigger.player && 
                        //     player.storage.shenwei.skill == trigger.skill) {
                        //         delete player.storage.shenwei;
                        //         return false; 
                        // } else if(trigger.name == NG.PhaseTrigger.judge) {
                        //     if(player.storage.shenwei && 
                        //         player.storage.shenwei.player == trigger.player && 
                        //         player.storage.shenwei.skill == trigger.skill) {
                        //             delete player.storage.shenwei;
                        //             return false; 
                        //         }
                        //     return true;
                        // }

                        //第二解决方法：使用临时技能取消；
                        let trigger = event._trigger;
                        if(!player.storage.shenwei || 
                            (player.storage.shenwei.player != trigger.player && 
                            player.storage.shenwei.skill != trigger.skill)) {
                                return true; 
                            }
                    },
                    content: function (event: GameEvent, player: Player, trigger: GameEvent, result: JudgeResultData) {
                        // player.replaceJudge();
                        //重新进行，判定，该描述，可以继续下去，这个和改判有点不一样：
                        delete player.storage.shenwei;
                        player.gain(trigger.player.judging[0]);
                        trigger.untrigger(true);
                        //重新设置事件触发回到原本的位置
                        trigger._triggered=2;//事件触发中
                        trigger.step = 0;//重新重0开始

                        //如果这样做的话，该技能可能反复横跳地触发：
                        //目前解决方法1：给技能添加使用次数限制，不过会违背原来效果的初衷；
                        //目前解决方法2：先记录下来当前发起判定的玩家与技能，再下一次再触发到，删除该触发储存；
                        //后续问题：
                        //目前该标记只记录一份，感觉还是有问题，但是因为当前判定结束后，会删除，问题不大；
                        //但是，如果出现某些判定技能，内含多次判定触发....应该是有问题的，等待后续验证
                        player.storage.shenwei = {
                            player:trigger.player,
                            skill:trigger.skill
                        };
                        //第二解决方法：使用一个特别临时技能来进行取消
                        player.addTempSkill('cancelReplaceJudge',NG.PhaseTrigger.judge + NG.TriggerEnum.After);


                        //转移到filter中处理（貌似不行）
                        // if(trigger.name == NG.PhaseTrigger.judge + NG.TriggerEnum.After) {
                        //     delete player.storage.shenwei;
                        // }
                        // else if(player.storage.shenwei && 
                        //     player.storage.shenwei.player == trigger.player && 
                        //     player.storage.shenwei.skill == trigger.skill) {
                        //         delete player.storage.shenwei;
                        // } 
                        // else {
                        // }

                        //后续问题：
                        //如果，出现其他类似技能，可能会出现问题
                        //例如有两个同样可以取消触发的，他们之间互相取消触发重置；
                        //目前，删除标记的方式，需要再判定阶段结束后触发，应该可以保障同一个判定事件循环触发，后续验证
                    }
                };

                //取消重复判定的标记
                let cancelReplaceJudge:ExSkillData = {
                    forced:true,
                    // forceDie:true,
                    // popup:false,
                    silent:true,
                    filter:function(event,player){
                        let trigger = event._trigger;
                        if(player.storage.shenwei && 
                            player.storage.shenwei.player == trigger.player && 
                            player.storage.shenwei.skill == trigger.skill) {
                                return true; 
                            }
                    },
                    trigger:{
                        global:NG.PhaseTrigger.judge + NG.TriggerEnum.End
                    },
                    content:function(event: GameEvent, player: Player, trigger: GameEvent, result: JudgeResultData){
                        delete player.storage.shenwei;
                        player.removeSkill('cancelReplaceJudge');//提前删除
                    }
                };

                //神伟   【改判技】  [自]获得该判定牌并令其展示牌堆顶的一张牌代替之。（新版）
                let skill22: ExSkillData = {
                    name:"神伟",
                    description:NG.Utils.translateDescTxt("【改判技】[自]获得该判定牌并令其展示牌堆顶的一张牌代替之。"),
                    trigger:{
                        global:NG.PhaseTrigger.judge,
                    },
                    content:function(event: GameEvent, player: Player, trigger: GameEvent, result: JudgeResultData){
                        //直接改成替换
                        // "step 0"
                        // event.card = trigger.player.judging[0];
                        // player.gain(event.card);
                        // //如果你要在判定牌生效前拿了判定牌（此时在预处理区中），需要对操作预处理区操作；
                        // trigger.orderingCards.remove(event.card);
                        // "step 1"
                        // // event.card = get.cards();
                        // //强制性质，不需要询问，目前先省掉展示这一步
                        // // trigger.player.showCards(event.card,get.judegeTipPrompt(event.skill));
                        // player.replaceJudge({
                        //     card:get.cards()[0],
                        //     chooseType:"card"
                        // });
                        player.replaceJudge({
                            card:get.cards()[0],
                            chooseType:"card",
                            exchange:true,
                        });
                    }
                };


                //伟荣   【主动技】  [自]受到1点伤害后，[自][判定]黑色，视为[自]对伤害来源使用一张《奥义秘术》(不能被魔法牌响应)。
                //改版：角色需连续打出两张《闪》，否则受到1点伤害。若目标角色连续打出两张《闪》，你须将你的角色牌翻面。
                //暂时未做卡牌，该技能无法正常生效
                //奥义秘术：
                //【时机】出牌阶段。【目标】任一其他角色。【效果】目标角色需连续打出两张《闪》，否则受到1点伤害。若目标角色连续打出两张《闪》，你须将你的角色牌翻面。
                //暂时改为：视为[自]对伤害来源使用一张杀，此
                let skill3: ExSkillData = {
                    name:"伟荣",
                    description:NG.Utils.translateDescTxt("【主动技】[自]受到1点伤害后，[自][判定]黑色，伤害来源角色需连续打出两张《闪》，否则受到1点伤害。若目标角色连续打出两张《闪》，你须将你的角色牌翻面；红色牌（[自][摸]1)。"),
                    trigger:{
                        player:NG.StateTrigger.damage+NG.TriggerEnum.End,
                    },
                    filter:function(event,player){
                        return event.source&&event.source.isAlive()&&event.num>0;
                    },
                    content:function(event: GameEvent, player: Player, trigger: GameEvent, result: JudgeResultData){
                        "step 0"
                        event.num = trigger.num;
                        "step 1"
                        player.judge(function(jResult: JudgeResultData){
                            return jResult.color == NG.CardColor.Black?1:0;
                        });
                        "step 2"
                        if(result.bool){ 
                            // player.useCard({name:NG.CardNameConst.sha,isCard:true});
                            let prompt = "伤害来源角色需连续打出两张《闪》响应，否则受到1点伤害。若目标角色连续打出两张《闪》，你须将你的角色牌翻面。";
                            trigger.source.chooseToRespond(2,{name:NG.CardNameConst.shan},NG.PositionType.Handcard,prompt);
                        } else {
                            event.goto(4);
                        }
                        "step 3"
                        if(result.bool){
                            player.turnOver(!player.isTurnedOver());
                        } else {
                            trigger.source.damage();
                        }
                        "step 4"
                        event.num--;
                        // console.log("伟荣===>次数：",event.num);
                        if(event.num > 0) {
                            event.goto(1);
                        }
                    },
                }
                 //新版：额外增加：红色牌（[自][摸]1)
                //新版描述：【流血技】[自][判]，[结]黑色牌（[自]视为[自]对伤害来源使用一张《奥义秘术》)；红色牌（[自][摸]1)
                let skill32: ExSkillData = {
                    name:"伟荣",
                    description:NG.Utils.translateDescTxt("【流血技】[自][判]，[结]黑色牌，伤害来源角色需连续打出两张《闪》，否则受到1点伤害。若目标角色连续打出两张《闪》，你须将你的角色牌翻面；红色牌（[自][摸]1)。"),
                    trigger:{
                        player:NG.StateTrigger.damage+NG.TriggerEnum.End,
                    },
                    filter:function(event,player){
                        return event.source&&event.source.isAlive()&&event.num>0;
                    },
                    content:function(event: GameEvent, player: Player, trigger: GameEvent, result: JudgeResultData){
                        "step 0"
                        event.num = trigger.num;
                        "step 1"
                        player.judge(function(jResult: JudgeResultData){
                            return 1;
                        });
                        "step 2"
                        if(result.bool){ 
                            if(result.color == NG.CardColor.Black) {
                                let prompt = "伤害来源角色需连续打出两张《闪》响应，否则受到1点伤害。若目标角色连续打出两张《闪》，你须将你的角色牌翻面。";
                                trigger.source.chooseToRespond(2,{name:NG.CardNameConst.shan},NG.PositionType.Handcard,prompt);
                            } else {
                                player.draw();
                                event.goto(4);
                            }
                        } else {
                            event.goto(4);
                        }
                        "step 3"
                        if(result.bool){
                            player.turnOver(!player.isTurnedOver());
                        } else {
                            trigger.source.damage();
                        }
                        "step 4"
                        event.num--;
                        // console.log("伟荣===>次数：",event.num);
                        if(event.num > 0) {
                            event.goto(1);
                        }
                    },
                }

                let output = {
                    zj_shenwei:skill22,//新版
                    //旧版扩展部分：
                    // cancelReplaceJudge:cancelReplaceJudge,
                    zj_weirong:skill3,
                }

                return output;
            });
    })();
}