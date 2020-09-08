//@ts-nocheck
module ZJNGEx {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "标记优化扩展", NG.ImportFumType.run,

            function (lib: Lib, game: Game, ui: UI, get: Get, ai: AI, _status: Status) {

                //自动添加标记，同时也会自动添加到武将牌下（ui.special）
                lib.element.player.markAutoBySpecial = function (name: string, datas: any[], noToSpecial?: boolean, nolog?: boolean) {
                    if (get.itemtype(datas) == NG.ItemType.CARDS && noToSpecial !== false) {
                        let areaList = [];
                        let orderingList = [];
                        let specialList = [];
                        for (let i = 0; i < datas.length; i++) {
                            const element = datas[i];
                            let type = get.position(element, true);
                            switch (type) {
                                case NG.PositionType.Handcard:
                                case NG.PositionType.Judge:
                                case NG.PositionType.Equip:
                                    //场上的卡牌
                                    areaList.push(element);
                                    break;
                                case NG.PositionType.Ordering:
                                    //处理区
                                    orderingList.push(element);
                                    break;
                                default:
                                    //牌堆，弃牌，场外区，不存在区域
                                    specialList.push(element);
                                    break;
                            }
                        }
                        if (areaList.length) {
                            this.lose(areaList, ui.special, NG.StringTypeConst.visible, NG.StringTypeConst.toStorage);
                        }
                        if (orderingList.length) {
                            //使用该方法都是触发的技能，
                            let evt = _status.event._trigger || _status.event.getParent();
                            if (evt && evt.orderingCards) {
                                evt.orderingCards.removeArray(orderingList);
                            }
                            game.cardsGotoSpecial(orderingList);
                            // game.broadcastAll(function(cards){
                            // },orderingList);
                        }
                        if (specialList.length) {
                            game.cardsGotoSpecial(specialList);
                            // game.broadcastAll(function(cards){
                            // },specialList);
                        }
                    }
                    if (nolog !== false) {
                        var str = false;
                        var info = get.info(name);
                        if (info && info.marktext) str = info.marktext;
                        else if (info && info.intro && (info.intro.name || info.intro.name2)) str = info.intro.name2 || info.intro.name;
                        else str = lib.translate[name];
                        if (str) game.log(this, '将', datas, '置于武将牌下,获得了', '#g【' + str + '】');
                    }
                    this.$gain2(datas);
                    this.markAuto(name, datas);
                    this.syncStorage(name);
                    //手动刷新标记，不知为何syncStorage失效了【添加貌似没事】
                    // game.broadcast(function(player,storage,skill){
                    //     player.storage[skill]=storage;
                    //     player.updateMarks();
                    // },this,this.storage[name],name);
                }
                //自动移除标记，移除武将牌下的牌丢弃
                lib.element.player.unmarkAutoBySpecial = function (name: string, datas: any[], onLose?: string, nolog?: boolean) {
                    var storage = this.getStorage(name);
                    if (get.itemtype(datas) == NG.ItemType.CARDS && Array.isArray(storage)) {
                        let _datas = datas.slice(0);//必须操作属于当前标记的牌
                        for (let i = _datas.length - 1; i >= 0; i--) {
                            if (!storage.contains(_datas[i])) _datas.splice(i, 1);
                        }
                        var info = lib.skill[name];
                        if (info && info.intro && info.intro.onunmark && !onLose) { //技能有配置的话，优先技能的操作
                            if (info.intro.onunmark == 'throw') {
                                this.$throw(_datas, 1000);
                                game.cardsDiscard(_datas);
                                if (nolog !== false) game.log('置于武将牌下的', _datas, '，进入了弃牌堆');
                                // this.storage[name].removeArray(_datas);
                            }
                            else if (typeof info.intro.onunmark == 'function') { //自定义操作（需要直接获得在这里操作，注意isLose不是true）
                                info.intro.onunmark(_datas, this); //只处理弃置的牌
                            }
                        } else if (onLose) {
                            switch (onLose) {
                                case NG.PositionType.Handcard://玩家获得到手上
                                    this.gain(_datas, NG.StringTypeConst.fromStorage, this, NG.StringTypeConst.bySelf, NG.AniNmaeConst.gain2);
                                    break;
                                case NG.PositionType.Ordering:
                                    let evt = _status.event._trigger || _status.event.getParent();//不确定，一般主动使用去除标记，都是在触发技能中
                                    // if(evt && evt.orderingCards) {
                                    //     evt.orderingCards.addArray(orderingList);
                                    // }
                                    this.$throw(_datas, 1000);
                                    game.cardsGotoOrdering(_datas).relatedEvent = evt;
                                    if (nolog !== false) game.log('置于武将牌下的', _datas, '，进入了处理区');
                                    break;
                                case NG.PositionType.CardPlie://日后考虑扩展到牌堆
                                default:
                                    this.$throw(_datas, 1000);
                                    if (nolog !== false) game.log('置于武将牌下的', _datas, '，进入了弃牌堆');
                                    game.cardsDiscard(_datas);
                                    break;
                            }
                        }
                        else { //默认失去到弃牌堆中
                            this.$throw(_datas, 1000);
                            // if(onLose) {
                            //     if(nolog!==false) game.log('失去置于武将牌下的',_datas,'，进入了弃牌堆');
                            //     //lose处理不了hej以外的区域
                            //     this.lose(areaList,NG.StringTypeConst.visible);//默认失去到弃牌堆中
                            // } else {
                            //     game.log('置于武将牌下的',_datas,'，进入了弃牌堆');
                            //     if(nolog!==false) game.cardsDiscard(_datas);
                            // }
                            if (nolog !== false) game.log('置于武将牌下的', _datas, '，进入了弃牌堆');
                            game.cardsDiscard(_datas);
                        }
                        //移除，同步标记
                        // this.storage[name].removeArray(_datas);
                        // console.log("game.broadcast--update==>",name,datas,_datas);
                        //手动刷新标记，不知为何syncStorage失效了
                        // this.unmarkAuto(name,_datas);
                        // game.broadcast(function(player,storage,skill){
                        //     // console.log("game.broadcast==>",player,storage,skill);
                        //     let _player:Player = get.parsedResult(player);
                        //     let _storage:SMap<any> = get.parsedResult(storage);
                        //     _player.storage[skill]=_storage;
                        //     _player.updateMarks();
                        // },get.stringifiedResult(this),get.stringifiedResult(this.storage[name]),name);

                        // else if(event.isMine()){
                        //     func(this,storage,name);
                        // }
                        // this.markAuto(name);
                        // this.syncStorage(name);//缺少storage的同步 问题：如果清空标记的情况好像有问题

                        this.unmarkAuto(name, _datas);
                        // game.broadcast(function(player,storage,skill){
                        //     // console.log("unmarkAutoBySpecial--broadcast==>",player,storage,skill);
                        //     player.storage[skill]=storage;
                        //     player.markAuto(skill);
                        // },this,this.storage[name],name);
                        // this.updateMarks(name);
                        // console.log("unmarkAutoBySpecial--start==>",this,this.storage[name],name,game.me.storage);
                        // this.send(function(player,storage,skill){
                        //     console.log("unmarkAutoBySpecial--send==>",player,storage,skill);
                        //     player.storage[skill]=storage;
                        //     player.markAuto(skill);
                        // },this,this.storage[name],name,"test:unmarkAutoBySpecial");

                        // if(this.isOnline2()){
                        // } 
                        // else if(this == game.me) {
                        // }
                    } else {
                        // console.log("game.broadcast--update2==>",name,datas);
                        this.unmarkAuto(name, datas);
                    }
                }


                //【v1.9.102】主代码，已经修复了该bug，屏蔽该方法的覆盖；
                //修改一下更新标记的方式
                //todo:因为使用updateMark,更新标记时，只有没标记时才会使用markSkill，有标记更新没有进行同步，
                //所以，采用更通用的同步刷新标记的方法markSkill，不过标记更新是个挺大的系统，不知会有什么影响，期待后续更新；
                // lib.element.player.addMark = function (i, num, log) {
                //     if (typeof num != 'number' || !num) num = 1;
                //     if (typeof this.storage[i] != 'number') this.storage[i] = 0;
                //     this.storage[i] += num;
                //     if (log !== false) {
                //         var str = false;
                //         var info = get.info(i);
                //         if (info && info.intro && (info.intro.name || info.intro.name2)) str = info.intro.name2 || info.intro.name;
                //         else str = lib.translate[i];
                //         if (str) game.log(this, '获得了', get.cnNumber(num), '个', '#g【' + str + '】');
                //     }
                //     this.syncStorage(i);
                //     // this.updateMark(i);
                //     this.markSkill(i);
                // };

                return null;
            });
    })();
}