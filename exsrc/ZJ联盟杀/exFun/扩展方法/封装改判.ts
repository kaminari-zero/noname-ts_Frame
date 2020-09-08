//@ts-nocheck
module ZJNGEx {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "封装改判", NG.ImportFumType.run,

            //重新统筹一下，[自]xxxx时，[他]可xxxxxx，这种全局技的书写：
            //重新统筹一下，[自]xxxx时，[自]可令[他们]选择是否代替[自]xxxxxx，这种全局响应技的书写：
            //重新统筹一下，【改判技】[自]选择是否xxxx代替之，这种改判技的书写：
            function (lib: Lib, game: Game, ui: UI, get: Get, ai: AI, _status: Status) {
                //选择一张牌替代判定
                lib.element.content.replaceJudge = function (event: GameEvent, step: number, source: Player, player: Player, target: Player, targets: Player[], card: Card, cards: Card[], skill: string, forced: boolean, num: number, trigger: GameEvent, result: JudgeResultData) {
                    "step 0"
                    let next: GameEvent;
                    //当前trigger已经默认为jTrigger
                    //设置当前触发事件为指定的判定事件（默认的触发事件应该是调用它的那个技能的事件）
                    // if(event.jTrigger) {
                    //     trigger = event.jTrigger;
                    // }
                    // let prompt = `${get.translation(trigger.player)}的${(trigger.judgestr || '')}的判定为${get.translation(trigger.player.judging[0])},${event.prompt}`;
                    let prompt = get.judegeTipPrompt(event.prompt, trigger);
                    if (event.chooseType == "card") { //用牌改判，选牌的操作放到外面
                        //这种情况下，如何显示改判时的提示？
                        event._result = {
                            bool: true,
                            cards: [event.card],
                        };
                    }
                    else if (event.chooseType == "cards") { //选择其中一张牌来改判
                        next = player.chooseButton([prompt, event.cards, 'hidden']);
                        next.ai = function (button: Button) {
                            var card = button.link;
                            var trigger = _status.event.getTrigger();
                            var player = _status.event.player;
                            var judging = _status.event.judging;
                            var result = trigger.judge(card) - trigger.judge(judging);
                            var attitude = get.attitude(player, trigger.player);
                            return result * attitude;
                        };
                        next.set('judging', trigger.player.judging[0]); //设置给ai的
                        if (event.filterButton) {
                            if (event.filterCardObj) {
                                next.filterButton = get.cardEnableRespondableFilter(event.filterCardObj);
                            } else {
                                next.filterButton = event.filterButton;
                            }
                        } else {
                            next.filterButton = function (button) {
                                var player = _status.event.player;
                                var card = button.link;
                                return lib.filter.cardEnableRespondable(card, player);
                            };
                        }
                    }
                    else { //”self“选择一张区域的牌来改判（默认就是这个）
                        next = player.chooseCard(prompt, event.filterCard, event.position);
                        next.ai = function (card: Card) {
                            var trigger = _status.event.getTrigger();
                            var player = _status.event.player;
                            var judging = _status.event.judging;
                            var result = trigger.judge(card) - trigger.judge(judging);
                            var attitude = get.attitude(player, trigger.player);
                            if (attitude == 0 || result == 0) return 0;
                            if (attitude > 0) {
                                return result - get.value(card) / 2;
                            }
                            else {
                                return -result - get.value(card) / 2;
                            }
                        };
                        next.set('judging', trigger.player.judging[0]); //设置给ai的
                    }
                    "step 1"
                    // console.log("replaceJudge======>","开始响应判定牌:",event);
                    if (result.bool) {
                        //若是
                        if (event.chooseType == "cards") {
                            result.cards = [result.buttons[0].link];
                        }
                        // game.cardsGotoOrdering(result.cards).relatedEvent=trigger;//放入处理区并响应
                        player.respond(result.cards, 'highlight', 'noOrdering');
                    }
                    else {
                        event.finish();
                    }
                    "step 2"
                    // console.log("replaceJudge======>","开始替换判定牌:",event);
                    if (result.bool) {
                        //替代判定牌：(后期需要封装，我觉得所有这种对UI复杂操作，重复利用应该封装起来)
                        //替代的流程：打出一张指定牌；将当前牌作为判定牌，原判定牌置入弃牌堆，且该置入弃牌堆的不触发牌的移动事件
                        if (trigger.player.judging[0].clone) {
                            trigger.player.judging[0].clone.classList.remove('thrownhighlight');
                            game.broadcast(function (card) {
                                // player.$throw(card);
                                if (card.clone) {
                                    card.clone.classList.remove('thrownhighlight');
                                }
                            }, trigger.player.judging[0]);
                            game.addVideo('deletenode', player, get.cardsInfo([trigger.player.judging[0].clone]));
                        }
                        event.judged = trigger.player.judging[0];
                        trigger.player.judging[0] = result.cards[0];
                        trigger.orderingCards.addArray(result.cards);//添加到处理区中
                        if (event.chooseType == "exchange" || event.exchange) { //默认是代替"replace"，打出响应；替代"exchange"：可以交换获得那个判定牌
                            player.gain(event.judged, NG.AniNmaeConst.gain2);
                            trigger.orderingCards.remove(event.judged);
                        } else {
                            game.cardsDiscard(trigger.player.judging[0]);
                            trigger.orderingCards.remove(event.judged);
                        }
                        game.log(trigger.player, '的判定牌改为', result.cards[0]);
                        game.delay(2);
                    } else {
                        event.finish();
                    }
                    "step 3"
                    player.changeJudge(event.judged, trigger);
                }
                lib.element.player.replaceJudge = function (params: SMap<any>, ...args) {
                    var next = game.createEvent('replaceJudge',false);
                    next.player = this;
                    // next.trigger = _status.event.trigger;
                    if (arguments.length == 1) {
                        for (const key in arguments[0]) {
                            // if(params[key]) {//可能也不需要
                            // }
                            next[key] = params[key];
                        }
                    } else {
                        for (var i = 0; i < arguments.length; i++) {
                            if (get.itemtype(arguments[i]) == 'player') {
                                next.source = arguments[i];//当前被改判的目标
                            }
                            else if (get.itemtype(arguments[i]) == 'cards') {
                                next.cards = arguments[i];
                            }
                            else if (get.itemtype(arguments[i]) == 'card') {
                                next.cards = arguments[i];
                            }
                            else if (get.itemtype(arguments[i]) == 'position') {
                                next.position = arguments[i];
                            }
                            else if (typeof arguments[i] == 'function') {
                                next.filterCard = arguments[i];
                            }
                            else if (typeof arguments[i] == 'object' && arguments[i]) {
                                if (arguments[i].name == "judge") {
                                    next._trigger = arguments[i];
                                } else {
                                    next.filterCard = get.cardEnableRespondableFilter(arguments[i]);
                                }
                            }
                            else if (typeof arguments[i] == 'string') {
                                if (["card", "cards"].indexOf(arguments[i]) > -1) {
                                    next.chooseType = arguments[i];
                                }
                                else if (arguments[i] == "exchange") {
                                    next.exchange = true;
                                }
                                else next.prompt = arguments[i];
                            }
                        }
                    }
                    if (!next.source) next.source = _status.event._trigger.player;
                    if (!next.prompt) next.prompt = get.prompt(_status.event.name);//默认当前处理的技能
                    if (!next.chooseType) {
                        if (next.card) {
                            next.chooseType = "card";
                            // next.cards = [next.card];
                        } else if (next.cards) {
                            next.chooseType = "cards";
                        } else {
                            next.chooseType = "replace";
                        }
                    }
                    if (next.chooseType == "replace") { //此时为默认chooseCard
                        if (!next.position) next.position = NG.PositionType.Use;
                        if (next.filterCard == undefined) next.filterCard = lib.filter.cardEnableRespondable;
                        if (!params.filterCard && params.filterCardObj) next.filterCard = get.cardEnableRespondableFilter(arguments[i]);
                    }
                    if (next.chooseType &&
                        next.chooseType == "cards" &&
                        next.cards == undefined) {
                        _status.event.next.remove(next);
                    }
                    else if (next.chooseType &&
                        next.chooseType == "card" &&
                        next.card == undefined) {
                        _status.event.next.remove(next);
                    }
                    if (!next.jTrigger) next.jTrigger = _status.event._trigger;//一般在技能里使用，即当前trigger为当前触发技能的事件
                    next._trigger = next.jTrigger;
                    next.setContent('replaceJudge');
                    next._args = Array.from(arguments);
                    return next;
                }
                lib.element.player.changeJudge = function (cards: Card|Card[], trigger?: GameEvent) {
                    var next = game.createEvent('changeJudge',false);
                    next.player = this;
                    if(get.itemtype(cards) == NG.ItemType.CARD) {
                        next.cards = [cards];
                    } else {
                        next.cards = cards;
                    }
                    // next.trigger = trigger;//当前判断牌触发事件
                    if (next.cards == undefined || next.cards.length) _status.event.next.remove(next);
                    // next.setContent(lib.element.content.emptyEvent);//默认就会发起一个当前事件名的触发
                    next.setContent(function (event: GameEvent) {
                        event.trigger("changeJudge");//后期继续补充
                    });
                    next._args = Array.from(arguments);
                    return next;
                }
                get.judegeTipPrompt = function (str: string, trigger: GameEvent) {
                    if (lib.skill[str]) {
                        str = get.prompt(str);
                    }
                    return `${get.translation(trigger.player)}的${(trigger.judgestr || '')}的判定为${get.translation(trigger.player.judging[0])},${str}`;
                }

                return null;
            });
    })();
}