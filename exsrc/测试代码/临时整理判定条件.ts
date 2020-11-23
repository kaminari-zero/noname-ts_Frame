//@ts-nocheck
module ZJNGEx {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "临时整理判定条件.", NG.ImportFumType.none,

            //整理，分析，其中严格触发条件，并不一定会做成使用方法，可能仅当做分析用例
            function (lib: Lib, game: Game, ui: UI, get: Get, ai: AI, _status: Status) {
                //*******************当你受到伤害后************************
                get.damage = {};
                /** 你可以获得对你造成伤害的牌: */
                get.isGetDamegedCard = function(event:GameEvent) {
                    //对你造成伤害的牌，即使用的牌，应该要在预处理区中，才可操作
                    return get.itemtype(event.cards)=='cards'&&get.position(event.cards[0],true)=='o';
                }
                /** 你可以获得对你造成伤害的牌2: */
                get.isGetDamegedCard2 = function(event:GameEvent) {
                    //对你造成伤害的牌，即使用的牌，应该要在预处理区中，才可操作
                    return event.cards&&event.cards.filterInD().length>0;;
                }

                /** 你可以获得伤害来源的一张牌 */
                get.isGetDamegeSourceCard = function(event:GameEvent,player:Player){
                    //1.基础规则下，不做声明情况下，默认获取手牌+装备区的牌
                    //2.必须受到伤害
                    return (event.source&&event.source.countGainableCards(player,'he')&&event.num>0&&event.source!=player);
                }

                //*******************当你造成伤害************************
                /** 你本回合内使用xxx造成伤害时 */
                get.isDamegeByCard = function(event:GameEvent,cardNames:string[]){
                    //1.需要是卡牌造成的伤害；
                    //2.该伤害不能是“连环”传递的伤害；
                    return event.card&&cardNames.contains(event.card.name)&&event.notLink();
                }

                /**  因你使用的“杀”造成伤害时，需要舍弃距离为1的角色的牌 时机：source:'damageSource', */
                get.canDiscardByDameged = function(event:GameEvent,player:Player){
                    return event.getParent().name=='sha'&&
                        game.hasPlayer(function(current){
                            return (current==event.player|| //表示目标角色
                                        current!=player&&   //其他角色，自己排除在外
                                        get.distance(current,event.player)<=1)&&    //与目标角色距离为1以内
                                    current.countDiscardableCards(player,'he')>0; //目标角色需要有能弃置的牌
                        });
				}

                /** 失去装备区的牌，事件：loseAfter */
                get.isLoseEquie = function(event:GameEvent){
					return event.es&&event.es.length;
				},


                /** 当你的判定牌生效后 */
                get.isJudgeEndCard = function(event:GameEvent){
                    //判定牌在预处理区
                    return get.position(event.result.card,true)=='o';
                }



                /** 选择一名目标角色,打出xxx */
                get.canUsedCardByPlayer = function(event:GameEvent,player:Player,cardNames:string[]){
                    //1.使用当前技能的filterCard方法进行第一次过滤；
                    //2.通过lib.filter.cardUsable过滤玩家是否能使用；
                    for (let i = 0; i < cardNames.length; i++) {
                        const card = cardNames[i];
                        if(event.filterCard&&!event.filterCard({name:card},player,event)) return false;
                        if(!lib.filter.cardUsable({name:card},player)) return false;
                    }
					return true;
                }

                /** 使其他玩家回血 */
                get.canRecove = function(player:Player,isSelf?:boolean){
					return game.hasPlayer(function(current){
                        return (isSelf || current!=player)&&current.isDamaged();
					})
                }
                
                /** 你使用或打出牌响应其他角色，或其他角色使用或打出牌响应你后，时机：global:['useCard','respond'] */
                get.isRespondToPlayer = function(event:GameEvent,player:Player){
                    return Array.isArray(event.respondTo)&& //只有触发了“chooseToRespond”，才会有该参数
                            event.respondTo[0]!=event.player&&  //被响应的玩家是其他玩家，不能是响应玩家
                            [event.respondTo[0],event.player].contains(player); //当前玩家是否是属于被响应玩家，响应玩家
                }
                
                /** 你的回合外，当有装备牌进入弃牌堆后，若这些牌不是从你的区域移动的，则...... 时机：global:['loseAfter','cardsDiscardAfter'] */
                get.isTurnoverCard = function(event:GameEvent,player:Player){
                    return player!=event.player&&
                            player!=_status.currentPhase&& //当前回合玩家不是你，即不是你的回合
                            event.cards&&
                            event.cards.filter(function(card){ //过滤失去，弃置的卡牌：
                                return get.position(card,true)=='d'&& //该牌的位置是“弃牌堆”
                                        get.type(card)=='equip'; //该牌的类型为装备牌
                            }).length>0;
                }
                
                /** 出牌阶段限X次（X为你的体力值）..... */
                get.isUseSkillLimit = function(event:GameEvent,player:Player,skillName:string){
					return (player.getStat('skill')[skillName]||0)<player.hp; //根据统计玩家使用技能的记录来动态限制技能是否可以持续使用（不使用次数配置的情况下）
                }
                
                /** 当一名角色于回合外受到伤害，或其手牌被其他角色弃置或获得后，你可以...... 时机：global:["gainAfter","loseAfter","damageEnd"] */
                get.fuzhaOutofRound = function (event:GameEvent){
                    var evt=event;
                    //1.被弃置牌：
					if(event.name=='lose'){ 
						if(event.type!='discard') return false;//type为discard，即触发了discard方法弃置；
						evt=event.getParent();//此时为discard触发的lose事件，需要处理的是discard事件；
					}
					var player=evt[event.name=='gain'?'source':'player'];//若为获得事件，则当前player为牌的获得源；否则player为当前事件player（弃置牌的玩家，受伤的玩家）
                    if(!player||player==_status.currentPhase||player.isDead()) return false; //该角色必须为回合外，且活着
                    //2.受伤：
                    if(event.name=='damage') return true;
                    //3.被获得：
                    if(evt[event.name=='gain'?'bySelf':'notBySelf']!=true) return false; //当前玩家不能是获得牌的那个/不是弃置别人的牌的那个
                    //因被获得失去牌：
					if(event.name=='lose') return event.hs.length>0;
					return event.relatedLose&&event.relatedLose.hs&&event.relatedLose.hs.length>0;//其他角色手牌被获得了
                }
                
                /** 其他角色交给你牌后，... ...   时机：player:"gainAfter" */
                get.otherGivedMeAfter = function(event:GameEvent){
                    return get.itemtype(event.source)=='player'&& //1.必须要有交给你牌的来源玩家；
                            event.bySelf!=true; //2.你获得了牌，但是，不是你主动获得的；
                }
                

                /** 关于决斗胜负： 时机：player:'juedouAfter' */
                get.isJeudouWin = function(event:GameEvent,player:Player){
                    if(event.target.isDead()) return false;
                    //若最终turn的玩家不是该玩家，该玩家就赢，否则输；
					return event.turn&&event.turn != player;
                }
                
                /** 其他角色对你使用的牌结算完成后...... 时机：global:'useCardAfter' */
                get.isOtherUseCardToPlayer = function(event:GameEvent,player:Player){
                    return player!=event.player&&   //你不能是使用牌的角色
                            event.targets&&event.targets.contains(player)&& //该使用牌的目标中 有你
                            (_status.connectMode||player.hasSha());  //加上联机判断，联机中，即使没杀也会提示发动技能（伪装有杀ing）；
				}
                
                /** 你已因〖xxx〗获得了n张甚至更多的牌时... ...  时机： */
                get.haveGainCardBySkill = function(player:Player,skill:string,gainCount:number){
                    var num=0;
                    //通过记录查看自己获得牌的方式：
					player.getAllHistory('gain',function(evt){
						if(evt.getParent().name==skill) num+=evt.cards.length;
					});
					return num>=gainCount;
                }
                
                /** 你可以和一名其他角色拼点 */
                get.haveComparePlayer = function(player:Player){
                    //1.发起拼点玩家需要有手牌；
                    //2.需要有能拼点的玩家；
					return player.countCards('h')>0&&game.hasPlayer(function(current){
						return player.canCompare(current);
					});
                }
                
                /** 可以使用xx牌进行拼点.... 时机：enable:"chooseCard" */
                get.canUseSomeCardCompare = function(event:GameEvent){
                    //后续，配合，技能配置的onCompare：
                    return event.type=='compare'&& //1.chooseCard的时机为 拼点的时机；
                            !event.directresult;   //2.还没有拼点的牌；
                }
                
                /** 当你拼点后，你可以获得两张拼点牌 */
                get.canGetCompareCard = function(event:GameEvent){
                    if(event.preserve) return false; //该限制不明，应该是标明有些特殊拼点的场合，例如，制霸......
                    //双方玩家的拼点牌，在预处理区，弃牌区，才能获取
                    return [event.card1,event.card2].filterInD('od').length>0;
                }

                /** 其他角色使用或打出牌响应你使用的牌时......  时机：global:['respond','useCard'] */
                get.isRespondToPlayer = function(event:GameEvent,player:Player){
                    //1.其他角色：
					if(!event.respondTo) return false;
					if(event.player==player) return false;//该事件触发不能是当前玩家
                    if(player!=event.respondTo[0]) return false; //当前玩家不是响应的玩家
                    //2.是否有可获取的响应牌：
                    var cards=[]
                    if(get.itemtype(event.respondTo[1])=='card') cards.push(event.respondTo[1]); //非转化卡牌
                    else if(event.respondTo[1].cards) cards.addArray(event.respondTo[1].cards); //转化卡牌
                    //这些卡牌需要在预处理区，弃牌区
                    return cards.filterInD('od').length>0;
                }
                
                /** 你可以将xxxxx当做任意基本牌使用或打出，时机：enable:'chooseToUse' */
                get.canUseSomeVCard = function(event:GameEvent,player:Player){
                    // if(event.type=='wuxie'||!player.countCards('he',{suit:'diamond'})) return false;
                    //当前chooseToUse，正处于无懈响应时期，跳过；
					if(event.type=='wuxie') return false;
					for(var i=0;i<lib.inpile.length;i++){
						var name=lib.inpile[i];
                        if(name!='du'&&
                                get.type(name)=='basic'&&
                                event.filterCard({name:name},player,event)) //过滤方法，直接使用当前触发事件的filterCard来过滤；
                            return true;
					}
					return false;
                }
                
                /** 每当你使用（指定目标后）或被使用（成为目标后）一张【xxx】时，时机：player:'useCardToPlayered'，target:'useCardToTargeted' */
                get.isUseCardTarget = function(event:GameEvent,player:Player,cardNames:string[]){
					if(!cardNames.contains(event.card.name)) return false; //后续改成增加细节判断
					return player==event.target||event.getParent().triggeredTargets3.length==1;
                }
                
                /** 你的回合内，当一张牌进入弃牌堆后，若本回合内没有过与此牌花色相同的卡牌进入过弃牌堆，则... ... 时机：global:['loseAfter','cardsDiscardAfter'] */
                get.isFuzhaSkill_iwasawa_refenyin = function(event:GameEvent,player:Player){
					if(player!=_status.currentPhase) return false; //当前为你的回合；
                    if(event.name=='lose'&&event.position!=ui.discardPile) return false; //当前lose事件，前往的位置不是弃牌区；
                    // 记录当前弃牌的花色：
					var list=[];
					for(var i=0;i<event.cards.length;i++){
						var card=event.cards[i];
						list.add(card.suit);
                    }
                    // 移除本回合进入弃牌堆的花色：
                    // 获取本回合内所有卡牌移动区域的操作的记录：
					game.getGlobalHistory('cardMove',function(evt){
						if(evt==event||(evt.name!='lose'&&evt.name!='cardsDiscard')) return false;
						if(evt.name=='lose'&&evt.position!=ui.discardPile) return false;
						for(var i=0;i<evt.cards.length;i++){
							var card=evt.cards[i];
							list.remove(card.suit);
						}
					});
					return list.length>0;
				}

                /** 你的回合内，当你使用牌时，若此牌与你于此回合内使用的上一张牌的颜色不同,  时机：player:'useCard' */
                get.isFuzhaSkill_iwasawa_fenyin = function(event:GameEvent,player:Player){
					if(_status.currentPhase!=player) return false;
					var evt=player.getLastUsed(1); //获取此回合内使用的上一张牌的“useCard”事件
					if(!evt) return false;
					var color1=get.color(evt.card);
					var color2=get.color(event.card);
					return color1&&color2&&color1!='none'&&color2!='none'&&color1!=color2;
				}

                /** 当你使用红色的非伤害性基本牌/锦囊牌选择目标时，或成为其他角色使用的这些牌的目标时，时机：player:'useCard2',target:'useCardToTarget', */
                get.isFuzhaSkill_komari_tiankou = function(event:GameEvent,player:Player,name:string){
					if(name=='useCardToTarget'&&player==event.player) return false;//你是用牌选择的目标不能是自己；
					if(get.color(event.card)!='red') return false;
					if(get.tag(event.card,'damage')) return false;//伤害性的牌
					return ['basic','trick'].contains(get.type(event.card));//基本牌/锦囊牌
                }
                
                /** 当一名角色使用锦囊牌时，若此牌是其本回合内使用的第一张牌，时机：global:'useCard' */
                get.isFuzhaSkill_nslongyue = function(event:GameEvent){
					return get.type(event.card,'trick')=='trick'&&event.player.getHistory('useCard').indexOf(event)==0;//当前回合只有一个useCard记录
                }
                
                /** 你在一个回合中使用前两张牌时，时机：player:'useCardAfter' */
                get.isFuzhaSkill_nsguhuo = function(event:GameEvent,player:Player){
					// if(event.parent.name=='nsguhuo') return false; //不能是自身技能发起的使用卡牌
					if(event.card==event.cards[0]){ //该使用卡牌，是必须要用牌使用的；
						var type=get.type(event.card,'trick');
						var names=[];
						if(get.cardPile(function(card){
							if(get.type(card,'trick')!=type) return false;
							if(get.info(card).multitarget) return false;
							if(names.contains(card.name)) return false;
							if(player.hasUseTarget(card)){
								return true;
							}
							else{
								names.add(card.name);
								return false;
							}
						})){
							return true;
						}
					}
					return true;
                }
                
                /** 单体锦囊牌无法对你造成伤害，时机：player:'damageBefore' */
                get.isFuzhaSkill_nsdongcha = function(event:GameEvent){
					if(get.type(event.card,'trick')=='trick'){
						if(event.getParent(2).name=='useCard'){
							return event.getParent(2).targets.length==1;//目标只有你一个
						}
						return true;
					}
					return false;
                }
                
                /** 当一名角色于除你之外的角色的出牌阶段内因弃置而失去牌后，时机：global:'discardAfter' */
                get.isFuzhaSkill_duoqi = function(event:GameEvent,player:Player){
					if(_status.currentPhase==player) return false;//你之外
					var evt=event.getParent('phaseUse'); 
					if(evt&&evt.name=='phaseUse') return true;//该弃置是在出牌阶段
					return false;
                }
                
                /** 弃牌阶段结束时，若你于此阶段内弃置过两张或更多的牌，时机：player:'phaseDiscardEnd' */
                get.isFuzhaSkill_qinyin = function(event:GameEvent,player:Player){
					var cards=[];
					player.getHistory('lose',function(evt){
                        //1.属于弃牌阶段的弃牌：
                        //2.evt.cards2：lose事件，step 1，只记录，手牌和场上装备区失去的牌（排除判定区，和其他失去）
						if(evt.type=='discard'&&evt.getParent('phaseDiscard')==event) cards.addArray(evt.cards2);
					});
					return cards.length>1;
				}

                /** 当你于弃牌阶段内弃置牌后，时机：player:'loseAfter'(和上面那个差不多) */
                get.isFuzhaSkill_renjie2 = function(event:GameEvent,player:Player){
					if(event.type!='discard'||!event.cards2) return false;
					var evt=event.getParent('phaseDiscard');
					return evt&&evt.name=='phaseDiscard'&&evt.player==player;
                }
                
                /** 当你成为一名其他角色的卡牌惟一目标时，时机：global:'useCard1' */
                get.isFuzhaSkill_xuanzhen = function(event:GameEvent,player:Player){
					if(event.targets.length!=1) return false;
					if(event.player==player) return false;
					if(player!=event.targets[0]) return false;
					for(var i=0;i<lib.inpile.length;i++){
						var info=lib.card[lib.inpile[i]];
						if(info.multitarget) continue;
						if(lib.filter.targetEnabled2({name:lib.inpile[i]},event.player,player)){
							return true;
						}
					}
					return false;
                }
                
                /** 濒死阶段，你可以与一名体力值不超过你的体力上限的角色拼点，时机：enable:'chooseToUse' */
                get.isFuzhaSkill_duhun = function(event:GameEvent,player:Player){
					if(event.type!='dying') return false;//确定当前是在濒死阶段中
					if(player!=event.dying) return false;//濒死的玩家不是自己
					if(player.maxHp<=1) return false;//自身要符合设定
					if(player.countCards('h')==0) return false;//自己又可以拼点的手牌
					return true;
                }
                
                /** 每当一件其他角色的装备因被替换或弃置进入弃牌堆，时机：global:['loseEnd','discardAfter'] */
                get.isFuzhaSkill_xiuhua = function(event:GameEvent,player:Player){
					if(event.player==player) return false;
					if(event.name=='lose'&&event.parent.name!='equip') return false;//必须是失去装备卡
					for(var i=0;i<event.cards.length;i++){
						if(get.type(event.cards[i])=='equip'&&get.position(event.cards[i])=='d'){ //该装备最终位置是弃牌堆
							return true;
						}
					}
                }
                
                /** 攻击范围不含你的角色无法闪避你的杀，时机：player:'shaBegin' */
                get.isFuzhaSkill_jianwu = function(event:GameEvent,player:Player){
					return get.distance(event.target,player,'attack')>1;
                }
                
                /** 每当你于回合外使用、打出或弃置红色牌，时机：player:['useCardAfter','respondAfter','discardAfter'] */
                get.isFuzhaSkill_yuehua = function(event:GameEvent,player:Player){
					if(player==_status.currentPhase) return false; //回合外
					if(event.cards){
						for(var i=0;i<event.cards.length;i++){
							if(get.color(event.cards[i])=='red'&&   //红色牌
							event.cards[i].original!='j') return true;  //非判定牌？我能和时机，机制相关... ...
						}
					}
					return false;
				}

                /** 每当一名敌方角色于回合内使用主动技能，你获得此技能直到下一回合结束； 时机：global:'useSkillAfter' */
                get.isFuzhaSkill_hsxingyi = function(event:GameEvent,player:Player){
					if(lib.filter.skillDisabled(event.skill)) return false;//该技能需要可以获得；
					if(!game.expandSkills(event.player.getStockSkills()).contains(event.skill)) return false;//该技能不能是你当前拥有的技能；
                    return _status.currentPhase==event.player&& //使用技能角色的回合内；
                            event.player.isEnemiesOf(player);   //获得技能是个对敌人负面效果，直接在这里排除？
                }
                
                /** 你的锦囊牌在每回合中造成的首次伤害+1，时机：source:'damageBegin' */
                get.isFuzhaSkill_malymowang = function(event:GameEvent){
                    return event.card&&get.type(event.card)=='trick'&& //是锦囊牌造成的
                            event.parent.name!='_lianhuan'&&event.parent.name!='_lianhuan2'; //不能是“连环”造成的伤害
                }
                
                /** 当你于出牌阶段使用的指定了其他角色为目标的牌结算完成后，时机：player:'useCardAfter' */
                get.isFuzhaSkill_rezhengrong = function(event:GameEvent,player:Player){
					if(!event.targets) return false; //使用卡牌必须有目标；
					if(!event.isPhaseUsing(player)) return false; //需正在出牌阶段中；
					var bool=false;
					for(var i=0;i<event.targets.length;i++){
						if(event.targets[i]!=player){bool=true;break} //指定的目标中，不包括你；
					}
					if(!bool) return false;
                    return player.getAllHistory('useCard',function(evt){ //检索当前回合的记录;
                        //符合出牌阶段，指定其他角色的
						if(!evt.isPhaseUsing(player)) return false;
						for(var i=0;i<evt.targets.length;i++){
							if(evt.targets[i]!=player) return true;
						}
						return false;
					}).indexOf(event)%2==1;
                }
                
                /** 你根据装备区里牌的花色数获得以下技能......，时机：player:['equipEnd','loseEnd'] */
                get.isFuzhaSkill_reqizhou = function(player:Player){
                    if(player.equiping) return false; //装备中... ...，应该是防止装备时，第一个lose事件
                    //计算装备的花色
					var suits=[];
					var es=player.getCards('e');
					for(var i=0;i<es.length;i++){
						suits.add(get.suit(es[i]));
					}
                    if(suits.length>3) suits.length=3;
                    //判断，技能组的数量是否和装备数有差别：
					if(player.additionalSkills.reqizhou){
						return player.additionalSkills.reqizhou.length!=suits.length;
					}
					else{
						return suits.length>0;
					}
                }
                
                /** 类似，诸葛，咆哮这类能一直发动锁定技... ...，时机：player:'useCard1' */
                get.isFuzhaSkill_rw_zhuge_skill = function(event:GameEvent,player:Player){
                    //这种，目的就是为了，某些锁定技可以播放语音，但只播放第一的次语音：
                    return !event.audioed&& //在触发时，主动设置，表示已经播过一次；
                            event.card.name=='sha'&&    
                            player.countUsed('sha',true)>1&& //当前能多次发动
                            event.getParent().type=='phase'; //在出牌阶段... ...   
                }
                
                /** 当你于一回合内使用或打出第一张基本牌时，时机：player:['useCard','respond'] */
                get.isFuzhaSkill_zhiyi = function(event:GameEvent,player:Player){
					if(get.type(event.card)!='basic') return false; //基本牌
					var history=player.getHistory('useCard',function(evt){ //检索本回合的使用卡牌记录；
						return get.type(evt.card)=='basic';
					}).concat(player.getHistory('respond',function(evt){ //检索本回合的响应打出卡牌记录；
						return get.type(evt.card)=='basic';
                    }));
                    //当前回合只有这么一条记录，并且，该记录就是当前触发事件，就是该回合第一张使用，打出的卡牌
					return history.length==1&&history[0]==event;
                }
                
                /** 黑色【杀】和红桃【杀】对你无效。（装备） */
                get.isFuzhaSkill_rw_renwang_skill = function (event:GameEvent,player:Player){
					if(player.hasSkillTag('unequip2')) return false; //强制不触发该技能；
					if(event.player.hasSkillTag('unequip',false,{   //不触发该技能；有限度比上面低一级
						name:event.card?event.card.name:null,
						target:player,
						card:event.card
					})) return false;
					return (event.card.name=='sha'&&(get.suit(event.card)=='heart'||get.color(event.card)=='black'))
				}


                
                //*******************零散判定条件************************
                /** 有某一势力的玩家 */
                get.haveGroupPlayer = function(player:Player,group:string,isSelf?:boolean){
                    return game.hasPlayer(function(current){
                        return (isSelf || current!=player)&&current.group==group;
					});
                }

                /** 要使用牌时，需要有牌（默认为使用的牌） */
                get.haveCard = function(player:Player,scope:string = NG.PositionType.Use){
                    return player.countCards(scope)>0;
                }

                /** 当前使用的是xxx */
                get.isUseCard = function(event:GameEvent,cardNames:string[]){
                    return event.card&&cardNames.contains(event.card.name);
                }

                /** 你使用非转化的普通锦囊牌时 */
                get.isTrickByNormal = function(event:GameEvent){
                    return (get.type(event.card)==NG.StringTypeConst.trick&&event.card.isCard);
                }

                /** xxxx造成伤害时（因技能引起的）,时机：global:'damageAfter' */
                get.isDamageBySkill = function(event:GameEvent,skill:string){
                    return event.getParent(2).skill==skill;
                }

                /** 若你本回合内杀死过角色 */
                get.isKilled = function(player:Player){
					return player.getStat('kill')>0;
                }
                
                /** 你造成或受到伤害，时机：source:'damageEnd',player:'damageEnd' */
                get.isDamegeOtherOrSelf = function(event:GameEvent,player:Player){
                    if(event._notrigger.contains(event.player)) return false; //该伤害事件不能是被取消的；
                    return (event.source!=player&&event.source.isIn())||    //伤害来源不能是自己，且要在场？
                            (event.player!=player&&event.player.isIn());    //受到伤害的不能是自己，且要在场？
                }
                
                /** 本回合，你使用该卡牌，造成x伤害，player:'useCardAfter' */
                get.isUseCardDamagedByPhase = function(event:GameEvent,player:Player){
					// if(event.card.name!='sha'||event.card.nature!='fire') return false;//使用的是火杀....
					var num=0;
					player.getHistory('sourceDamage',function(evt){
						if(evt.card==event.card) num+=evt.num; //即为当前使用的卡牌，因为在useCardAfter（使用卡牌后），event.card即为该使用卡牌
					});//统计你这回合造成的伤害的记录；
					return num>1;
                }
                
                /** 本回合总共获得了x张牌， */
                get.getCardCountByPhase = function(player:Player){
					var num=0;
					player.getHistory('gain',function(evt){
						num+=evt.cards.length;
                    });
                    return num;
                }
                
                /*
                关于getl机制
                由于无名杀没有正规的牌移动事件 因此在新版本中 使用getl机制进行拟合
                例：孙尚香【枭姬】
                ...
                //时机：单纯的“失去牌后”，牌被获得后，牌被人直接插进判定区后，牌被人拿进装备区后
                trigger:{
                player:'loseAfter',
                global:['equipAfter','addJudgeAfter','gainAfter'],
                },
                frequent:true,
                //通过getl函数 获取玩家在事件过程中“失去过”的牌，同时排除因其他事件导致的lose事件 避免二次发动技能
                filter:function(event,player){
                    var evt=event.getl(player);
                    //只有获取的列表存在 并且有失去装备区的牌的记录 才能发动技能
                    return evt&&evt.player==player&&evt.es&&evt.es.length>0;
                },
                */

                return null;
            });
    })();
}