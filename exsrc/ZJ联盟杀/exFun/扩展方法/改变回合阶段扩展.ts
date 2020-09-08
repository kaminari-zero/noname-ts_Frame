//@ts-nocheck
module ZJNGEx {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "改变回合阶段扩展", NG.ImportFumType.run,

            function (lib: Lib, game: Game, ui: UI, get: Get, ai: AI, _status: Status) {
                //改变回合阶段
                lib.element.player.changePhase = function (...name) {
                    if (!name.length) return;
                    if (!this.name && !this.name) return;
                    if (name.contains(true)) {
                        this.changePhaseAllthetime = true;
                        name.remove(true);
                    }
                    if (!this.truephase) this.truephase = this.phase;
                    this.phase = function (skill) {
                        var next = game.createEvent('phase');
                        next.player = this;
                        this.changePhaseorder = name;
                        this.changePhaseordermarks = name.slice(0);
                        this.markSkill('_changePhase');
                        if (get.mode() == "guozhan") next.setContent(this.name1 + 'changePhase');
                        else next.setContent(this.name + 'changePhase');
                        if (!_status.roundStart) {
                            _status.roundStart = this;
                        }
                        if (skill) {
                            next.skill = skill;
                        }
                        return next;
                    }
                    if (get.mode() == "guozhan") var b = this.name1;
                    else var b = this.name;
                    lib.element.content[b + 'changePhase'] = function () {
                        "step 0"
                        var name = player.changePhaseorder[0];
                        if (!player[name]) event.goto(2);
                        player[name]();
                        "step 1"
                        if (player.changePhaseorder[0] == "phaseDraw") {
                            if (!player.noPhaseDelay) {
                                if (player == game.me) {
                                    game.delay();
                                }
                                else {
                                    game.delayx();
                                }
                            }
                        }
                        if (player.changePhaseorder[0] == "phaseUse") {
                            game.broadcastAll(function () {
                                if (ui.tempnowuxie) {
                                    ui.tempnowuxie.close();
                                    delete ui.tempnowuxie;
                                }
                            });
                        }
                        if (player.changePhaseorder[0] == "phaseDiscard") {
                            if (!player.noPhaseDelay) game.delayx();
                        }
                        "step 2"
                        player.changePhaseorder.splice(0, 1);
                        if (player.changePhaseorder.length <= 0) {
                            delete player.using;
                            delete player._noSkill;
                            if (!player.changePhaseAllthetime) {
                                player.phase = player.truephase;
                                player.unmarkSkill('_changePhase');
                            }
                            return;
                        }
                        else event.goto(0);
                    }
                    return this;
                }
                lib.skill._changePhase = {
                    mark: true,
                    popup: false,
                    forced: true,
                    nobracket: true,
                    superCharlotte: true,
                    unique: true,
                    intro: {
                        content: function (content, player) {
                            var str = '';
                            //if(player.changePhaseordermarks) str="你现在的回合内阶段顺序分别为：<br>"+player.changePhaseordermarks;
                            if (player.changePhaseordermarks) {
                                str = '你现在的回合内阶段顺序分别为：<br>' + get.translation(player.changePhaseordermarks[0]);
                                for (var i = 1; i < player.changePhaseordermarks.length; i++) {
                                    str += '、' + get.translation(player.changePhaseordermarks[i]);
                                }
                            }
                            return str;
                        },
                    },
                }
                //配合回合顺序变换的全局技能
                lib.translate.phaseZhunbei = "准备阶段";
                lib.translate.phaseJudge = "判定阶段";
                lib.translate.phaseDraw = "摸牌阶段";
                lib.translate.phaseUse = "出牌阶段";
                lib.translate.phaseDiscard = "弃牌阶段";
                lib.translate.phaseJieshu = "结束阶段";
                lib.translate._changePhase = '回合顺序';
                //主动重置回合顺序：
                lib.element.player.resetChangePhase = function () {
                    if (this.hasMark("_changePhase")) {
                        delete this.changePhaseAllthetime;
                        this.phase = this.truephase;
                        this.unmarkSkill('_changePhase');
                    }
                    return this;
                }

                
                return null;
            });
    })();
}