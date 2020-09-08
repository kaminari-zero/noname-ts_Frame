//@ts-nocheck
module ZJNGEx {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "重铸优化加强", NG.ImportFumType.run,

            function (lib: Lib, game: Game, ui: UI, get: Get, ai: AI, _status: Status) {

                //重构“重铸”流程
                lib.skill._chongzhu.filter = function (event, player) {
                    return player.hasCard(function (card) {
                        return lib.skill._chongzhu.filterCard(card, player, event);//入参给过滤使用
                    });
                }
                lib.skill._chongzhu.filterCard = function (card, player, event) {
                    //入参有event,给过滤使用
                    event = event ? event : _status.event;
                    player = player ? player : event.player;

                    var skills = player.getSkills(true).concat(lib.skill.global);
                    game.expandSkills(skills);
                    for (var i = 0; i < skills.length; i++) {
                        var ifo = get.info(skills[i]);
                        //有视为“teisuo”，或者有配置“chongzhu”
                        if (ifo.viewAs && (ifo.viewAs.name == NG.CardNameConst.tiesuo || ifo.viewAs == NG.CardNameConst.tiesuo)) {
                            if (!ifo.viewAsFilter || ifo.viewAsFilter(player)) {
                                if (ifo.filterCard && get.filter(ifo.filterCard)(card, player)) {
                                    // return true;
                                    if (get.objtype(ifo.viewAs) != NG.ObjType.Object) {
                                        card = { name: ifo.viewAs };
                                    } else {
                                        card = ifo.viewAs;
                                    }
                                    break;
                                }
                            }
                        }
                        else {
                            var chongzhu = get.info(skills[i]).chongzhu;
                            if (typeof chongzhu == 'function' && chongzhu(card, event, player)) {
                                return true;
                            } else if (chongzhu === true) {
                                return chongzhu;
                            }
                        }
                    }
                    var info = get.info(card);
                    if (typeof info.chongzhu == 'function') {
                        return info.chongzhu(event, player);
                    }
                    return info.chongzhu;
                }


                //收集别人的操作方法：
                //"重铸"行为，非原逻辑的"_chongzhu"
                lib.element.content.recast = function () {
                    "step 0"
                    game.log(player, '重铸了', cards);
                    player.lose(cards, event.position);
                    if (event.animate != false) {
                        event.discardid = lib.status.videoId++;
                        game.broadcastAll(function (player, cards, id) {
                            player.$throw(cards, null, 'nobroadcast');
                            var cardnodes = [];
                            cardnodes._discardtime = get.time();
                            for (var i = 0; i < cards.length; i++) {
                                if (cards[i].clone) {
                                    cardnodes.push(cards[i].clone);
                                }
                            }
                            ui.todiscard[id] = cardnodes;
                        }, player, cards, event.discardid);
                        if (lib.config.sync_speed && cards[0] && cards[0].clone) {
                            if (event.delay != false) {
                                var waitingForTransition = get.time();
                                event.waitingForTransition = waitingForTransition;
                                cards[0].clone.listenTransition(function () {
                                    if (_status.waitingForTransition == waitingForTransition && _status.paused) {
                                        game.resume();
                                    }
                                    delete event.waitingForTransition;
                                });
                            }
                            else if (event.getParent().discardTransition) {
                                delete event.getParent().discardTransition;
                                var waitingForTransition = get.time();
                                event.getParent().waitingForTransition = waitingForTransition;
                                cards[0].clone.listenTransition(function () {
                                    if (_status.waitingForTransition == waitingForTransition && _status.paused) {
                                        game.resume();
                                    }
                                    delete event.getParent().waitingForTransition;
                                });
                            }
                        }
                    }
                    event.trigger('recast');
                    "step 1"
                    if (event.delay != false) {
                        if (event.waitingForTransition) {
                            _status.waitingForTransition = event.waitingForTransition;
                            game.pause();
                        }
                        else {
                            game.delayx();
                        }
                    }
                    "step 2"
                    var num = 0;
                    for (var i = 0; i < cards.length; i++) {
                        num++;
                    }
                    if (num > 0) player.draw(num);
                }
                lib.element.player.recast = function () {
                    var next = game.createEvent('recast');
                    next.player = this;
                    next.num = 0;
                    for (var i = 0; i < arguments.length; i++) {
                        if (get.itemtype(arguments[i]) == 'player') {
                            next.source = arguments[i];
                        }
                        else if (get.itemtype(arguments[i]) == 'cards') {
                            next.cards = arguments[i];
                        }
                        else if (get.itemtype(arguments[i]) == 'card') {
                            next.cards = [arguments[i]];
                        }
                        else if (typeof arguments[i] == 'boolean') {
                            next.animate = arguments[i];
                        }
                        else if (get.objtype(arguments[i]) == 'div') {
                            next.position = arguments[i];
                        }
                    }
                    if (next.cards) {
                        var _targets = [];
                        // next.source = get.owner(next.cards[0]);
                        next.cards.forEach((card) => {
                            var _target = get.owner(card);
                            if (_targets.indexOf(_targets) == -1) _targets.push(_target);
                        });
                        next.targets = _targets;//所有的重铸的目标
                        // if(next.targets.length) next.multiTargets = true;
                    }
                    if (!next.source) next.source = next.player;//默认来源是自己
                    if (!next.position) next.position = ui.discardPile;
                    if (next.cards == undefined) _status.event.next.remove(next);
                    next.setContent('recast');
                    next._args = Array.from(arguments);
                    return next;
                }

                return null;
            });
    })();
}