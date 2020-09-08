declare namespace Lib.element {
    /**
     * 游戏事件
     */
    interface Event {
        /**
         * 完成事件。
         * 设置finished为true
         */
        finish(): void;
        /**
         * 取消事件执行，结束事件。
         * 执行untrigger清除掉指定触发,触发“当前事件名Cancelled”阶段
         * @param all 是否取消所有触发
         * @param player 是否取消某一特定玩家的触发,并且把该玩家添加event._notrigger中
         * @param notrigger 是否不进行“xxx_Cancelled”的触发，不添加到"skipped"记录跳过阶段
         */
        cancel(all?: boolean, player?: Player,notrigger?:string): void;
        /**
         * 指定跳转到某一步骤
         * @param step 
         */
        goto(step: number): void;
        /** 
         * 回退到上一步骤（可产生类似循环执行效果）
         * 
         * 实质就是重复执行当前步骤；
         */
        redo(): void;
        /**
         * 设置一个key到event里，用于保存，传递数据
         * 设置进event的值，还会另外保存在_set集合中，用于缓存，set的数据（有可能也用于标记）
         * @param key 若key不为字符串，且只有一个参数时，则执行批量set，即[[key,value],[key,value]....]
         * @param value 
         */
        set(key: string | [string, any][], value?: any): Event;
        /**
         * 设置content（核心）
         * @param name 如果是方法类型，则使用lib.init.parse转成指定结构方法；如果是字符串，则是使用lib.element.content预定义好的content
         */
        setContent(name: Function|string): Event;
        /**
         * 获取事件的logvid。
         * 注：获取3代内的logvid，若3代内没有，则返回null。
         */
        getLogv(): string;

        /** 
         * 【联机】【核心】发送当前事件处理中的技能的信息 
         * 
         * 联机模式时，有时会发现有些设置的在事件上的参数无法使用，原因可能就是这里，
         * 有些参数没有设置到_args，_set，需要自己手动设置；
         */
        send(): void;

        /**
         * 重置事件。
         * 
         * 主要是删除_cardChoice，_targetChoice，_skillChoice，重新再进行选择。
         */
        resume(): void;
        /**
         * 获取该事件的父节点。
         * 默认获取上一个父节点（核心）。
         * @param level 获取的父节点的深度（number），或者指定名字父节点（string，最多可以查找20代内）
         * @param forced 是否强制其获取不到父节点，返回null（不知有什么意义）
         */
        getParent(level?: number|string, forced?: boolean): Event;
        /**
         * 获取该事件的触发者。
         * 返回父节点的_trigger。
         */
        getTrigger(): Event;
        /**
         * 获取一个随机数（隶属于该事件中）
         * 注：若没有，则生成一个保存在_rand中（即当前事件获取一次随机数，需要保存下来）
         */
        getRand(): number;

        /** 创建一个当前事件的途中的插入事件（意义貌似不是很大） */
        insert(func: string|ContentFunc, map: SMap<any>): Event;
        /** 创建一个当前事件的after队列的事件，将其添加到当前事件的after队列 */
        insertAfter(func: string | ContentFunc, map: SMap<any>): Event;

        /**
         * 备份该事件的skill信息到_backup。
         * 注：删除已选择对象。
         * 
         * 使用：ui.click.ok,触发技能的info.chooseButton
         * 
         * 实质：在调用skill技能时，重置当前事件的所有filter，seleted，forced......等等一系列条件参数为技能的对应字段，
         * 之前的缓存起来，这部分流程后面还是要继续研究下；
         * 应该是为了使用skill配置的通用过滤字段，即在技能触发之前的；
         * @param skill 
         */
        backup(skill: string): void;
        /**
         * 回复备份数据_backup。
         * 
         * 应该是为了使用skill配置的通用过滤字段，即在技能触发之前的；
         * 在确认ok/取消cancel时，将清除当前事件中skill，ignoreMod，filterCard2，
         * 将当前事件的原条件参数设置回去；
         */
        restore(): void;
        /**
         * 判断当前event.player是不是自己，
         * 并且当前不处与自动状态中（托管）
         * 并且当前不处于isMad混乱状态（应该是某些模式，卡牌特有的效果）
         */
        isMine(): boolean;
        /**
         * 当前是否是联机中(联机模式)
         */
        isOnline(): boolean;
        /**
         * 判断当前事件（父节点）没有“_lianhuan”（连环）
         */
        notLink(): boolean;

        /**
         * 添加技能触发
         * @param skill 
         * @param player 
         */
        addTrigger(skill: string|string[], player: any): void;
        /**
         * 触发阶段，筛选阶段触发的技能。
         * 创建“arrangeTrigger”排列触发事件。
         * @param name 
         */
        trigger(name: string): void;
        /**
         * 删除某个阶段触发
         * @param all 是否取消所有触发
         * @param player 是否取消某一特定玩家的触发,并且把该玩家添加event._notrigger中
         */
        untrigger(all?: boolean, player?: Player): void;


        //【1.9.98.3】版本
        /** 
         * 摸牌阶段「取消摸牌」:
         * 将数量变化变成0；
         * 
         * （理论上也可用于其他数值相关的事件）
         * 
         * 避免使用event.cancel导致后面的摸牌阶段结束时等时机直接无法生成的方案；
         */
        changeToZero():void;
    }

    //event的属性，不过大部分都是动态获取的
    export interface Event extends CheckEventResultData {
        //核心部分：
        /** 事件名 */
        name:string;
        /** 是否完成事件，一般通过event.finish()结束事件 */
        finished:boolean;
        /** 事件准备即将执行的事件队列 */
        next:Event[];
        /** 事件完成后准备执行的事件队列 */
        after:Event[];
        /**
         * 触发阶段数：
         * 在事件已finished中：
         * 忽略Omitted：1
         * 后End：2，
         * 结束后After：3，
         * 
         * 非finished：
         * 开始前Before：0，
         * 时Begin：1，
         * 运行中：2
         */
        _triggered:number;
        /** 记录当前运行的步骤数 */
        step:number;

        //由于事件用于保存各种数据，在loop循环中传递，其各个属性，实质记录对象的意义都不大一样
        //而且，由于主要是用于携带数据，因此，有许多数据都记录不了，只能具体看源码找出来了
        /** 事件触发的玩家 */
        player:Player;
        /** 当前事件的源触发事件 */
        _trigger:Event;
        /** 
         * 源触发事件的时机名字
         * （和直接用于判断源触发事件的时机，一般和“触发事件+时机”，或者，直接“触发时机名”，一般和事件名不一致，
         * 通过game.createTrigger设置）
         */
        triggername:string;

        //结果，是记录事件执行过程中产生的某些结果记录，这些结果，需要回馈给父节点事件的，是过程中产生的信息
        //事件的结果，为什么分成两种，后期继续观察代码考究
        result:any;
        /** 该参数应该时事件记录结果的核心返回值，上面那个，暂待观察 */
        _result:BaseResultData;

        //这些记录的基本都是事件自身带有的信息（例如你当前属于某个阶段的触发事件，此时你携带的触发信息）
        //因此，如果该事件是属于某事件的子事件，即next，after中的队列事件，此时，身为主触发会附带在_trigger中
        //表示：因为触发该事件，而产生了next中的操作，其触发源为_trigger
        /** 记录触发源玩家 */
        source:Player;
        /** 记录指定的目标玩家 */
        target:Player;
        /** 记录多个指定的目标玩家 */
        targets:Player[];
        /** 记录牌(当前指当前使用的牌:真实牌/视为牌) */
        card:Card;
        /** 记录多张牌 */
        cards:Card[];
        /** 记录需要处理的skill技能 */
        skill:string;
        /** 是否强制性，自动标记 */
        forced:boolean;
        /** 记录一个number类型的数字，每个事件代表都不一样 */
        num:number;

        /** 判定相关结果 */
        judgeResult:JudgeResultData;

        /** 当前事件处理中的卡牌（即"处理区"，后面尽量按照规则来，效果处理中的牌在处理区中处理） */
        orderingCards:Card[];

        /** 是否强制结束出牌阶段，同时也可以让result.bool为false跳过 */
        skipped:boolean;

        /** 一些额外操作，目前看到最常用在game.check中 */
        custom:{
            // add:SMap<any>,
            // replace:SMap<any>
            /** 
             * 作为game.check,ui.click.xxxx系列的取代处理方法，当前事件设置了该系列的方法，
             * 在点击对应的目标时，会直接走这个处理，忽略原来的选中操作逻辑 
             */
            replace:{
                card:OneParmFun<Card,void>;
                target:TwoParmFun<Target,UIEvent,void>;
                button:OneParmFun<Button,void>;
                confirm:OneParmFun<boolean,void>
            },
            /**
             * 作为game.check,ui.click.xxxx系列的点击后处理方法，是为点击对应目标，改变状态之后，额外增加的处理
             */
            add:{
                card:NoneParmFum<void>;
                target:NoneParmFum<void>;
                button:NoneParmFum<void>;
                confirm:OneParmFun<boolean,void>
            }
        }
        
        _aiexclude:any;
        fakeforce:any;
        
        /** 选中的卡牌 */
        _cardChoice:Card[];
        /** 选中的目标 */
        _targetChoice:Player[];
        /** 选中的技能 */
        _skillChoice:string[];

        /** ai,不同事件，其传入的参数都不一样 */
        ai?:AICheckFun;

        //【1.9.98】在lose事件里 可以直接通过event.hs/es/js 来判断一张卡牌在此次失去事件中原先所处的区域
        /** 手牌区失去的牌 */
        hs:Card[];
        /** 装备区失去的牌 */
        es:Card[];
        /** 判定区失去的牌 */
        js:Card[];

        /** 这是gain事件中 如果获得其他角色的卡牌时，其他角色失去卡牌的事件(只在gain事件链中使用) */
        relatedLose:GameEvent;

        /** 判定的名字 ,在judge事件中，记录了判定的名字*/
        judgestr:string;

        //【v1.9.98.3】
        /** 判断一个出牌阶段「有没有被放弃摸牌」 */
        numFixed:boolean;

        //2020-2-23版本：
        /** 
         * 为技能配置一个自定义在事件中处理的回调事件，该事件的使用需要自己使用，实际是一个自定义事件，没什么实际意义；
         * 其设置的位置在技能content期间设置，设置在期间引发的事件中；
         * 用于以下场合：judge，chooseToCompareMultiple，chooseToCompare
         * 
         * 新版本的judge事件中 可以通过设置callback事件 在judgeEnd和judgeAfter时机之前对判定牌进行操作
         * 在判断结果出来后，若事件event.callback存在，则发送“judgeCallback”事件
         * 
         * 同理拼点,在拼点结果出来后，发送“compareMultiple”事件（“compare”暂时没有）
         * 
         * callback就是作为以上事件的content使用
         */
        callback:ContentFunc;

        /** 
         * 导致失去牌到处理区（o）的事件
         * 
         * 使用范围：
         * 在lose事件中，设置失去区域到ui.ordering，会设置当前lose事件的父事件，即引起当前lose的事件；
         * 
         * 在执行game.cardsGotoOrdering事件，可以追加设置，不设置，则默认为触发该事件的事件；
         */
        relatedEvent:GameEvent;

        //【扩展事件用参数】
        /** 响应的信息，目前主要在“sha”中触发，在shaMiss时设置响应的数据，不过“sha”是游戏核心环节，所以用得还是比较多，可以主动设置true，表示已经响应了，暂时还没了解 */
        responded:BaseCommonResultData;//|boolean
        /** 技能可以指定多个目标（此时，有event.targets） */
        multitarget:boolean;

        /** 
         * 基础伤害，最初是在userCard事件中，从卡牌配置的信息获得，作为某张卡牌造成的伤害数值在事件中传递 
         * 
         * 注：应该是基础的效果值，“tao”的基础回复值，也是它；
         */
        baseDamage:number;
        //【sha】相关使用属性：
        /** 当前【sha】造成的额外伤害（+x） */
        extraDamage:number;
        /** 当前【sha】需要多少闪响应 */
        shanRequired:number;
        /** 当前【sha】命中，造成伤害，防止该伤害 */
        unhurt:boolean;
        // /** 当前【sha】不能【shan】（几乎无用，一般采用directHit） */
        // skipShan:boolean;

        //【wuxie】相关使用属性：
        /** 当前【wuxie】响应的目标，卡牌信息 */
        respondTo:[Player,CardBaseUIData];

        /** 
         * 很多事件使用到：wuxie，sha...，目前还没清楚，貌似设置了则无法对其响应抵消 
         * 
         * 在usecard中有直接使用，若当前事件中directHit有添加到目标玩家，
         * 则为该该卡牌对该目标触发事件，设置event.directHit=true;
         * 
         * 补充：另外关于新版本卡牌强命的方法：
         * useCard事件的directHit列表，即为【不能使用或打出牌响应卡牌】的角色
         * 想让此牌完全不能被响应，把场上所有角色都加进这个列表就行了。
         */
        directHit:Player[];//|boolean

        /** 当前濒死事件处理的濒死状态的角色 */
        dying:Player;
        /** game.check使用，是否加入死亡角色 */
        deadTarget:boolean;
        /** 是否可以选择面板的按钮，一般用于禁止ai选择用 */
        choosing:boolean;
        /** 
         * 是否需要目标，
         * 在某些事件中的操作途中，将其设为false，
         * 则在game.check时为false，在其中一个检测可以跳过ok=false，
         * 具体作用不明，暂时当作无用处理 
         */
        targetRequired:boolean;

        /** 
         * 是在玩家确定要使用卡牌的情况下，弹出发动的技能
         * 
         * 使用范围：chooseUseTarget
         */
        logSkill:string;

        /** 
         * 直接使用该结果的卡牌做为该事件需要的卡牌
         * 使用范围：judge(一张牌)，gainPlayerCard，discardPlayerCard，chooseCard
         */
        directresult:Card|Card[];

        /** 
         * usercard中使用，
         * 主要作为“useCardToPlayer”，“useCardToTarget”，“useCardToPlayered”，“useCardToTargeted” 的触发中，
         * 最后将保存在该内的参数赋值到当前触发的卡牌事件里；
         */
        customArgs?:{
            /** 默认参数，为所有目标的触发卡牌事件参数设置 */
            default:SMap<any>;
            //对应的玩家playerid设置对应不同的参数设置
            [key:number]:SMap<any>;
        }

        /**
         * 用于多人拼点，对应设置各个玩家的拼点信息；
         * 
         * 本质为「通过其他方式提前选择拼点牌」；
         * 【v1.9.102】
         */
        fixedResult:NMap<any>;

        /**
         * 给事件添加filterStop函数,用于判断某个时机是否停止发动该时机未发动的技能
         * 
         * 在arrangeTrigger中使用，一旦时机符合，则调用finsh，完成该事件；
         * 【v1.9.102】
         */
        filterStop:NoneParmFum<boolean>;

        /** 缓存事件调用时用的参数（后续广播出去需要的核心数据之一） */
        _args:any[];
        /** set的数据,保存额外调用的事件字段（后续广播出去需要的核心数据之一） */
        _set:Array<[string,any]>;
        /** 事件的标记type，用于chooseToUse,useCard,lose */
        type:string;

        /** 记录选中的选项（自定义） */
        index?:number;

        //【自定义设置】一些常用于自设在event上保存的参数：
        /** 自己定义的结果 */
        bool?:boolean;
        /** 当前处理的玩家，用于对多目标进行处理 */
        current?:Player;
        /** 当前事件中使用得dialog */
        dialog?:Dialog;
        /** 事件中的其他卡牌（例如，其余弃置的牌） */
        oCards?:Card[];
        /** 事件中的其他卡牌（例如，例如记录将要视为的卡牌） */
        oCard?:CardBaseUIData;

        _backup:CheckEventResultData;
        
        //自己扩展任意参数
        [key: string]: any;
        
        //game.check 一些核心过滤参数，目前都额外存放在CheckEventData定义中
        // filterButton:any;
        // selectButton:any;
        // filterTarget:any;
        // selectTarget:any;
        // filterCard:any;
        // selectCard:any;
        // position:any;
        // complexSelect:any;
        // complexCard:any;
        // complexTarget:any;
        // ai1:any;
        // ai2:any;

    }
}