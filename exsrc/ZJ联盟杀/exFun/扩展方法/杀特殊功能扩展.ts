//@ts-nocheck
module ZJNGEx {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "杀特殊功能扩展", NG.ImportFumType.run,

            //原方案，出自--未来科技
            //示例：game.me.useModSha(game.zhu,{direct:true,baseDamage:1})
            function (lib: Lib, game: Game, ui: UI, get: Get, ai: AI, _status: Status) {

                lib.element.content.useModSha = function () {
                    "step 0"
                    if (event.unequip) player.addSkill('unequip');//无视防具
                    if (event.direct) player.addSkill('shadirectall');//无法闪避
                    if (event.baseDamage) {//基础伤害增加
                        player.storage.KJmodSha_baseDamage = event.baseDamage;
                        player.addSkill('KJmodSha_baseDamage');
                    }
                    if (event.extraDamage) {//额外伤害增加
                        player.storage.KJmodSha_extraDamage = event.extraDamage;
                        player.addSkill('KJmodSha_extraDamage');
                    }
                    if (event.fengyin) player.addSkill('tofengyin');//封印一名角色所有技能
                    if (event.loseHp) player.addSkill('toloseHp');//伤害变成失去
                    "step 1"
                    //alert(event.direct);
                    player.useCard.apply(player, event.arg);
                    "step 2"
                    if (event.unequip) player.removeSkill('unequip');
                    if (event.direct) player.removeSkill('shadirectall');
                    if (event.baseDamage) {
                        player.storage.KJmodSha_baseDamage = 0;
                        player.removeSkill('KJmodSha_baseDamage');
                    }
                    if (event.extraDamage) {
                        player.storage.KJmodSha_extraDamage = 0;
                        player.removeSkill('KJmodSha_extraDamage');
                    }
                    if (event.fengyin) player.removeSkill('tofengyin');
                    if (event.loseHp) player.removeSkill('toloseHp');
                }

                //额外增加一个mod扩展杀的功能，其余参数可以和usecard一致；
                //简化使用参数：目标，该sha的真实使用cards，扩展mod
                lib.element.player.useModSha = function (...X) {
                    var next = game.createEvent('useModSha', false);
                    var card = { name: "sha" };
                    next._args = X.concat();//先保存一份参数的原案
                    //当前，所有X参数，都是player.useCard的参数
                    for (var i = 0; i < X.length; i++) {
                        //原版
                        if (get.itemtype(X[i]) == 'card') { //若有card，则优先使用参数的，否则，默认
                            //alert(1)
                            var dinged = true;
                        }
                        // else if (typeof X[i] == 'object' && X[i] && X[i].name && get.itemtype(X[i]) !== 'player' && get.itemtype(X[i]) !== 'players') {
                        //     var dinged = true;
                        //     //alert(2)
                        // }
                        else if(get.itemtype(X[i]) == 'object') {
                            var mod = X[i];
                            X.remove(X[i]);
                        }
                        // else {
                        //     if (typeof X[i] === 'object' && X[i].mod) {//???
                        //         var mod = X[i];
                        //         X.remove(X[i]);
                        //     }
                        // }
                    }
                    if (!dinged) X.push(card);
                    //alert(mod)
                    if (mod) {
                        for (var i in mod) {
                            //alert(i)
                            switch (i) {
                                case 'unequip'://无视防具
                                    next.unequip = true;
                                    break;

                                case 'baseDamage'://基础伤害增加
                                    next.baseDamage = mod[i];
                                    break;

                                case 'extraDamage'://额外伤害增加，只对特定的目标有效，不对额外的有效
                                    next.extraDamage = mod[i];
                                    break;

                                case 'direct'://无法闪避
                                    next.direct = true;
                                    break;

                                //额外扩展：
                                case 'fengyin'://封印一名角色所有技能
                                    next.fengyin = true;
                                    break;

                                case 'loseHp'://伤害变成失去
                                    next.loseHp = true;
                                    break;

                                // case 'loseMaxHp'://伤害变成减少体力上限
                                //     next.loseMaxHp = true;
                                //     break;
                                // case 'recover'://伤害变成回复体力
                                //     next.recover = true;
                                //     break;

                                case 'extraSha'://该杀为额外出的杀
                                    //let next = player.useCard({name:NG.CardNameConst.sha,isCard:true,isQisheng:true},result.targets[0],false); 
                                    X.push(false);//设置usecard，使用不计入次数
                                    break;

                                case 'nature'://属性伤害杀
                                    card.nature = mod[i];
                                    break;

                                //自由扩展杀得功能：
                                case 'func'://自由扩展杀得功能
                                    next.func = mod[i];
                                    break;
                            }
                        }
                    }
                    next.arg = X;
                    next.player = this;
                    next.setContent("useModSha");
                    return next;
                }

                lib.skill.KJmodSha_baseDamage = {
                    trigger: { player: 'useCard' },
                    filter: function (event) {
                        return event.card && event.card.name == 'sha';
                    },
                    forced: true,
                    popup: false,
                    unique: true,
                    direct: true,
                    superCharlotte: true,
                    charlotte: true,
                    content: function () {
                        if (!trigger.baseDamage) trigger.baseDamage = 1;
                        trigger.baseDamage += player.storage.KJmodSha_baseDamage;
                        //alert(trigger.baseDamage)
                    },
                }

                lib.skill.KJmodSha_extraDamage = {
                    audio: 2,
                    trigger: { player: 'shaBegin' },
                    forced: true,
                    popup: false,
                    unique: true,
                    direct: true,
                    superCharlotte: true,
                    charlotte: true,
                    content: function () {
                        if (typeof trigger.extraDamage != 'number') trigger.extraDamage = 0;
                        trigger.extraDamage += player.storage.KJmodSha_extraDamage;
                    },
                }

                //杀基础伤害加一
                lib.skill.shabasenum = {
                    trigger: { player: 'useCard' },
                    filter: function (event) {
                        return event.card && event.card.name == 'sha';
                    },
                    forced: true,
                    popup: false,
                    unique: true,
                    superCharlotte: true,
                    charlotte: true,
                    content: function () {
                        if (!trigger.baseDamage) trigger.baseDamage = 1;
                        trigger.baseDamage++;
                    },
                }
                //目标不能响应杀
                lib.skill.shadirect = {
                    trigger: { player: 'useCardToPlayered' },
                    forced: true,
                    popup: false,
                    unique: true,
                    charlotte: true,
                    superCharlotte: true,
                    filter: function (event, player) {
                        return event.card.name == 'sha';
                    },
                    content: function () {
                        trigger.getParent().directHit.push(trigger.target);
                    },
                }
                //全部角色不能响应杀
                lib.skill.shadirectall = {
                    trigger: { player: 'shaBegin' },
                    forced: true,
                    popup: false,
                    unique: true,
                    charlotte: true,
                    superCharlotte: true,
                    content: function () {
                        trigger.directHit = true;
                    },
                }
                //封印一名角色所有技能
                lib.skill.tofengyin = {
                    init: function (player, skill) {
                        var skills = player.getSkills(true, false);
                        for (var i = 0; i < skills.length; i++) {
                            if (get.skills[i]) {
                                skills.splice(i--, 1);
                            }
                        }
                        player.disableSkill(skill, skills);
                    },
                    onremove: function (player, skill) {
                        player.enableSkill(skill);
                    },
                    mark: true,
                    superCharlotte: true,
                    locked: true,
                    intro: {
                        content: function (storage, player, skill) {
                            var list = [];
                            for (var i in player.disabledSkills) {
                                if (player.disabledSkills[i].contains(skill)) {
                                    list.push(i)
                                }
                            }
                            if (list.length) {
                                var str = '失效技能：';
                                for (var i = 0; i < list.length; i++) {
                                    if (lib.translate[list[i] + '_info']) {
                                        str += get.translation(list[i]) + '、';
                                    }
                                }
                                return str.slice(0, str.length - 1);
                            }
                        },
                    },
                }
                // lib.translate.tofengyin = '神圣封印';
                lib.translate.tofengyin = '封印';

                lib.skill.toloseHp = {
                    trigger: { source: 'damageBegin2' },
                    silent: true,
                    unique: true,
                    filter: function (event, player) {
                        return event.num > 0;
                    },
                    content: function () {
                        trigger.cancel();
                        trigger.player.loseHp(trigger.num);
                    },
                };
                lib.translate.toloseHp = "流失体力";

                return null;
            });
    })();
}
