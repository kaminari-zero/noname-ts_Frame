module ZJNGEx {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "测试模式技能组3", NG.ImportFumType.skill,
            //主要时联盟杀专属全局技，属性技
            function (lib: Lib, game: Game, ui: UI, get: Get, ai: AI, _status: Status) {

                //通用技能：时机gameStart,属性主公技，血量上限变血槽技，势力标记

                // 不需要了，当前血量支持双配置
                //血量上限变血槽技      
                let _hpMaxChange: ExSkillData = {
                    trigger: {
                        //所有人都选好武将了
                        global: NG.PhaseTrigger.gameStart,
                    },
                    content: function () {
                        //场上所有ZJSha玩家的血量变血槽上限，其他不变：
                        "step 0"
                        for (let i = 0; i < game.players.length; i++) {
                            let player = game.players[i];
                            if (player.isAlive()) {
                                let info = get.character(player.name) as HeroData;
                                if (info && info[HeroDataFields.exInfo].indexOf(ZJNGEx.ZJShaGameConst.ZJShaFlag) > -1) { //属于zjsha角色
                                    let _info = info[HeroDataFields.zjshaInfo];
                                    player.maxHp += _info[1];
                                    player.update();
                                }
                            }
                            // game.broadcastAll(function(players){
                            //     //如何同步信息，还没开始具体看
                            // },game.players);  
                            // 不需要，player.update，自己会更新
                        }
                    }
                };

                //为当前主公添加专属主公技
                let _bossGetSkills: ExSkillData = {
                    trigger: {
                        //所有人都选好武将了
                        global: NG.PhaseTrigger.gameStart,
                    },
                    silent:true,
                    ruleSkill:true,
                    filter:function(event,player){
                        let mode = get.mode();
                        let canModes = [NG.GameModeConst.identity, NG.GameModeConst.chess] as string[];
                        if (canModes.indexOf(mode) > -1) {
                            let flag = get.config('start_wuxingSkill');
                            let zhu = player;
                            let info = get.character(zhu.name) as HeroData;
                            if (player.isZhu && info && info[HeroDataFields.exInfo].indexOf(ZJNGEx.ZJShaGameConst.ZJShaFlag) > -1 && flag!==false) {
                               return true;  
                            } 
                        }
                    },
                    content: function (event: GameEvent, player: Player, trigger: GameEvent, result: BaseCommonResultData) {
                        "step 0"
                        //当前的游戏模式：
                        let mode = get.mode();
                        let canModes = [NG.GameModeConst.identity] as string[];
                        if (canModes.indexOf(mode) > -1) {
                            //当前的主公：
                            let zhu = player;
                            let info = get.character(zhu.name) as HeroData;
                            if (player.isZhu && info && info[HeroDataFields.exInfo].indexOf(ZJNGEx.ZJShaGameConst.ZJShaFlag) > -1) {
                                let shuxing = zhu.group;
                                //根据属性获取技能列表
                                //【2020-6-22】：主公技省略为2个
                                let skills = [];
                                switch(shuxing){
                                    case NG.Group.FIRE:
                                        skills = [/*"zj_shuxing_yanzheng","zj_shuxing_yanhuo",*/"zj_shuxing_huohun","zj_shuxing_huoling"];
                                        break;
                                    case NG.Group.GOLD:
                                        skills = [/*"zj_shuxing_zhiyuan","zj_shuxing_jingling",*/"zj_shuxing_jinghun","zj_shuxing_fahua"];
                                        break;
                                    case NG.Group.SOIL:
                                        skills = ["zj_shuxing_xueyu"/*,"zj_shuxing_huwei2","zj_shuxing_sichou"*/,"zj_shuxing_huwei"];
                                        break;
                                    case NG.Group.WATER:
                                        skills = ["zj_shuxing_shuiyuan"/*,"zj_shuxing_shuizong","zj_shuxing_shuiling"*/,"zj_shuxing_xingshuai"];
                                        break;
                                    case NG.Group.WOOD:
                                        skills = ["zj_shuxing_jiuhu","zj_shuxing_muyuan"/*,"zj_shuxing_mudi","zj_shuxing_zuqu"*/];
                                        break;
                                    case NG.Group.NONE://没有，也视为“无”？
                                    default:
                                        skills = ["zj_shuxing_wuyu"/*,"zj_shuxing_wuyi","zj_shuxing_wuyi2"*/,"zj_shuxing_wuyu2"];
                                        break;

                                }

                                //人数限制：
                                //技能数限制：

                                //第一种添加技能方式：
                                //根据isAddGlobalSkill，区分是否是全局技能；
                                //注：使用这种方式添加的全局技能，并不会在角色的身上显示技能出来
                                // for (let i = 0; i < skills.length; i++) {
                                //     const skill = skills[i];
                                //     let info = get.info(skill);
                                //     if(info) {
                                //         if(info.isAddGlobalSkill) {
                                //             game.addGlobalSkill(skill,zhu);
                                //         } else {
                                //             zhu.addSkill(skill);
                                //         }
                                //     }
                                // }

                                //第二种添加技能的方式：【测试结果ok】
                                //global自身；
                                // zhu.addSkill(skills);

                                //第三种添加技能的方式：【麻烦，废弃】
                                //与第二种差不多，使用subSkill,生成全局子技能，用global发布出去；

                                //第四种添加节能的方式：【测试结果ok】
                                //分别添加到zhu身上（为了技能可视），全局lib.skill.global中（为了技能全局）：
                                //合并了第一，第二种方法：
                                for (let i = 0; i < skills.length; i++) {
                                    const skill = skills[i];
                                    let info = get.info(skill);
                                    if(info) {
                                        if(info.isAddGlobalSkill) {
                                            game.addGlobalSkill(skill,zhu);
                                        } 
                                    }
                                }
                                zhu.addSkill(skills);

                                game.log(zhu,`获得${get.translation(shuxing)}属性技能：`,skills);
                            } else if(!zhu) {
                                console.warn("竟然没有主公？");
                            } else {
                                console.warn("不是【联盟杀】角色");
                            }
                        }
                    }
                };

                //火属性
                //炎阵: 【被动技】[他]与[自]距离为1的角色视为在[他](火)的攻击范围内。
                let _yanzheng: ExSkillData = {
                    name:"炎阵",
                    description:NG.Utils.translateDescTxt("【被动技】[他]与[自]距离为1的角色视为在[他](火)的攻击范围内。"),
                    isAddGlobalSkill:true,
                    unique:true,
                    // global:"zj_shuxing_yanzheng",
                    // global:"zj_shuxing_yanzheng_global",
                    // subSkill:{
                    //     global:{
                    //     }
                    // },
                    mod: {
                        // targetInRange: function (card: Card, player: Player, target: Target) {
                        //     let isSha = get.name(card) == NG.CardNameConst.sha;
                        //     if (!isSha) return;
                        //     let huoPlayers = game.filterPlayer((player) => {
                        //         return player.group == NG.Group.FIRE;
                        //     });
                        //     return huoPlayers.some((player) => {
                        //         return player.distanceTo(target) <= 1;
                        //     });
                        // },
                        //[他]与[自]距离为1的角色视为在[他](火)的攻击范围内
                        attackFrom:function(from,to,range){
                            if(from.group == NG.Group.FIRE && game.zhu.distanceFrom(to) <= 1 && from != game.zhu) {
                                return -Infinity;
                            }
                        }
                    },

                };

                //火灵: 【主动技】[自]需要使用或打出一张【杀】时，[自]可以令[他](火)打出一张【杀】(视为由[自]使用或打出)。【全局轮询技，后续补充】
                //摘自：刘备【激将】,实现太复杂了，看来要直接用他的【直接用激将的源代码】
                //激将原实现：（保留event.jijiang，player.storage.jijianging）
                //技能名：zj_shuxing_huoling
                let new_huoling={
                    name:"火灵",
                    description:NG.Utils.translateDescTxt("【主动技】[自]需要使用或打出一张【杀】时，[自]可以令[他](火)打出一张【杀】(视为由[自]使用或打出)。"),
                    unique:true,
                    group:['zj_shuxing_huoling_1','zj_shuxing_huoling_2'],
                    zhuSkill:true,
                    subSkill:{
                        1:{
                            trigger:{player:'chooseToRespondBegin'},
                            check:function(event){
                                if(event.jijiang) return false;
                                return true;
                            },
                            filter:function(event,player){
                                if(event.responded) return false;
                                if(player.storage.jijianging) return false;
                                if(!player.hasZhuSkill('zj_shuxing_huoling')) return false;
                                if(!event.filterCard({name:'sha'},player,event)) return false;
                                return game.hasPlayer(function(current){
                                    return current!=player&&current.group==NG.Group.FIRE;
                                });
                            },
                            content:function(event: GameEvent, step: number, source: Player, player: Player, target: Player, targets: Player[], card: Card, cards: Card[], skill: string, forced: boolean, num: number, trigger: GameEvent, result: BaseResultData){
                                "step 0"
                                if(event.current==undefined) event.current=player.next;
                                if(event.current==player){
                                    event.finish();
                                }
                                else if(event.current.group==NG.Group.FIRE){
                                    player.storage.jijianging=true;
                                    var next=event.current.chooseToRespond('是否替'+get.translation(player)+'打出一张杀？',{name:'sha'});
                                    next.set('ai',function(){
                                        var event=_status.event;
                                        return (get.attitude(event.player,event.source)-2);
                                    });
                                    next.set('source',player);
                                    next.set('jijiang',true);
                                    next.set('skillwarn','替'+get.translation(player)+'打出一张杀');
                                    next.noOrdering=true;
                                    next.autochoose=lib.filter.autoRespondSha;
                                }
                                else{
                                    event.current=event.current.next;
                                    event.redo();
                                }
                                "step 1"
                                player.storage.jijianging=false;
                                if(result.bool){
                                    event.finish();
                                    trigger.result=result;
                                    //@ts-ignore
                                    trigger.responded=true;
                                    trigger.animate=false;
                                    if(typeof event.current.ai.shown=='number'&&event.current.ai.shown<0.95){
                                        event.current.ai.shown+=0.3;
                                        if(event.current.ai.shown>0.95) event.current.ai.shown=0.95;
                                    }
                                }
                                else{
                                    event.current=event.current.next;
                                    event.goto(0);
                                }
                            }
                        },
                        2: {
                            enable: 'chooseToUse',
                            prompt: '选择一名目标角色。若有其他火属性角色打出【杀】响应，则视为你对其使用此【杀】。',
                            filter: function (event, player) {
                                if (event.filterCard && !event.filterCard({ name: 'sha' }, player, event)) return false;
                                if (!player.hasZhuSkill('zj_shuxing_huoling')) return false;
                                if (player.hasSkill('zj_shuxing_huoling_3')) return false;
                                if (!lib.filter.cardUsable({ name: 'sha' }, player)) return false;
                                return game.hasPlayer(function (current) {
                                    return current != player && current.group == NG.Group.FIRE;
                                });
                            },
                            filterTarget: function (card, player, target) {
                                if (_status.event._backup &&
                                    typeof _status.event._backup.filterTarget == 'function' &&
                                    !_status.event._backup.filterTarget({ name: 'sha' }, player, target)) {
                                    return false;
                                }
                                return player.canUse({ name: 'sha' }, target);
                            },
                            content: function (event: GameEvent, step: number, source: Player, player: Player, target: Player, targets: Player[], card: Card, cards: Card[], skill: string, forced: boolean, num: number, trigger: GameEvent, result: BaseResultData) {
                                "step 0"
                                if (event.current == undefined) event.current = player.next;
                                if (event.current == player) {
                                    player.addSkill('zj_shuxing_huoling_3');
                                    event.getParent(2).step = 0;
                                    event.finish();
                                }
                                else if (event.current.group == NG.Group.FIRE) {
                                    var next = event.current.chooseToRespond('是否替' + get.translation(player) + '对' + get.translation(target) + '使用一张杀',
                                        function (card, player, event) {
                                            event = event || _status.event;
                                            return card.name == 'sha' && event.source.canUse(card, event.target);
                                        });
                                    next.set('ai', function (card) {
                                        var event = _status.event;
                                        return get.effect(event.target, card, event.source, event.player);
                                    });
                                    next.set('source', player);
                                    next.set('target', target);
                                    next.set('jijiang', true);
                                    next.set('skillwarn', '替' + get.translation(player) + '打出一张杀');
                                    next.noOrdering = true;
                                    next.autochoose = lib.filter.autoRespondSha;
                                }
                                else {
                                    event.current = event.current.next;
                                    event.redo();
                                }
                                "step 1"
                                if (result.bool) {
                                    event.finish();
                                    if (result.cards && result.cards.length) {
                                        player.useCard({ name: 'sha', isCard: true }, result.cards, target).animate = false;
                                    }
                                    else {
                                        player.useCard({ name: 'sha', isCard: true }, target).animate = false;
                                    }
                                    if (typeof event.current.ai.shown == 'number' && event.current.ai.shown < 0.95) {
                                        event.current.ai.shown += 0.3;
                                        if (event.current.ai.shown > 0.95) event.current.ai.shown = 0.95;
                                    }
                                }
                                else {
                                    event.current = event.current.next;
                                    event.goto(0);
                                }
                            },
                            ai: {
                                respondSha: true,
                                skillTagFilter: function (player) {
                                    if (!player.hasZhuSkill('zj_shuxing_huoling')) return false;
                                    return game.hasPlayer(function (current) {
                                        return current != player && current.group == NG.Group.FIRE;
                                    });
                                },
                                result: {
                                    target: function (player, target) {
                                        if (player.hasSkill('zj_shuxing_huoling_3')) return 0;
                                        return get.effect(target, { name: 'sha' }, player, target);
                                    }
                                },
                                order: function () {
                                    return get.order({ name: 'sha' }) - 0.1;
                                },
                            }
                        },
                        3:{
                            trigger:{global:['useCardAfter','useSkillAfter','phaseAfter']},
                            silent:true,
                            filter:function(event){
                                return event.skill!='zj_shuxing_huoling_2'&&event.skill!='qinwang2';
                            },
                            content:function(event: GameEvent, step: number, source: Player, player: Player, target: Player, targets: Player[], card: Card, cards: Card[], skill: string, forced: boolean, num: number, trigger: GameEvent, result: BaseResultData){
                                player.removeSkill('zj_shuxing_huoling_3');
                            }
                        }
                    }
                };

                //炎火: 【主动技】[他](火)使用【杀】结算完毕时，其可将之交给[自]，然后[自]可令其摸一张牌。
                let _yanhuo:ExSkillData = {
                    name:"炎火",
                    description:NG.Utils.translateDescTxt("【主动技】[他](火)使用【杀】结算完毕时，其可将之交给[自]，然后[自]可令其摸一张牌。"),
                    isAddGlobalSkill:true,
                    unique:true,
                    // global:"zj_shuxing_yanhuo",
                    // global:"zj_shuxing_yanhuo_global",
                    // subSkill:{
                    //     global:{
                    //     }
                    // },
                    trigger: {
                        player:NG.CardTrigger.useCard + NG.TriggerEnum.After,
                    },
                    prompt:function(event) {
                        return `当前${get.translation(NG.CardNameConst.sha)}结算完毕，你是否要将其交给【${get.translation(game.zhu)}】，【${get.translation(game.zhu)}】可令你摸一张牌？`;
                    },
                    // prompt2:"",
                    filter:function(event,player) {
                        return player != game.zhu && 
                        get.itemtype(event.cards) == NG.ItemType.CARDS &&
                        get.position(event.cards[0],true) == NG.PositionType.Ordering && //
                        get.name(event.card,player) == NG.CardNameConst.sha && 
                        player.group == NG.Group.FIRE;
                    },
                    content:function(event: GameEvent, source: Player, player: Player, target: Player ,trigger: GameEvent,result: BaseCommonResultData){
                        "step 0"
                        //由于现在，增加了处理区，处理有点不一样
                        // event.sha=trigger.cards.slice(0).filterInD();
                        // debugger;
                        trigger.orderingCards.removeArray(trigger.cards);
                        // game.zhu.gain(trigger.cards);
                        player.give(trigger.cards,game.zhu);
                        "step 1"
                        game.zhu.chooseBool(`是否令${get.translation(player)}其抽一张牌？`);
                        "step 2"
                        if(result.bool) {
                            player.draw();
                        }
                    }
                };

                //火魂: 【觉醒技】[自]<准备>，[自]血量最小的角色，[自]血量和血槽各+1，并获得技能“火源”。
                // 参考技能："ruoyu"
                let huohun:ExSkillData = {
                    name:"火魂",
                    description:NG.Utils.translateDescTxt("【觉醒技】[自]<准备>，[自]血量最小的角色，[自]血量和血槽各+1，并获得技能“火源”。"),
                    //觉醒技相关配置：
                    skillAnimation:true,
                    animationColor:NG.NatureColorConst.fire,
                    unique:true,
                    juexingji:true,
                    //需要附加技能：
                    keepSkill:true,
                    // derivation:"zj_shuxing_huohun",
                    forced:true,
                    trigger:{
                        player:NG.PhaseTrigger.phaseZhunbeiBegin,
                    },
                    filter:function(event,player) {
                        return player.isMinHp(true);
                    },
                    content:function(event: GameEvent, source: Player, player: Player, target: Player ,trigger: GameEvent,result: BaseCommonResultData){
                        "step 0"
                        player.gainMaxHp();
                        "step 1"
                        player.recover();
                        game.log(player,'获得了技能','#g【火魂】'); 
                        // player.addSkill('_huohun');
                        player.addAdditionalSkill('zj_shuxing_huohun','zj_awaken_huohun');
                        player.awakenSkill("zj_shuxing_huohun");
                    },
                };
                //火源: 【主动技】[他](火)造成1点伤害时，可令[自]摸一张牌。 
                let _awaken_huohun:ExSkillData = {
                    name:"火源",
                    description:NG.Utils.translateDescTxt("【主动技】[他](火)造成1点伤害后，可令[自]摸一张牌。"),
                    unique:true,
                    trigger:{
                        source:[NG.StateTrigger.damage+NG.TriggerEnum.End],
                    },
                    global:"zj_global_huohun",
                };
                let zj_global_huohun:ExSkillData = {
                    name:"火源",
                    description:NG.Utils.translateDescTxt("【主动技】(火)造成1点伤害后，可令[自]摸一张牌。"),
                    derivation:"zj_awaken_huohun",
                    filter:function(event,player) {
                        return player != game.zhu && player.group == NG.Group.FIRE && event.num>0 &&
                            get.itemtype(event.cards) == NG.ItemType.CARDS &&
                            get.name(event.card,player) == NG.CardNameConst.sha;
                    },
                    prompt:function(event){
                        return `是否令【${get.translation(game.zhu)}】其抽${event.num}张牌？`;
                    },
                    // prompt2:"",
                    content:function(event: GameEvent, source: Player, player: Player, target: Player ,trigger: GameEvent,result: BaseCommonResultData) {
                        game.zhu.draw(trigger.num);
                    },
                };

                //水属性：
                //水源: 【主动技】[他](水)的判定牌为黑色且生效后，该角色可以令[自]摸一张牌。
                let _shuiyuan:ExSkillData = {
                    name:"水源",
                    description:NG.Utils.translateDescTxt("【主动技】[他](水)的判定牌为黑色且生效后，该角色可以令[自]摸一张牌。"),
                    isAddGlobalSkill:true,
                    unique:true,
                    // global:"zj_shuxing_shuiyuan",
                    trigger:{
                        player:NG.PhaseTrigger.judge+NG.TriggerEnum.End,
                    },
                    filter:function(event,player) {
                        let result = event.result as JudgeResultData;
                        let isBlack = result && result.bool && result.color == NG.CardColor.Black;
                        return player != game.zhu && player.group == NG.Group.WATER && isBlack;
                    },
                    prompt:function(event){
                        return `是否令【${get.translation(game.zhu)}】其抽一张牌？`;
                    },
                    // prompt2:"",
                    content:function(event: GameEvent, source: Player, player: Player, target: Player ,trigger: GameEvent,result: BaseCommonResultData){
                        game.zhu.draw();
                    }
                };

                //水灵: 【改判技】[自]可令[他们](水)选择是否打出黑色代替之。 【全局轮询技，后续补充】
                let _shuiling:ExSkillData = {
                    name:"水灵",
                    description:NG.Utils.translateDescTxt("【改判技】[自]可令[他们](水)选择是否打出黑色代替之。"),
                    trigger:{
                        player:NG.PhaseTrigger.judge,
                    },
                    filter:function(event,player){
                        let count = game.countPlayer(function(player){
                            return player != game.zhu && player.group == NG.Group.WATER;
                        });
                        return count && player != game.zhu;
                    },
                    // prompt:`可令其他水属性角色选择是否打出黑色牌代替之`,
                    content:function(event: GameEvent, source: Player, player: Player, target: Player ,trigger: GameEvent,result: BaseCommonResultData){
                        player.chooseToRespondByAll({
                            filterPlayer:function(player){
                                return player.group == NG.Group.WATER && player != game.zhu;
                            },
                            prompt:`判定即将生效，你是否为【${get.translation(player)}】打出黑色牌代替之？]`,
                            respondFun:function(event,trigger,player,current,prompt){
                                current.chooseBool(prompt);
                            },
                            respondResultFun:function(event,trigger,result,player,current) {
                                current.replaceJudge({
                                    jTrigger:trigger,
                                    position:NG.PositionType.Use,
                                });
                            },
                        });
                    }
                };

                //水冢: 【主动技】[他](水)造成1点伤害后，该角色可判定，当红色判定牌生效后，[自]获得之。
                let _shuizong:ExSkillData = {
                    name:"水冢",
                    description:NG.Utils.translateDescTxt("【主动技】[他](水)造成1点伤害后，该角色可判定，当红色判定牌生效后，[自]获得之。"),
                    isAddGlobalSkill:true,
                    unique:true,
                    // global:"zj_shuxing_shuizong",
                    trigger:{
                        source:[NG.StateTrigger.damage+NG.TriggerEnum.End],
                    },
                    filter:function(event,player) {
                        return player != game.zhu && player.group == NG.Group.WATER && event.num>0;
                    },
                    prompt:function(event){
                        return `是否进行判定，当红色判定牌生效后，【${get.translation(game.zhu)}】获得？`;
                    },
                    // prompt2:"",
                    content:function(event: GameEvent, source: Player, player: Player, target: Player ,trigger: GameEvent,result: BaseCommonResultData) {
                        "step 0"
                        player.judge((jResult: JudgeResultData)=>{
                            return jResult.color == NG.CardColor.Red?1:0;
                        });
                        "step 1"
                        if(result.bool) {
                            game.zhu.gain(result.card);
                        }
                    },
                };

                //兴衰: 【限定技】[自]进入濒死状态前，[自]可令[他们](水)选择：1.[自]血量+1；2.其受到1点伤害。【全局轮询技，后续补充】
                //改名：“水圣”
                let _xingshuai:ExSkillData = {
                    name:"水圣",
                    // name:"兴衰",
                    description:NG.Utils.translateDescTxt("【限定技】[自]进入濒死状态前，[自]可令[他们](水)选择：1.[自]血量+1；2.其受到1点伤害。"),
                    limited:true,
                    trigger:{
                        player:NG.StateTrigger.dying+NG.TriggerEnum.Before,
                    },
                    filter:function(event,player) {
                        let count = game.countPlayer(function(player){
                            return player != game.zhu && player.group == NG.Group.WATER;
                        });
                        return count && player.isZhu;
                    },
                    content:function(event: GameEvent, source: Player, player: Player, target: Player ,trigger: GameEvent,result: BaseCommonResultData){
                        player.awakenSkill("zj_shuxing_xingshuai");
                        player.chooseToRespondByAll({
                            filterPlayer:function(player){
                                return player.group == NG.Group.WATER && player != game.zhu;
                            },
                            // prompt:`你是否为【${get.translation(player)}】代替成为[${get.translation(event.card)}的目标？]`,
                            respondFun:function(event,trigger,player,current,prompt){
                                current.chooseControlList([
                                    `使【${get.translation(player)}】血量+1`,
                                    `你受到1点伤害`
                                ],true);
                            },
                            respondResultFun:function(event,trigger,result:BaseCommonResultData,player,current) {
                                if(result.index === 0) {
                                    player.recover();
                                } else if(result.index === 1) {
                                    current.damage();
                                }
                            },
                        });
                    }
                };


                //土属性
                //护卫: 【主动技】[自]需要使用或打出一张【闪】时，[自]可以令[他](土)打出一张【闪】(视为由[自]使用或打出)。 【全局轮询技，后续补充】
                //参考：hujia【目前直接摘抄hujia】
                let _huwei:ExSkillData = {
                    name:"护卫",
                    description:NG.Utils.translateDescTxt("【主动技】[自]需要使用或打出一张【闪】时，[自]可以令[他](土)打出一张【闪】(视为由[自]使用或打出)。"),
                    unique:true,
                    zhuSkill:true,
                    trigger:{
                        player:['chooseToRespondBefore','chooseToUseBefore']
                    },
                    filter:function(event,player){
                        if(event.responded) return false;
                        if(player.storage.zj_shuxing_huwei) return false;
                        // if(!player.hasZhuSkill('hujia')) return false;
                        if(!event.filterCard({name:'shan'},player,event)) return false;
                        return game.hasPlayer(function(current){
                            return current!=player&&current.group==NG.Group.SOIL;
                        });
                    },
                    check:function(event,player){
                        if(get.damageEffect(player,event.player,player)>=0) return false;
                        return true;
                    },
                    content:function(event: GameEvent, source: Player, player: Player, target: Player ,trigger: GameEvent,result: BaseCommonResultData){
                        "step 0"
                        if(event.current==undefined) event.current=player.next;
                        if(event.current==player){
                            event.finish();
                        }
                        else if(event.current.group==NG.Group.SOIL){
                            if((event.current==game.me&&!_status.auto)||(
                                get.attitude(event.current,player)>2)||
                                event.current.isOnline()){
                                player.storage.zj_shuxing_huwei=true;
                                var next=event.current.chooseToRespond('是否替'+get.translation(player)+'打出一张闪？',{name:'shan'});
                                next.set('ai',function(){
                                    var event=_status.event;
                                    return (get.attitude(event.player,event.source)-2);
                                });
                                next.set('skillwarn','替'+get.translation(player)+'打出一张闪');
                                next.autochoose=lib.filter.autoRespondShan;
                                next.set('source',player);
                            }
                        }
                        "step 1"
                        player.storage.zj_shuxing_huwei=false;
                        if(result.bool){
                            event.finish();
                            trigger.result={bool:true,card:{name:'shan',isCard:true}};
                            //@ts-ignore
                            trigger.responded=true;
                            trigger.animate=false;
                            if(typeof event.current.ai.shown=='number'&&event.current.ai.shown<0.95){
                                event.current.ai.shown+=0.3;
                                if(event.current.ai.shown>0.95) event.current.ai.shown=0.95;
                            }
                        }
                        else{
                            event.current=event.current.next;
                            event.goto(0);
                        }
                    },
                    ai:{
                        respondShan:true,
                        skillTagFilter:function(player){
                            if(player.storage.zj_shuxing_huwei) return false;
                            // if(!player.hasZhuSkill('hujia')) return false;
                            return game.hasPlayer(function(current){
                                return current!=player&&current.group==NG.Group.SOIL;
                            });
                        },
                    },
                };

                //血裔: 【被动技】[自]手牌上限+X（X=[他](土)角色数）。
                //新版 血裔: 【被动技】[自]手牌上限+2X（X=[他](土)角色数）。
                let _xueyu:ExSkillData = {
                    name:"血裔",
                    description:NG.Utils.translateDescTxt("【被动技】[自]手牌上限+X（X=[他](土)角色数）。"),
                    unique:true,
                    mod:{
                        maxHandcard:function(player,num){
                            let count = game.countPlayer(function(current){
                                return current.group == NG.Group.SOIL && current != player;
                            });
                            return (num+count)*2;
                        },
                    },
                };

                //护卫: 【回合技】[他](土)<准备>，[他]可将一张非武器牌的装备牌置于[自]装备区里，[自]可令其摸一张牌。 
                //改名：守护
                let _huwei2:ExSkillData = {
                    name:"守护",
                    description:NG.Utils.translateDescTxt("【回合技】[他](土)<准备>，[他]可将一张非武器牌的装备牌置于[自]装备区里，[自]可令其摸一张牌。"),
                    isAddGlobalSkill:true,
                    unique:true,
                    trigger:{
                        player:NG.PhaseTrigger.phaseZhunbeiBegin,
                    },
                    filter:function(event,player) {
                        let count = game.countPlayer(function(player){
                            return player != game.zhu && player.group == NG.Group.SOIL;
                        });
                        let cardCount = player.countCards(NG.PositionType.Use,function(card){
                            return get.subtype(card) != NG.CardType.Equip1 && get.type(card) == NG.CardType.Equip;
                        });
                        return count && cardCount && player != game.zhu;
                    },
                    // selectCard:1,
                    // position:NG.PositionType.Use,
                    // filterCard:function(card,player){
                    //     return get.subtype(card) != NG.CardType.Equip1 && get.type(card) == NG.CardType.Equip;
                    // },
                    content:function(event: GameEvent, source: Player, player: Player, target: Player ,trigger: GameEvent,result: BaseCommonResultData){
                        "step 0"
                        player.chooseCard(function(card,player){
                            return get.subtype(card) != NG.CardType.Equip1 && get.type(card) == NG.CardType.Equip;
                        },NG.PositionType.Use);
                        "step 1"
                        if(result.bool) {
                            //如何装备卡牌到被人身上
                            //参考：xinjieyin  
                            event.target = game.zhu;
                            // event.card = result.cards[0];
                            //自己主动播放动画
                            player.$give(result.cards,event.target);
                            event.target.equip(result.cards[0]);
                        } else {
                            event.finish();
                        }
                        "step 2"
                        game.zhu.chooseBool(`是否让【${get.translation(player)}】摸1张牌`);
                        "step 3"
                        if(result.bool) {
                            player.draw();
                        }
                    },
                };

                //誓仇: 【限定技】[自]<准备>，[自]将两张牌交给[他](土)直到其下次进入濒死状态前：[自]受到一次伤害前，[他]可将此伤害转移给其，若此，若其因此而受到伤害进行的伤害结算结束时，其摸X张牌。（X=伤害值）
                let _sichou:ExSkillData = {
                    name:"誓仇",
                    description:NG.Utils.translateDescTxt("【限定技】[自]<准备>，[自]将两张牌交给[他](土)直到其下次进入濒死状态前：[自]受到一次伤害前，[他]可将此伤害转移给其，若此，若其因此而受到伤害进行的伤害结算结束时，其摸X张牌。（X=伤害值）"),
                    limited:true,
                    unique:true,
                    trigger:{
                        player:NG.PhaseTrigger.phaseZhunbeiBegin,
                    },
                    // selectCard:2,
                    // filterCard:lib.filter.all,
                    // position:NG.PositionType.Use,
                    // selectTarget:1,
                    // filterTarget:function(card,player,target){
                    //     return player!=target && target.group == NG.Group.SOIL;
                    // },
                    filter:function(event,player){
                        return player.countCards(NG.PositionType.Handcard) >=2 && 
                            game.countPlayer(function(current){
                                return player!=current && current.group == NG.Group.SOIL;
                            })>0;
                            //!player.storage.zj_shuxing_sichou && 
                    },
                    content:function(event: GameEvent, source: Player, player: Player, target: Player ,trigger: GameEvent,result: BaseCommonResultData){
                        "step 0"
                        // player.storage.zj_shuxing_sichou = true;
                        // player.logSkill("zj_shuxing_sichou");
                        player.awakenSkill("zj_shuxing_sichou");
                        player.chooseCardTarget({
                            selectCard:2,
                            filterCard:lib.filter.all,
                            position:NG.PositionType.Use,
                            selectTarget:1,
                            filterTarget:function(card,player,target){
                                return player!=target && target.group == NG.Group.SOIL;
                            },
                        });
                        "step 1"
                        if(result.bool) {
                            event.target = result.targets[0];
                            player.give(result.cards,event.target);
                            event.target.addTempSkill("zj_shuxing_sichou_state",NG.StateTrigger.dying+NG.TriggerEnum.Before);
                        }
                    },
                    subSkill:{
                        state:{
                            trigger:{
                                global:NG.StateTrigger.damageBegin3,
                            },
                            filter:function(event,player){
                                return event.num>0 && event.player == game.zhu;
                            },
                            // forced:true,
                            // selectTarget:1,
                            // filterTarget:function(card,player,target){
                            //     return player != target;
                            // },
                            content:function(event: GameEvent, source: Player, player: Player, target: Player ,trigger: GameEvent,result: BaseCommonResultData){
                                // event.target = event.targets[0];
                                trigger.player = player;
                                trigger.source && trigger.source.line(player,NG.LineColorConst.fire);
                                //为被转移目标添加一个伤害后抽牌得技能
                                player.addTempSkill("zj_shuxing_sichou_damage",NG.StateTrigger.damage+NG.TriggerEnum.After);
                            },
                            //显示标记：
                            mark:true,
                            marktext:"誓",
                            intro:{
                                content:function(storage,player,skill){
                                    return `直到你下次进入濒死状态前：【${get.translation(game.zhu)}】受到一次伤害前，你可将此伤害转移给你，若此，若其因此而受到伤害进行的伤害结算结束时，你摸X张牌。（X=伤害值）`;
                                },
                            },
                        },
                        damage:{
                            trigger:{
                                player:NG.StateTrigger.damage+NG.TriggerEnum.End,
                            },
                            filter:function(event,player){
                                return event.num>0;
                            },
                            silent:true,
                            content:function(event: GameEvent, source: Player, player: Player, target: Player ,trigger: GameEvent,result: BaseCommonResultData){
                                player.draw(trigger.num);
                            },
                        }
                    }
                };
                // let sichouState:ExSkillData = {
                //     name:"誓仇",
                //     // description:NG.Utils.translateDescTxt("[自]受到一次伤害前，[他]可将此伤害转移给其，若此，若其因此而受到伤害进行的伤害结算结束时，其摸X张牌。（X=伤害值）"),
                //     derivation:"zj_shuxing_sichou",
                // };
                //受伤后，摸伤害得牌
                // let sichouDamageAfter:ExSkillData = {
                // };

                //木属性
                // 救护: 【被动技】[他](木)对处于濒死状态的[自]使用【血】的血量回复值+1。
                let jiuhu:ExSkillData = {
                    name:"救护",
                    description:NG.Utils.translateDescTxt("【被动技】[他](木)对处于濒死状态的[自]使用【血】的血量回复值+1。"),
                    unique:true,
                    trigger:{
                        target:NG.CardTrigger.tao+NG.TriggerEnum.Begin
                    },
                    // zhuSkill:true,
                    forced:true,
                    filter:function(event,player){ 
                        if(event.player==player) return false; 
                        // if(!player.hasZhuSkill('jiuyuan')) return false; 
                        if(event.player.group!=NG.Group.WOOD) return false; 
                        return true; 
                    },
                    content:function(event: GameEvent, source: Player, player: Player, target: Player ,trigger: GameEvent,result: BaseCommonResultData){
                        trigger.baseDamage++; 
                    },
                };
                // 木源: 【主动技】[他](木)回复血量后，该角色可令[自]摸一张牌。 
                let muyuan:ExSkillData = {
                    name:"木源",
                    description:NG.Utils.translateDescTxt("【主动技】[他](木)回复血量后，该角色可令[自]摸一张牌。"),
                    isAddGlobalSkill:true,
                    unique:true,
                    trigger:{
                        player:NG.StateTrigger.recover+NG.TriggerEnum.End,
                    },
                    filter:function(event,player){
                        //&& player.hasSkill("") 是否有某原型技能
                        return player != game.zhu && event.num>0 && event.player.group == NG.Group.WOOD;
                    },
                    prompt:function(event){
                        return `你回复血量后，可令【${get.translation(game.zhu)}】摸1张牌？`;
                    },
                    // prompt2:"",
                    content:function(event: GameEvent, source: Player, player: Player, target: Player ,trigger: GameEvent,result: BaseCommonResultData){
                        game.zhu.draw();
                    },
                };
                // 木帝: 【主动技】[自]的牌于<弃牌>因弃置而置入弃牌堆时，[自]可交给至少一名[他](木)各一张其中的牌。
                let mudi:ExSkillData = {
                    name:"木帝",
                    description:NG.Utils.translateDescTxt("【主动技】[自]的牌于<弃牌>因弃置而置入弃牌堆时，[自]可交给至少一名[他](木)各一张其中的牌。"),
                    unique:true,
                    trigger:{
                        player:NG.PhaseTrigger.phaseDiscard+NG.TriggerEnum.End,
                    },
                    filter:function(event,player){
                        return event.cards && event.cards.length>0 && game.countPlayer(function(current){
                            return current != player && current.group == NG.Group.WOOD;
                        })>0;
                    },
                    // selectTarget:function(){
                    //     let event = _status.event;
                    //     let count = game.countPlayer(function(player){
                    //         // return !player.hasSkill("mudi") && player.group == NG.Group.WOOD;
                    //         return player != game.zhu && player.group == NG.Group.WOOD;
                    //     });
                    //     let num = event.cards?event.cards.length<count?event.cards.length:count:0;
                    //     return [1,num];
                    // },
                    // filterTarget:function(card,player,target){
                    //     return player != target && target.group == NG.Group.WOOD;
                    // },
                    content:function(event: GameEvent, source: Player, player: Player, target: Player ,trigger: GameEvent,result: BaseCommonResultData){
                        "step 0"
                        event.num = 0;
                        event.targets = get.players(function(current){
                            return current != player && current.group == NG.Group.WOOD;
                        });
                        "step 1"
                        if(event.num < event.targets.length && event.targets[event.num] && trigger.cards.length) {
                            event.target = event.targets[event.num];
                            player.chooseCardButton(1,trigger.cards,`交给1张牌给【${get.translation(event.target)}】`);
                        } else {
                            event.finish();
                        }
                        "step 2"
                        if(result.bool) {
                            event.num++;
                            player.give(result.links,event.target,true);
                            trigger.cards.removeArray(result.links);
                            if(trigger.cards && trigger.cards.length) {
                                event.goto(1);
                            }
                        } else {
                            event.num++;
                            event.goto(1);
                        }
                    },
                };
                // 竹取: 【主动技】[他](木)的红桃判定牌生效后，其可令[自]血量+1。
                let zuqu:ExSkillData = {
                    name:"竹取",
                    description:NG.Utils.translateDescTxt("【主动技】[他](木)的红桃判定牌生效后，其可令[自]血量+1。"),
                    isAddGlobalSkill:true,
                    unique:true,
                    trigger:{
                        player:NG.PhaseTrigger.judge+NG.TriggerEnum.End,
                    },
                    filter:function(event,player) {
                        let result:JudgeResultData = event.result;
                        return player != event.player && player.group == NG.Group.WOOD && result.bool && result.suit == NG.CardColor.Heart;
                    },
                    prompt:function(event) {
                        let result:JudgeResultData = event.result;
                        return `你的判定${(event.judgestr || '')}的判定为${get.translation(result.card)}为红色生效，是否令【${get.translation(game.zhu)}】血量+1`;
                    },
                    content:function(event: GameEvent, source: Player, player: Player, target: Player ,trigger: GameEvent,result: BaseCommonResultData) {
                        game.zhu.recover();
                    },
                };


                //金属性
                // 法华: 【主动技】[自]成为[他]使用的魔法牌的目标时，[自]可令[他们](金)选择是否代替[自]成为此牌的目标。【全局轮询技，后续补充】
                // 先用这个测试全局轮询技：
                let fahua:ExSkillData = {
                    name:"法华",
                    description:NG.Utils.translateDescTxt("【主动技】[自]成为[他]使用的魔法牌的目标时，[自]可令[他们](金)选择是否代替[自]成为此牌的目标。"),
                    trigger:{
                        target:NG.CardTrigger.useCardToTarget,
                    },
                    filter:function(event,player){ 
                        if(event.player==player) return false; 
                        //目标包括自己
                        if(event.multitarget) { //get.info(event.card).multitarget || 
                            if(!event.targets || !event.targets.contains(player)) return false; 
                        }
                        var type=get.type2(event.card,player); 
                        if(type!=NG.CardType.Trick) return false; 
                        // if(lib.filter.targetEnabled2(event.card,event.player,player)){ 
                        //     for(var i=0;i<event.targets.length;i++){ 
                        //         if(get.distance(event.targets[i],player)<=1) return true; 
                        //     } 
                        // } 
                        if(game.countPlayer(function(current){
                            return current.group == NG.Group.GOLD && current != player;
                        })<=0) return false;
                        return true;
                    },
                    content:function(event: GameEvent, source: Player, player: Player, target: Player ,trigger: GameEvent,result: BaseCommonResultData){
                        "step 0"
                        //目前该循环询问方法未完善，暂时这样
                        player.chooseToRespondByAll({
                            filterPlayer:function(player){
                                return player.group == NG.Group.GOLD && player != game.zhu;
                            },
                            prompt:`你是否为【${get.translation(player)}】代替成为[${get.translation(trigger.card)}的目标？]`,
                            respondFun:function(event,trigger,player,current,prompt){
                                current.chooseBool(prompt);
                            },
                            respondResultFun:function(event,trigger,result,player,current) {
                                if(result.bool) {
                                    //目标替换没有成功
                                    if(trigger.multitarget) {
                                        trigger.targets.remove(game.zhu);
                                        trigger.targets.add(current);
                                        trigger.player.line(current,NG.LineColorConst.green); 
                                    } else {
                                        trigger.target = current;
                                        trigger.player.line(current,NG.LineColorConst.green);
                                    }
                                }
                            },
                        });

                    },
                } 
                // 支援: 【主动技】[自]失去最后的手牌时，[他](金)可交给你一张手牌。 
                let zhiyuan:ExSkillData = {
                    name:"支援",
                    description:NG.Utils.translateDescTxt("【主动技】[自]失去最后的手牌时，[他](金)可交给你一张手牌。"),
                    isAddGlobalSkill:true,
                    unique:true,
                    trigger:{
                        player:NG.CardTrigger.lose+NG.TriggerEnum.After,
                    },
                    filter:function(event,player){ 
                        if(player.countCards(NG.PositionType.Handcard)) return false; 
                        //有失去的手牌
                        return event.hs&&event.hs.length>0 && player.group == NG.Group.GOLD && 
                            event.player == game.zhu &&
                            event.player.countCards(NG.PositionType.Handcard) == 0 &&
                            player != game.zhu; 
                    },
                    prompt:function(event){
                        return `【${get.translation(game.zhu)}】失去最后的手牌，你可以交给【${get.translation(game.zhu)}】1张手牌`;
                    },
                    selectCard:1,
                    position:NG.PositionType.Handcard,
                    content:function(event: GameEvent, source: Player, player: Player, target: Player ,trigger: GameEvent,result: BaseCommonResultData){
                        event.target = game.zhu;
                        player.give(event.cards,event.target);
                    },
                };
                // 金灵: 【被动技】[自]死亡时，[自]可令[他](金)身份牌暗置的角色将其身份牌明置，若为忠臣，其成为主公。
                // 卧槽，这个技能可能影响流程，到时得看下改变zhu身份影响大不
                let jingling:ExSkillData = {
                    name:"金灵",
                    description:NG.Utils.translateDescTxt("【被动技】[自]死亡时，[自]可令[他](金)身份牌暗置的角色将其身份牌明置，若为忠臣，其成为主公。"),
                    unique:true,
                    trigger:{
                        player:NG.StateTrigger.die+NG.TriggerEnum.Begin,
                    },
                    filter:function(event,player){ 
                        return game.countPlayer(function(current){
                            return current.group == NG.Group.GOLD && !current.identityShown && current!=player;
                        })>0;
                    },
                    selectTarget:1,
                    filterTarget:function(card,player,target){
                        return target.group == NG.Group.GOLD && !target.identityShown && player != target;
                    },
                    content:function(event: GameEvent, source: Player, player: Player, target: Player ,trigger: GameEvent,result: BaseCommonResultData){
                        "step 0"
                        event.target = event.targets[0];
                        game.broadcastAll(function(source:Player){
                            source.setIdentity();
                        },event.target);
                        // event.target.setIdentity();
                        game.addVideo('setIdentity',event.target);
                        "step 1"
                        if(event.target.identity == NG.IdentityConst.zhong) {
                            //如何重新设置主公，不知直接交换可以不
                            game.broadcastAll(function(player:Player,target:Target){ 
                                var pidentity=player.identity; 
                                var tidentity=target.identity;
                                player.setIdentity(tidentity);
                                target.setIdentity(pidentity);
                            },player,event.target);
                            player.line(event.target,NG.LineColorConst.green);
                        }
                    },
                };
                // 金魂: 【觉醒技】[自]<准备>，[自]血量最小的角色，[自]血量和血槽各+1，并获得技能“金源”。
                let jinghun:ExSkillData = {
                    name:"金魂",
                    description:NG.Utils.translateDescTxt("【觉醒技】[自]<准备>，[自]血量最小的角色，[自]血量和血槽各+1，并获得技能“金源”。"),
                    //觉醒技相关配置：
                    skillAnimation:true,
                    animationColor:NG.NatureColorConst.metal,
                    unique:true,
                    juexingji:true,
                    //需要附加技能：
                    keepSkill:true,
                    // derivation:"jingyuan",
                    forced:true,
                    trigger:{
                        player:NG.PhaseTrigger.phaseZhunbeiBegin,
                    },
                    filter:function(event,player) {
                        return player.isMinHp(true);
                    },
                    content:function(event: GameEvent, source: Player, player: Player, target: Player ,trigger: GameEvent,result: BaseCommonResultData){
                        "step 0"
                        player.gainMaxHp();
                        "step 1"
                        player.recover();
                        game.log(player,'获得了技能','#g【金源】'); 
                        // player.addSkill('zj_awaken_jingyuan'); 
                        // player.awakenSkill("zj_awaken_jingyuan");
                        player.addAdditionalSkill('zj_shuxing_jinghun','zj_awaken_jingyuan');
                        player.awakenSkill("zj_awaken_jingyuan");
                    },
                };
                // 金源: 【主动技】[他](金)<出牌>，其可将一张魔法牌交给你[自]。
                let jingyuan:ExSkillData = {
                   name:"金源",
                   description:NG.Utils.translateDescTxt("【主动技】[他](金)<出牌>，其可将一张魔法牌交给你[自]。"),
                   unique:true,
                //    global:"zj_global_jingyuan",
                   global:"zj_awaken_jingyuan_global",
                   subSkill:{
                        global:{
                            derivation:"zj_awaken_jingyuan",
                            enable:NG.EnableTrigger.phaseUse,
                            filter:function(event,player){
                                return player.countCards(NG.PositionType.Use,function(card){
                                    return get.type2(card,player) == NG.CardType.Trick;
                                }) && player.group == NG.Group.GOLD && player != game.zhu;
                            },
                            selectCard:1,
                            filterCard:function(card,player) {
                                return get.type2(card,player) == NG.CardType.Trick;
                            },
                            prompt:function(event) {
                                return `可将一张魔法牌交给【${get.translation(game.zhu)}】`;
                            },
                            content:function(event: GameEvent, source: Player, player: Player, target: Player ,trigger: GameEvent,result: BaseCommonResultData){
                                player.give(event.cards,game.zhu);
                            },
                        },
                   }
                };
                // let global_jingyuan:ExSkillData = {
                //     name:"金源",
                // };

                //无属性
                // 物语: 【被动技】[他](非无)死亡时，视为由[自]杀死。
                let wuyu:ExSkillData = {
                    name:"物语",
                    description:NG.Utils.translateDescTxt("【被动技】[他](非无)死亡时，视为由[自]杀死。"),
                    unique:true,
                    trigger:{
                        global:NG.StateTrigger.die+NG.TriggerEnum.Begin,
                    },
                    forced:true,
                    priority:20,
                    filter:function(event,player){
                        return  event.player && event.player.group != NG.Group.NONE && 
                            player != event.player && player != event.source;
                    },
                    content:function(event: GameEvent, source: Player, player: Player, target: Player ,trigger: GameEvent,result: BaseCommonResultData){
                        trigger.source = player;
                    },
                };
                // 无义: 【回合技】[他](无)<准备>，[他]可与[自]交换手牌（[自]可拒绝此交换）。
                let wuyi:ExSkillData = {
                    name:"无义",
                    description:NG.Utils.translateDescTxt("【回合技】[他](无)<准备>，[他]可与[自]交换手牌（[自]可拒绝此交换）。"),
                    isAddGlobalSkill:true,
                    unique:true,
                    trigger:{
                        player:NG.PhaseTrigger.phaseZhunbeiBegin,
                    },
                    usable:1,
                    filter:function(event,player){
                        return player.group == NG.Group.NONE && player != game.zhu;
                    },
                    prompt:function(event){
                        return `你可与【${get.translation(game.zhu)}】交换手牌（【${get.translation(event.player)}】可拒绝此交换）？`;
                    },
                    content:function(event: GameEvent, source: Player, player: Player, target: Player ,trigger: GameEvent,result: BaseCommonResultData){
                        "step 0"
                        event.target = game.zhu;
                        game.zhu.chooseBool(`你是否要和${get.translation(player)}交换手牌？`);
                        "step 1"
                        if(result.bool) {
                            player.swapHandcards(event.target);
                        }
                    },
                    
                };
                // 无衣: 【回合技】[他](无)<准备>，[他]可跳过其的<摸牌>，令[自]在下回合的<摸牌>摸牌+2。
                let wuyi2:ExSkillData = {
                    name:"wuyi2",
                    description:NG.Utils.translateDescTxt("【回合技】[他](无)<准备>，[他]可跳过其的<摸牌>，令[自]在下回合的<摸牌>摸牌+2。"),
                    isAddGlobalSkill:true,
                    unique:true,
                    trigger:{
                        player:NG.PhaseTrigger.phaseZhunbeiBegin,
                    },
                    usable:1,
                    filter:function(event,player){
                        return player.group == NG.Group.NONE && player != game.zhu;
                    },
                    prompt:function(event){
                        return `你要跳过自己的摸牌阶段，令【${get.translation(game.zhu)}】在下回合的摸牌阶段摸牌数+2？`;
                    },
                    content:function(event: GameEvent, source: Player, player: Player, target: Player ,trigger: GameEvent,result: BaseCommonResultData){
                        "step 0"
                        event.target = game.zhu;
                        trigger.cancel();
                        //为主公添加摸牌阶段，摸牌数+2技能；
                        event.target.storage.drawPhaseDrawAdd = 2;
                        event.target.addTempSkill("drawPhaseDrawAdd",NG.PhaseTrigger.phaseDraw+NG.TriggerEnum.End);
                    },
                };
                //增加抽牌阶段的抽牌数量
                let drawPhaseDrawAdd:ExSkillData = {
                    name:"追加摸牌",
                    description:"摸牌阶段摸牌数增加",
                    trigger:{
                        player:NG.PhaseTrigger.phaseDraw+NG.TriggerEnum.Begin,
                    },
                    silent:true,
                    mark:true,
                    marktext:"摸",
                    intro:{
                        content:"下回合的摸牌阶段摸牌数+#",
                    },
                    filter:function(event,player){
                        return player.storage.drawPhaseDrawAdd;
                    },
                    content:function(event: GameEvent, source: Player, player: Player, target: Player ,trigger: GameEvent,result: BaseCommonResultData){
                        trigger.num += player.storage.drawPhaseDrawAdd;
                    }
                };
                // 无域: 【限定技】[自]<出牌>，[自]可令[他](非无)身份牌暗置的角色将其身份牌明置：若为忠臣，[自]弃置所有牌；若为反贼，[自]摸三张牌。
                let wuyu2:ExSkillData = {
                    name:"无域",
                    description:NG.Utils.translateDescTxt("【限定技】[自]<出牌>，[自]可令[他](非无)身份牌暗置的角色将其身份牌明置：若为忠臣，[自]弃置所有牌；若为反贼，[自]摸三张牌。"),
                    unique:true,
                    enable:NG.EnableTrigger.phaseUse,
                    limited:true,
                    // zhuSkill:true,
                    filter:function(event,player){
                        return game.countPlayer(function(current){
                            return !current.identityShown && current.group != NG.Group.NONE && current != game.zhu;
                        }) > 0 && player.isZhu;
                    },
                    selectTarget:1,
                    filterTarget:function(card,player,target){
                        return !target.identityShown && target.group != NG.Group.NONE && target != game.zhu;
                    },
                    content:function(event: GameEvent, source: Player, player: Player, target: Player ,trigger: GameEvent,result: BaseCommonResultData){
                        "step 0"
                        player.awakenSkill("zj_shuxing_wuyu2");
                        event.target = event.targets[0];
                        game.broadcastAll(function(source:Player){
                            source.setIdentity();
                        },event.target);
                        // event.target.setIdentity();
                        game.addVideo('setIdentity',event.target);
                        "step 1"
                        if(event.target.identity == NG.IdentityConst.zhong) {
                            player.discard(player.getCards(NG.PositionType.Use));
                        } else if(event.target.identity == NG.IdentityConst.fan) {
                            player.draw(3);
                        }
                    },
                    
                };

                let output = {
                    _bossGetSkills:_bossGetSkills,

                    //不能直接将一些全局技能以全局技能命名，要不就直接触发了
                    //火属性：
                    zj_shuxing_yanzheng:_yanzheng,
                    zj_shuxing_yanhuo:_yanhuo,
                    zj_shuxing_huohun:huohun,
                    zj_awaken_huohun:_awaken_huohun,
                    zj_global_huohun:zj_global_huohun,
                    zj_shuxing_huoling:new_huoling,

                    //水属性：
                    zj_shuxing_shuiyuan:_shuiyuan,
                    zj_shuxing_shuizong:_shuizong,
                    zj_shuxing_shuiling:_shuiling,
                    zj_shuxing_xingshuai:_xingshuai,

                    //土属性：
                    zj_shuxing_xueyu:_xueyu,
                    zj_shuxing_huwei2:_huwei2,
                    zj_shuxing_sichou:_sichou,
                    zj_shuxing_huwei:_huwei,

                    //木属性：
                    zj_shuxing_jiuhu:jiuhu,
                    zj_shuxing_muyuan:muyuan,
                    zj_shuxing_mudi:mudi,
                    zj_shuxing_zuqu:zuqu,

                    //金属性：
                    zj_shuxing_zhiyuan:zhiyuan,
                    zj_shuxing_jingling:jingling,
                    zj_shuxing_jinghun:jinghun,
                    zj_awaken_jingyuan:jingyuan,
                    // zj_global_jingyuan:global_jingyuan,
                    zj_shuxing_fahua:fahua,

                    //无属性：
                    zj_shuxing_wuyu:wuyu,
                    zj_shuxing_wuyi:wuyi,
                    zj_shuxing_wuyi2:wuyi2,
                    drawPhaseDrawAdd:drawPhaseDrawAdd,
                    zj_shuxing_wuyu2:wuyu2,
                };

                return output;
            });
    })();
}