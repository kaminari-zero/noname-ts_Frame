module ZJNGEx {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "个人get方法扩展", NG.ImportFumType.run,

            function (lib: Lib, game: Game, ui: UI, get: Get, ai: AI, _status: Status) {
                /** 检索场上拥有当前模式的指定势力标记 */
                get.getZJShaShiliCount = function (flag: string) {
                    let countArray: string[] = [];
                    let count = game.countPlayer(function (current) {
                        let info = get.character(current.name) as HeroData;
                        if (info && info[HeroDataFields.exInfo].indexOf(ZJNGEx.ZJShaGameConst.ZJShaFlag) > -1) {
                            let _info = info[HeroDataFields.zjshaInfo];
                            if (_info) {
                                if (flag) {
                                    if (_info[0] == flag) {
                                        return true;
                                    }
                                } else { //没有则统计势力数
                                    if (!countArray.contains(_info[0])) {
                                        countArray.push(_info[0]);
                                        return true;
                                    }
                                }
                                // return true;
                            }
                        }
                    });
                    return count;
                }

                //获得当前玩家
                get.getZJShaShili = function (player: Player) {
                    let info = get.character(player.name) as HeroData;
                    if (info && info[HeroDataFields.exInfo].indexOf(ZJNGEx.ZJShaGameConst.ZJShaFlag) > -1) {
                        return info[HeroDataFields.zjshaInfo] ? info[HeroDataFields.zjshaInfo][0] : "";
                    }
                    return "";
                }

                //获得当前处理中得按钮得下标
                get.buttonIndex = function (button: Button, dialog?: Dialog) {
                    if (!dialog) dialog = _status.event.dialog;
                    let buttons = dialog ? dialog.buttons : [];
                    return buttons.indexOf(button);
                }

                //可以额外增加一个对卡牌类型判定的，卡牌是否响应打出的方法，多用于响应技能发动时
                get.cardEnableRespondableFilter = function (exCard?: TwoParmFun<Card, Player, boolean> | CardBaseUIData): TwoParmFun<Card, Player, boolean> {
                    let _exCard;
                    if (typeof exCard == "function") {
                    } else if (get.objtype(exCard) == NG.ObjType.Object) {
                        _exCard = get.filter(exCard);
                    } else {
                        _exCard = exCard;
                    }
                    let conditionFuns = [lib.filter.cardEnableRespondable];
                    if (_exCard) conditionFuns.push(_exCard);

                    return lib.functionUtil.getConditon(NG.ConditionType.or, conditionFuns);
                }

                //判定时的提示文本（封装改判）
                // get.judegeTipPrompt = function(str:string,trigger:GameEvent) {
                //     if(lib.skill[str]) { 
                //         str = get.prompt(str);
                //     }
                //     return `${get.translation(trigger.player)}的${(trigger.judgestr || '')}的判定为${get.translation(trigger.player.judging[0])},${str}`;
                // }

                //重写getCards方法，增加获取“s”区域,"o"区域的牌
                // lib.element.player.getCards = function(arg1,arg2){
                //     if(typeof arg1!='string'){
                //         arg1='h';
                //     }
                //     var cards=[],cards1=[];
                //     var i,j;
                //     for(i=0;i<arg1.length;i++){
                //         if(arg1[i]=='h'){
                //             for(j=0;j<this.node.handcards1.childElementCount;j++){
                //                 if(!this.node.handcards1.childNodes[j].classList.contains('removing')){
                //                     cards.push(this.node.handcards1.childNodes[j]);
                //                 }
                //             }
                //             for(j=0;j<this.node.handcards2.childElementCount;j++){
                //                 if(!this.node.handcards2.childNodes[j].classList.contains('removing')){
                //                     cards.push(this.node.handcards2.childNodes[j]);
                //                 }
                //             }
                //         }
                //         else if(arg1[i]=='e'){
                //             for(j=0;j<this.node.equips.childElementCount;j++){
                //                 if(!this.node.equips.childNodes[j].classList.contains('removing')&&!this.node.equips.childNodes[j].classList.contains('feichu')){
                //                     cards.push(this.node.equips.childNodes[j]);
                //                 }
                //             }
                //         }
                //         else if(arg1[i]=='j'){
                //             for(j=0;j<this.node.judges.childElementCount;j++){
                //                 if(!this.node.judges.childNodes[j].classList.contains('removing')&&!this.node.judges.childNodes[j].classList.contains('feichu')){
                //                     cards.push(this.node.judges.childNodes[j]);
                //                     if(this.node.judges.childNodes[j].viewAs&&arguments.length>1){
                //                         this.node.judges.childNodes[j].tempJudge=this.node.judges.childNodes[j].name;
                //                         this.node.judges.childNodes[j].name=this.node.judges.childNodes[j].viewAs;
                //                         cards1.push(this.node.judges.childNodes[j]);
                //                     }
                //                 }
                //             }
                //         }
                //         else if(arg1[i]=='s'){
                //             for(j=0;j<this.node.special.childElementCount;j++){
                //                 if(!this.node.special.childNodes[j].classList.contains('removing')){
                //                     //后续必须使用条件过滤开来
                //                     cards.push(this.node.special.childNodes[j]);
                //                 }
                //             }
                //         }
                //         else if(arg1[i]=='o'){
                //             for(j=0;j<this.node.ordering.childElementCount;j++){
                //                 if(!this.node.ordering.childNodes[j].classList.contains('removing')){
                //                     //后续必须使用条件过滤开来
                //                     cards.push(this.node.ordering.childNodes[j]);
                //                 }
                //             }
                //         }
                //     }
                //     if(arguments.length==1){
                //         return cards;
                //     }
                //     if(arg2){
                //         if(typeof arg2=='string'){
                //             for(i=0;i<cards.length;i++){
                //                 if(get.name(cards[i])!=arg2){
                //                     cards.splice(i,1);i--;
                //                 }
                //             }
                //         }
                //         else if(typeof arg2=='object'){
                //             for(i=0;i<cards.length;i++){
                //                 for(j in arg2){
                //                     var value;
                //                     if(j=='type'||j=='subtype'||j=='color'||j=='suit'||j=='number'){
                //                         value=get[j](cards[i]);
                //                     }
                //                     else{
                //                         value=cards[i][j];
                //                     }
                //                     if((typeof arg2[j]=='string'&&value!=arg2[j])||
                //                         (Array.isArray(arg2[j])&&!arg2[j].contains(value))){
                //                         cards.splice(i--,1);break;
                //                     }
                //                 }
                //             }
                //         }
                //         else if(typeof arg2=='function'){
                //             for(i=0;i<cards.length;i++){
                //                 if(!arg2(cards[i],this)){
                //                     cards.splice(i--,1);
                //                 }
                //             }
                //         }
                //     }
                //     for(i=0;i<cards1.length;i++){
                //         if(cards1[i].tempJudge){
                //             cards1[i].name=cards1[i].tempJudge;
                //             delete cards1[i].tempJudge;
                //         }
                //     }
                //     return cards;
                // }

                //扩展技能翻译的显示：
                //todo：暂时不需要，可使用prompt2来自定义二级显示；
                // let temptranslation = get.translation;
                // get.translation=function(...args){
                //     let result:string = get.translation.source.apply(this,args);
                //     //扩展特殊的标记翻译
                //     if(result.indexOf("#zhu")>-1) {
                //         result = result.replace("#zhu",`<span class=bluetext>【${get.translation(game.zhu)}】</span>`);
                //     }
                //     return result;
                // }
                // get.translation.source = temptranslation;

                // let tempskillInfoTranslation = get.skillInfoTranslation;
                // get.skillInfoTranslation=function(...args){
                //     let result:string = get.skillInfoTranslation.source.apply(this,args);
                //     result = get.translation(result);
                //     return result;
                // }
                // get.skillInfoTranslation.source = tempskillInfoTranslation;

                return null;
            });
    })();
}