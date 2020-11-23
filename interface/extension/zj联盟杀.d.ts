/** 扩展定义先咱暂时放再这里 */
interface Get {
    /**
     * 检索场上拥有当前模式的指定势力标记
     * @param flag zjsha的势力,没有则返回场上势力数量
     */
    getZJShaShiliCount(flag?: string): number;

    /**
     * 获得当前玩家的势力（联盟杀特供势力）
     * @param player 
     */
    getZJShaShili(player:Player):string;

    /**
     * 获取该按钮所在得面板得内列表得下标
     * @param button 该按钮
     * @param dialog 默认为当前事件处理中得面板
     */
    buttonIndex(button:Button,dialog?:Dialog):number;

    /**
     * 判定时的提示文本
     * @param skill 
     * @param trigger 判定事件（要显示的判定牌，玩家信息都在这里）
     */
    judegeTipPrompt(skill:string,trigger:GameEvent):string;

    /**
     * 可以额外增加一个对卡牌类型判定的，卡牌是否响应打出的方法，多用于响应技能发动时
     * @param exCard 
     */
    cardEnableRespondableFilter(exCard?: TwoParmFun<Card, Player, boolean> | CardBaseUIData): TwoParmFun<Card, Player, boolean>;
}

interface Is {
    /**
     * 判断角色是ZJ联盟杀
     * @param name 
     */
    characterByZJSha(name:string):boolean;
}

declare namespace Lib.element {
    interface Content {
        chooseToRespondByAll(...args):void;
        replaceJudge():void;
        recast():void;
        swapJudge():void;
        removeMingzhiCard():void;
    }

    interface Player {
        /**
         * 让所有玩家响应
         * @param parames 
         */
        chooseToRespondByAll(parames: {
            /** 过滤玩家 */
            filterPlayer?: (player: Player) => boolean,
            /** 是否继续轮询 */
            isContinue?: boolean,
            /** 响应提示 */
            prompt?: string | FourParmFun<GameEvent, Trigger, Player, Current, string>,
            // respondFunParms?: any[],
            /** 响应方法 */
            respondFun?: (event: GameEvent, trigger: GameEvent, player: Player, current: Player,prompt:string, ..._args) => void,
            /** 响应的结果 */
            resultFun?:(result:BaseResultData, player: Player, current: Player) => boolean;
            /** 响应结果返回（这里决定是否执行respondResultFun）  */
            respondResultFun?: (event: GameEvent, trigger: GameEvent, result:BaseResultData, player: Player, current: Player) => void,
            /** 引起当前循环响应的事件，默认为之前事件的父事件的触发 */
            sourceTrigger?:GameEvent,
        }): GameEvent;

        /**
         * 使用一张牌替代判定
         * @param params 
         */
        replaceJudge(params:ReplaceJudgeParams):GameEvent;
        replaceJudge(...args):GameEvent;
        /** 改变判定（目前只作为触发事件用，并无实际作用） */
        changeJudge(card:Card,trigger?:GameEvent):GameEvent;

        /**
         * 将牌放回牌堆：
         * @param cards 要放回的牌
         * @param isBottom 是否放回到牌堆底下，默认牌堆顶
         */
        putCardsToCardPile(cards:Card|Card[],isBottom?:boolean):Player;

        /**
         * "重铸"行为，非原逻辑的"_chongzhu"
         * 
         * 参数列表：
         *  itemtype为“player”：设置next.source，默认是自己，暂时无用;
         *  itemtype为“card”/“cards”：设置next.cards，重铸的牌；
         *  boolean类型：设置next.animate，取值不是false，则播放丢弃动画“$throw”；
         *  objtype为“div”：设置next.position，设置重铸的牌失去到指定目标地方，默认弃牌堆；
         * @param args 
         */
        recast(...args):GameEvent;

        /**
         * 交换的判定区的牌
         * @param target 
         */
        swapJudge(target:Target):GameEvent;

        /**
         * 当前失去的体力值
         */
        curLoseHp():number;

        //明置相关
        /**
         * 明置手牌
         * @param cards 
         * @param str 默认显示“明置了xxxxx牌”
         */
        mingzhiCard(cards:Card|Card[],str?:string):GameEvent;
        /**
         * 选择明置手牌
         * 
         * 主要设置choosePlayerCard的参数：
         *  itemtype为“player”：设置next.target，默认是自己;
         *  number类型/itemtype为"select"类型：设置next.selectButton；
         *  boolean类型的参数：设置next.forced；
         *  string类型：对应next.prompt/str，第一个字符串用于choosePlayerCard显示内容，第二个字符串时用来给mingzhiCard显示内容;
         * 
         * 注：过滤条件，默认并接了过滤非明置的手牌；
         * @param args 
         */
        chooseMingzhiCard(...args):GameEvent;
        /**
         * 移除明置的手牌
         * @param cards 移除的卡牌
         */
        removeMingzhiCard(cards:Card|Card[]):GameEvent;
        /**
         * 选择移除明置手牌
         * 
         * 主要设置choosePlayerCard的参数：
         *  itemtype为“player”：设置next.target，默认是自己;
         *  number类型/itemtype为"select"类型：设置next.selectButton；
         *  boolean类型的参数：设置next.forced；
         *  function类型：对应next.filterCard，若没有，默认是已经明置的手牌;
         *  itemtype为object类型：对应next.filterCard，使用get.filter将对象内容设置为过滤条件；
         *  string类型：对应next.prompt；
         * 
         * 注：过滤条件，默认并接了过滤明置的手牌；
         * @param args 
         */
        chooseRemoveMingzhiCard(...args):GameEvent;

        /** 获取玩家的明置牌 */
        getMingzhiCard():Card[];

        //简化处理武将牌上的牌的操作(注意，明牌的标记操做，另有一套流程)
        /**
         * 添加标记，并可自动将牌失去到武将牌上（special）
         * @param name 标记名
         * @param datas 主要是card数组，只有是card数组，才会触发lose
         * @param noToSpecial 是否不触发失去牌到武将牌下（取值false，不触发）
         * @param nolog 是否显示日志（取值false，不显示）
         */
        markAutoBySpecial(name:string,datas:any[],noToSpecial?:boolean,nolog?:boolean):void;
        /**
         * 删除标记，并可自动将武将牌上的牌（失去/弃置/.....）
         * @param name 标记名
         * @param datas 主要是card数组，不是card数组直接走unmarkAuto
         * @param onLose 特殊失去，失去的目标地为：h手牌，o处理区，其他弃牌堆
         * @param nolog 是否显示日志（取值false，不显示）
         */
        unmarkAutoBySpecial(name:string,datas:any[],onLose?:string,nolog?:boolean):void;
    }
}

declare namespace Lib {
    interface Filter {
        /**
         * 卡牌是否响应打出（包括技能的响应）
         * @param card 
         * @param player 
         */
        cardEnableRespondable(card: Card, player: Player):boolean;

        /**
         * 可以额外增加一个对卡牌类型判定:卡牌是否响应打出的方法，多用于响应技能发动时
         */
        cardEnableRespondableFilter(exCard?:TwoParmFun<Card,Player,boolean>|CardBaseUIData):TwoParmFun<Card,Player,boolean>;

        /**
         * 是否有“无视防具”效果的技能标签
         * @param event 
         * @param player 
         * @param isNotUnequip2 是否不判断"unequip2"
         */
        unequip(event:GameEvent,player:Player,isNotUnequip2:boolean):boolean;

        /**
         * 目标不是自己
         * @param player 
         * @param target 
         */
        isNotSelf(player:Player,target:Player):boolean;

        /**
         * 是否为明置卡牌
         * 
         * 返回true则为明置，返回false则为非明置
         * @param player 
         * @param card 
         */
        filterMingzhiCard(player:Player,card:Card):boolean;

        /**
         * 判断当前武将是否不能使用（增加排除zjsha以外）
         * 该方法有 双将情况下的禁用
         * @param i 武将名
         * @param libCharacter 
         */
        characterDisabledByZJSha(i: string, libCharacter?: any): boolean;
        /**
         * 判断当前武将是否不能使用2（增加排除zjsha以外）
         * 该方法，有额外：boss，hiddenboss，minskin，lib.characterFilter判定
         * @param i 武将名
         */
        characterDisabledByZJSha2(i: string): boolean;
    }
}

declare namespace Lib {
    /** 条件包装工具 */
    interface FunctionUtil {
        /**
         * 返回制定类型的一个条件
         * @param type 条件的类型
         * @param condis 条件
         */
        getConditon(type: NG.ConditionType, condis: NG.ConditionFun[]): NG.ConditionFun;

        /**
         * 嵌套条件实现:创建一个复杂的条件树
         * @param datas 
         */
        createConditionTree(datas: NG.BaseConditionNode):NG.ConditionFun;
    }
}

interface Lib {
    /** 条件包装工具 */
    functionUtil:Lib.FunctionUtil;
}

interface ReplaceJudgeParams {
    /** 被替换判定牌的目标，暂时没用，默认当前触发中的事件的玩家 */
    source?:Player,
    /** 显示自己要操作的提示，默认当前触发事件的技能的描述 */
    prompt?:string,
    //额外扩展参数：choosebutton,扩展list...
    /** 主动设置判定事件，默认使用当前事件的触发的判定事件（因为调用改判的方法的时机都是“judge”事件），若不是请主动设置 */
    jTrigger?:GameEvent,
    /** 
     * 选择行为的类型:默认不填，
     * “card”：用一张牌改判；
     * “cards”：从一系列牌中选择一张改判；
     * “exchange”：自己某一区域的牌替代改判；
     * 默认行为“replace”：自己某一区域的牌代替改判；
     */
    chooseType?:string,
    //用于默认的chooseType类型的相关参数：
    /** 选择的区域：默认使用的牌 */
    position?:string,
    /** 不填默认lib.filter.cardEnableRespondable */
    filterCard?:TwoParmFun<Card,Player,boolean>,
    /** 可默认使用lib.filter.cardEnableRespondable+该类型过滤 */
    filterCardObj?:CardBaseUIData,
    /** 用于判定的牌，默认对应行为的类型为：“card” ，使用该牌改判*/
    card?:Card,
    /** 用于判定的牌，默认对应行为的类型为：“cards” ，从中选一张牌改判*/
    cards?:Card[],
    /** 
     * 对应行为的类型为：“cards” ，过滤用方法，若不设置则默认使用lib.filter.cardEnableRespondable，
     * 一般都会提前过滤好，再传cards进去，所以可以不需要
     */
    filterButton?:TwoParmFun<Button,Player,boolean>,
    /**
     * exchange:交换判定牌（替代）
     */
    exchange?:boolean;
}

//player\..*?=   查看player方法  