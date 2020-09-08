//@ts-nocheck
module ZJNGEx {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "游戏流程全局技能扩展.", NG.ImportFumType.run,

            function (lib: Lib, game: Game, ui: UI, get: Get, ai: AI, _status: Status) {
                //添加播放死亡语音：（后续有语言先开放）
                lib.skill._playerAudioByDie = {
                    trigger: {
                        player: 'dieBegin',
                    },
                    priority: -Infinity,
                    silent:true,
                    ruleSkill:true,
                    unique: true,
                    content: function (event: GameEvent, step: number, source: Player, player: Player, target: Player, targets: Player[], card: Card, cards: Card[], skill: string, forced: boolean, num: number, trigger: GameEvent, result: BaseCommonResultData) {
                        "step 0"
                        //当前只针对“zj联盟杀”，先默认扩展名为“ZJ联盟杀”
                        // var exName = "ZJ联盟杀/aduio/die";
                        var exName = "ZJ联盟杀";
                        var name = "";
                        if (get.mode() == "guozhan") name = player.name1;
                		else name = player.name;
                        var name2 = player.name2;
                        var tags = lib.character[name][4];
                        if (name2) var tags2 = lib.character[name2][4];
                        var audioList = [];
                        if (tags && tags.length) {
                            for (var i = 0; i < tags.length; i++) {
                                if (tags[i].indexOf('dieAudio:') == 0) {
                                    audioList.push(tags[i].slice(9));
                                }
                            }
                        }
                        var audionum = audioList.length;
                        if (audionum) { //复数死亡语音：“ZJ联盟杀/aduio/die/随机[dieAudio:定义语音]”
                            var num = get.rand(0, audionum-1);
                            var audioname = audioList[num];
                            game.playAudio('..', 'extension', exName, audioname);
                        }
                        else { //默认：“ZJ联盟杀/aduio/die/角色编号名_die.mp3”【注：自动默认补充.mp3】
                            game.playAudio('..', 'extension', exName, name+"_die");
                        }
                        if (name2 && tags2 && tags2.length) {
                            event.tags2 = tags2;
                            event.name = name2;
                        }
                        else {
                            event.finish();
                        }
                        "step 1"
                        // var exName = "ZJ联盟杀/aduio/die";
                        var exName = "ZJ联盟杀";
                        var audioList = [];
                        var tags2 = event.tags2;
                        var name = event.name;
                        for (var i = 0; i < tags2.length; i++) {
                            if (tags2[i].indexOf('dieAudio:') == 0) {
                                audioList.push(tags2[i].slice(9));
                            }
                        }
                        var audionum = audioList.length;
                        if (audionum) { //复数死亡语音：“ZJ联盟杀/aduio/die/随机[dieAudio:定义语音]”
                            var num = get.rand(0, audionum-1);
                            var audioname = audioList[num];
                            game.playAudio('..', 'extension', exName, audioname);
                        }
                        else { //默认：“ZJ联盟杀/aduio/die/角色编号名_die.mp3”【注：自动默认补充.mp3】
                            game.playAudio('..', 'extension', exName, name+"_die");
                        }
                    },
                }

                return null;
            });
    })();
}