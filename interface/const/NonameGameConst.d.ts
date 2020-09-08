declare namespace NG {
    /** 导入类型 */
    export const enum ImportType {
        Extension = "extension",
        Character = "character",
        Card = "card",
        Mode = "mode",
        Player = "player"
    }

    /** 玩家区域的位置类型 */
    export const enum PositionType {
        /** 手牌区 */
        Shoupai = "h",
        /** 手牌区 */
        Handcard = "h",
        /** 装备区 */
        Zhuangbei = "e",
        /** 装备区 */
        Equip = "e",
        /** 判定区 */
        Panding = "j",
        /** 判定区 */
        Judge = "j",

        /** 抽牌区/牌堆 */
        CardPlie = "c",
        /** 弃牌区 */
        Discard = "d",
        /** 
         * 特殊显示区
         * (特殊卡牌去，游戏外卡牌区，在该区域的卡牌，会被排除出上面那些区域，
         * 而上面那些区域是在游戏内的卡牌，
         * 所以该区域是指例如：“移除出游戏外”，“某些技能的标记，例如周泰的不屈”......)
         */
        Special = "s",

        /** 处理区(详情请看处理区相关信息，未确定，在无名杀是否完成实验这套规则) */
        Ordering = "o",

        /** 玩家场上的牌（武器，判定） */
        Area = "ej",
        /** 玩家操作的牌 */
        Use = "he",
        /** 玩家所有的牌 */
        All = "hej",

        //ui上指定的区域，用于某些特殊字段，统一归类到这里(玩家的牌应该都在player对象内)：
        //场上卡牌所在位置：
        // ui.control=ui.create.div('#control',ui.arena).animate('nozoom');
        // ui.cardPile=ui.create.div('#cardPile');
        // ui.discardPile=ui.create.div('#discardPile');
        // ui.special=ui.create.div('#special');
        /** 牌堆 */
        c = "cardPile",
        /** 弃牌堆 */
        d = "discardPile",
        /** 特殊卡牌区，游戏外卡牌区 */
        s = "special",
        /** 处理区 */
        o = "ordering",

        //特殊：
        /** 
         * 技能
         * 
         * 注：稍微有些冲突，注意使用
         * 使用范围：player.get
         */
        skill = "s",
    }

    /** 性别 */
    export const enum Sex {
        /** 男 */
        MALE = "male",
        /** 女 */
        FEMALE = "female"
    }

    /**
     * 势力名
     */
    export const enum Group {
        /** 魏(水) */
        WEI = "wei",
        /** 水 */
        WATER = "wei",
        /** 蜀（火） */
        SHU = "shu",
        /** 火 */
        FIRE = "shu",
        /** 吴（木） */
        WU = "wu",
        /** 木 */
        WOOD = "wu",
        /** 群（土） */
        QUN = "qun",
        /** 土 */
        SOIL = "qun",
        /** 神（金） */
        SHEN = "shen", //懒得关神选势力的选项，这些势力，后面可能都改
        // SHEN = "shen",
        /** 金 */
        GOLD = "shen",
        /** 无属性 */
        NONE = "western",
        /** 西方 */
        WESTERN = "western",
        /** 大佬的key */
        KEY = "key",
    }

    //阶段重新整理：阶段名+时机 （需手动拼接完整阶段，有些比较特殊的阶段除外）
    export const enum TriggerEnum {
        /** 开始前 */
        Before = "Before",
        /** 开始时/时 */
        Begin = "Begin",
        /** 触发后/后 */
        End = "End",
        /** 触发结束后/结束后 */
        After = "After",
        /** 忽略/跳过 */
        Omitted = "Omitted"
    }

    /**
     * 阶段类触发时机：
     */
    export const enum PhaseTrigger {
        /** 所有人都展示武将牌后 (前缀必须为global)，暂时只有一个阶段 */
        gameStart = "gameStart",

        /** 游戏开始阶段（所有人摸牌结束之后，游戏开始） (前缀必须为global) */
        gameDraw = "gameDraw",

        /** 回合阶段 */
        phase = "phase",

        /** 判定阶段(在judge事件中，也作为单独的触发发出，表示当前进行判定，亮出了判定牌) */
        judge = "judge",

        /** 摸牌阶段 */
        phaseDraw = "phaseDraw",

        /** 出牌阶段 */
        phaseUse = "phaseUse",

        /** 弃牌阶段 */
        phaseDiscard = "phaseDiscard",

        //新版2020-2-24增加的时机：(流程阶段更细致)
        /** 准备阶段 */
        phaseZhunbei = "phaseZhunbei",
        /** 结束阶段 */
        phaseJieshu = "phaseJieshu",


        //特化出来的常用阶段，不需要拼接
        /** 准备阶段时(同“phaseBegin”) */
        phaseZhunbeiBegin = "phaseZhunbeiBegin",
        /** 结束阶段后（同“phaseEnd”） */
        phaseJieshuBegin = "phaseJieshuBegin",
        /** 回合结束时(已被"phaseJieshuBegin"取代) */
        phaseEnd = "phaseEnd",

        //【1.9.98】细节化摸牌阶段的相关时机：（并无特殊实现，这是根据规则书完整瓜分的阶段，可以细分先后顺序）
        /** 摸牌阶段开始前 */
        phaseDrawBefore = "phaseDrawBefore",
        /** 摸牌阶段开始时1 */
        phaseDrawBegin = "phaseDrawBegin",
        /** 摸牌阶段开始时2 */
        phaseDrawBegin1 = "phaseDrawBegin1",
        /** 摸牌阶段 */
        phaseDrawBegin2 = "phaseDrawBegin2",

        /** 自定义，需要修改身份局源码，表示，选择了“主”(以后需要，再添加) */
        // chooseCharacter = "chooseCharacterByZhu",
    }

    /**
     * 卡牌类触发时机：（卡牌类,技能类只要符合条件都会触发其对应名的阶段触发）
     */
    export const enum CardTrigger {
        /** 使用杀 */
        sha = "sha",

        //【sha】相关的触发时机：
        /** 使用杀 被闪后（被响应） （前缀player，使用杀未命中） */
        shaMiss = "shaMiss",
        /** 玩家使用杀 未被闪，杀成功 */
        shaHit = "shaHit",
        /**  玩家使用杀命中，造成伤害 */
        shaDamage = "shaDamage",
        /**  玩家使用杀命中，不造成伤害 */
        shaUnhirt = "shaUnhirt",

        /** 桃 */
        tao = "tao",

        /** 使用决斗 */
        juedou = "juedou",

        /** 失去卡牌 */
        lose = "lose",

        /** 获得卡牌 */
        gain = "gain",

        //这三个使用时机，按下面顺序触发，一般使用无需时机,目前单纯在技能之间约定顺序用，并无实际得作用
        /** 声明使用牌后 */
        useCard1 = "useCard1",
        /** 使用牌选择目标后 */
        useCard2 = "useCard2",
        /** 使用卡牌 */
        useCard = "useCard",

        /** 使用卡牌
         * （使用卡牌时固定通用事件,即正式触发卡牌的效果，每个"卡牌"+时点触发都伴随这个触发
         * 【每个卡牌都触发自己名字的独立时机，这个凡是使用卡牌都会触发的通用时机】） 
         */
        useCardTo = "useCardTo",

        //额外的userCardTo时机(皆无触发时机)：
        //useCardToPlayer和useCardToTarget这两个时机，对卡牌的所有目标都会依次触发一遍，
        //此时trigger.target即为被触发的目标，trigger.parent/trigger.getParent()是useCard事件；
        /** 使用卡牌指定目标时 */
        useCardToPlayer = "useCardToPlayer",
        /** 成为卡牌目标时 */
        useCardToTarget = "useCardToTarget",
        /** 使用卡牌指定目标后 */
        useCardToPlayered = "useCardToPlayered",
        /** 成为卡牌目标后 */
        useCardToTargeted = "useCardToTargeted",

        /** 打出卡牌 */
        respond = "respond",

        /** 从牌堆摸牌 */
        draw = "draw",

        /** 装备装备牌 */
        equip = "equip",

        /** 打出卡牌 */
        chooseToRespond = "chooseToRespond",

        /** 弃牌 */
        discard = "discard",

        /** 失去某张牌 */
        lose_ = "lose_"
    }

    /**
     * 状态类触发时机：
     */
    export const enum StateTrigger {
        /** 受到伤害 (若前缀为source则为你造成伤害) */
        damage = "damage",

        /** 失去(流失)体力 */
        loseHp = "loseHp",

        /** 回复体力 */
        recover = "recover",

        /** 体力值发生改变后(无时机) */
        changeHp = "changeHp",

        /** 减少体力上限 */
        loseMaxHp = "loseMaxHp",

        /** 增加体力上限 */
        gainMaxHp = "gainMaxHp",

        /** 武将牌翻面 */
        turnOver = "turnOver",

        /** 武将牌横置(连环) */
        link = "link",

        /** 进入濒临状态 */
        dying = "dying",

        /** 死亡 */
        die = "die",

        //新增特殊受伤时机(不需要拼接) by2020-2-23
        /*
        新版本的伤害事件中 
        添加了damageBegin1 damageBegin2 damageBegin3 damageBegin4这四个新时机
        分别对应图中的造成伤害时1 造成伤害时2 受到伤害时3 受到伤害时4
        1，2是造成伤害时
        3，4是受到伤害时
        这么规定的
        1，3可以改变伤害大小
        2，4不能
        (具体到时分析)
        */
        /** 造成伤害时1:造成伤害时,可以改变伤害大小 */
        damageBegin1 = "damageBegin1",
        /** 造成伤害时2:造成伤害时,不可以改变伤害大小 */
        damageBegin2 = "damageBegin2",
        /** 受到伤害时3:受到伤害时,可以改变伤害大小 */
        damageBegin3 = "damageBegin3",
        /** 受到伤害时4:受到伤害时,不可以改变伤害大小 */
        damageBegin4 = "damageBegin4"
    }

    /**
     * 特殊阶段（后面根据代码需要补充）
     */
    export const enum SuperTrigger {
        /** 触发 */
        trigger = "trigger"
    }

    /**
     * 主动技触发时机
     * 
     * （也可以使用上面得阶段触发，以下为比较常用）
     * 
     * 用于主动技的enable中
     */
    export const enum EnableTrigger {
        /**  主动用/挑选卡牌以使用 */
        chooseToUse = "chooseToUse",
        /** 响应/挑选卡牌以响应 */
        chooseToRespond = "chooseToRespond",
        /** 回合使用(出牌阶段) */
        phaseUse = "phaseUse",

        // 不行，到时详细了解流程，估计是需要game.check时的时机：
        // //【扩展】测试准备阶段使用，结束阶段使用：
        // /** 准备阶段时使用 */
        // phaseZhunbei = "phaseZhunbei",
        // /** 结束阶段后使用 */
        // phaseJieshu = "phaseJieshu",
    }

    /** 卡牌花色 */
    export const enum CardColor {
        /** 黑桃 */
        Spade = "spade",
        /** 红桃 */
        Heart = "heart",
        /** 草花 */
        Club = "club",
        /** 方块 */
        Diamond = "diamond",

        /** 指无花色，颜色，一般多用于多张卡牌花色不同时，若需要把其视为一种，花色时，则为none */
        None = "none",

        /** 红 */
        Red = "red",
        /** 黑 */
        Black = "black",
    }

    /** 卡牌类型（包括子类型） */
    export const enum CardType {
        /** 基本牌 */
        Basic = "basic",
        /** 锦囊牌（指非延时锦囊） */
        Trick = "trick",
        /** 延时锦囊牌 */
        Delay = "delay",
        /** 装备牌 */
        Equip = "equip",

        //子类型subtype
        /** 武器 */
        Equip1 = "equip1",
        /** 防具 */
        Equip2 = "equip2",
        /** 防马（+1） */
        Equip3 = "equip3",
        /** 攻马（-1） */
        Equip4 = "equip4",
        /** 法宝 */
        Equip5 = "equip5",
    }

    /**
     * 伤害的属性（属性伤害）
     */
    export const enum Nature {
        //sha扩展的属性伤害
        /** 雷属性 */
        Thunder = "thunder",
        /** 火属性 */
        Fire = "fire",

        //后续sha扩展属性，但不是连环可传导的属性

        /** 毒 */
        Poison = "poison"
    }

    /**
     * 常用的item类型常量（主要是get.itemtype）
     */
    export const enum ItemType {
        /** 位置 */
        POSITION = "position",
        /** 玩家 */
        PLAYER = "player",
        /** 玩家列表 */
        PLAYERS = "players",
        /** 卡牌 */
        CARD = "card",
        /** 卡牌列表 */
        CARDS = "cards",
        /** 伤害属性 */
        NATURE = "nature",
        /** 选择范围 */
        SELECT = "select",
        /** 确认坐标的2对xy值 */
        DIV_POSITION = "divposition",
        /** 按钮 */
        BUTTON = "button",
        /** 会话面板 */
        DIALOG = "dialog",

    }

    /**
     * 创建按钮/div类型常量
     */
    export const enum ButtonType {
        /** 
         * 背面：
         * 
         * 对应item为card，
         * 效果：不显示卡面，显示背面； 
         */
        BLANK = "blank",
        /**
         * 卡牌：
         * 
         * 对应item为card，
         * 效果：展示卡牌；
         */
        CARD = "card",
        /** 
         * 虚拟卡牌:
         * 
         * 对应item为string,则是卡牌名；否则类型为CardBaseUIData或者CardBaseUIData2，
         * 效果：展示虚构卡牌（非卡堆里的）； 
         */
        VCARD = "vcard",
        /**
         * 武将卡：
         * 
         * 对应item为string,则是武将名，
         * 效果：展示武将并附带一个功能按钮；
         */
        Character = "character",
        /**
         * 玩家：
         * 
         * 对应的item为Player，则是玩家，
         * 效果：展示玩家的武将；
         */
        PLAYER = "player",
        /**
         * 文本：
         * 
         * 对应的item为“html文档文本”，则是html文档的显示，
         * 效果：展示这段文档；
         */
        TEXT = "text",
        /**
         * （纯）可点击文本：
         * 
         * 对应的item为“html文档文本”，则是html文档的显示，
         * 效果：应该是按钮功能的文本，例如链接，暂不明确，待后期观察
         */
        TextButton = "textButton",
    }

    /**
     * 对象类型
     */
    export const enum ObjType {
        Array = "array",
        Object = "object",
        Div = "div",
        Table = "table",
        Tr = "tr",
        Td = "td",
        Body = "body",
    }

    /**
     * 不弃牌，准备用这些牌来干什么的常量
     */
    export const enum PrepareConst {
        /** 交给玩家 */
        Give = "give",
        Give2 = "give2",
        Throw = "throw",
        Throw2 = "throw2"
    }

    /**
     * 装备栏位置
     * 1=武器栏 2=防具栏 3=加一马栏 4=减一马栏 5=宝物栏
     */
    export const enum EquipPos {
        /** 武器 */
        E1 = 1,
        /** 防具 */
        E2 = 2,
        /** 防马（+1） */
        E3 = 3,
        /** 攻马（-1） */
        E4 = 4,
        /** 法宝 */
        E5 = 5,

        /** 武器 */
        Equip1 = "equip1",
        /** 防具 */
        Equip2 = "equip2",
        /** 防马（+1） */
        Equip3 = "equip3",
        /** 攻马（-1） */
        Equip4 = "equip4",
        /** 法宝 */
        Equip5 = "equip5",
    }

    /** effect指定返回的最终受益结果 */
    export const enum AIEffectResultConst {
        /** 对使用者的收益值0 */
        zeroplayer = "zeroplayer",
        /** 对目标的收益值0 */
        zerotarget = "zerotarget",
        /** 对使用者，目标的收益值0 */
        zeroplayertarget = "zeroplayertarget"
    }


    export const enum CardNameConst {
        sha = "sha",
        杀 = "sha",
        shan = "shan",
        闪 = "shan",
        tao = "tao",
        桃 = "tao",
        jiu = "jiu",
        酒 = "jiu",
        du = "du",
        毒 = "du",

        wugu = "wugu",
        五谷丰登 = "wugu",
        taoyuan = "taoyuan",
        桃园结义 = "taoyuan",
        nanman = "nanman",
        南蛮入侵 = "nanman",
        wanjian = "wanjian",
        万箭齐发 = "wanjian",
        wuzhong = "wuzhong",
        无中生有 = "wuzhong",
        juedou = "juedou",
        决斗 = "juedou",
        shunshou = "shunshou",
        顺手牵羊 = "shunshou",
        guohe = "guohe",
        过河拆桥 = "guohe",
        jiedao = "jiedao",
        借刀杀人 = "jiedao",
        wuxie = "wuxie",
        无懈可击 = "wuxie",
        lebu = "lebu",
        乐不思蜀 = "lebu",
        shandian = "shandian",
        闪电 = "shandian",
        huogong = "huogong",
        火攻 = "huogong",
        tiesuo = "tiesuo",
        铁索连环 = "tiesuo",
        bingliang = "bingliang",
        兵粮寸断 = "bingliang",


        //zj联盟杀的专有卡牌：
        //基本：
        血 = "tao",
        魔 = "jiu",
        //锦囊：
        對拼神術 = "duiping",
        pingdianshenshu = "duiping",
        激光爆術 = "jiguang",
        jiguang = "jiguang",
        奧義秘術 = "aoyi",
        aoyi = "aoyi",
        補魂魔術 = "fuhun",
        fuhun = "fuhun",
        二重魔術 = "erchong",
        erchong = "erchong",
        蜃樓幻術 = "shenlou",
        shenlou = "shenlou",
        遠窺視術 = "guishi",
        guishi = "guishi",
        神賜光術 = "wugu",
        大對決術 = "juedou",
        大破壞術 = "guohe",
        大災炎術 = "huogong",
        地獄侵術 = "nanman",
        干擾魔術 = "wuxie", 
        連環鎖術 = "tiesuo",
        流星墜術 = "wanjian",
        聖治癒術 = "taoyuan",
        天降金術 = "wuzhong",
        偷竊邪術 = "shunshou",
        御劍殺術 = "jiedao",
        //延迟
        投影魔術 = "touying",
        touying = "touying",
        積累靈術 = "leiji",
        leiji = "leiji",
        激流葬術 = "jiliuzang",
        jiliuzang = "jiliuzang",
        聖水牢術 = "lebu",
        閃電雷術 = "shandian",
        封魔雷術 = "bingliang",
    }

    /** mark标记显示形式的常量值 */
    export const enum MarkTypeConst {
        card = "card",
        cards = "cards",
        image = "image",
        character = "character"
    }

    /** mark标记显示内容的类型 */
    export const enum MarkContentConst {
        /** 有（数）个标记； */
        mark = "mark",
        /** 一张牌 */
        card = "card",
        /** 多张牌 */
        cards = "cards",
        /** 限定技，觉醒技专用；(若没设置，在info.limited为true下回默认设置这个) */
        limited = "limited",
        /** 剩余发动次数 */
        time = "time",
        /** 剩余回合数 */
        turn = "turn",
        /** 牌数 */
        cardCount = "cardCount",
        /** 技能描述 */
        info = "info",
        /** 武将牌 */
        character = "character",
        /** 多个武将牌 */
        characters= "characters",
        /** 一个玩家 */
        player = "player",
        /** 多个玩家 */
        players = "players",
    }

    /** 游戏内用于参数的字符串常量 */
    export const enum StringTypeConst {
        /** 
         * 丢弃动画
         * 
         * 使用范围：info.intro.onunmark
         */
        throw = "throw",
        /**
         * 设置到特殊区的缓存标记
         * 
         * 使用范围：大多涉及标记操作，缓存信息操纵
         */
        toStorage = "toStorage",
        /**
         * 将延时锦囊，非延时锦囊，都视为一种锦囊牌
         * 
         * 适用范围：get.type
         */
        trick = "trick",
        /**
         * 来自游戏区域外（一般指特殊区，即置于武将上的牌，标记之类的）
         * 
         * 使用范围：player.gain
         */
        fromStorage = "fromStorage",

        /**
         * 指代缓存的标记,清除当前技能名的缓存
         * 
         * 使用范围：info.onremove
         */
        storage = "storage",
        /**
         * 指代缓存的标记是卡牌时,将当前技能名的缓存的卡牌，弃置
         * 
         * 使用范围：info.onremove
         */
        lose = "lose",

        /** 
         * 用于game.checkMod，mod的标记常量，只要无返回，则默认该值，则表示数据没有修改到(一般用于处理的参数是对象时常用)
         * (目的只是为了统一，实际上不变化标记可以自定义)
         */
        unchanged = "unchanged",

        /** 
         * 无卡牌 
         * 
         * 使用范围：damage,recover
         */
        nocard = "nocard",
        /** 
         * 无来源 
         * 
         * 使用范围：damage,recover
         */
        nosource = "nosource",

        /**
         * 可以直接看到手牌
         * 
         * 使用范围：gainPlayerCard
         */
        visible = "visible",

        /** 
         * 使用give动画，展示卡牌移动
         * 
         * 使用范围：gainPlayerCard
         */
        visibleMove = "visibleMove",

        /**
         * 可不被无懈
         * 
         * 使用范围：useCard
         */
        nowuxie = "nowuxie",

        /**
         * 是对自己的操作
         * 
         * 使用范围：gain
         */
        bySelf = "bySelf",
    }

    /**
     * 游戏内的区域(ui的的区域,ui.xxxxx)【在position中已经具体定义】
     * 
     * "special","discardPile","cardPile","control"(这一般都不会用上)
     */
    // export const enum GameAreaNameConst {
    //     //【核心】ui的的区域：
    //     /** 卡堆区（抽牌区） */
    //     cardPile = "cardPile",
    //     /** 弃牌区 */
    //     discardPile = "discardPile",
    //     /** 特殊区（放置与武将牌上，旁区域） */
    //     special = "special",
    //     /** 处理区 */
    //     ordering = "ordering",

    //     //玩家身上的区域(还没确定)
    //     // /** 装备区 */
    //     // equips = "equips",
    //     // /** 判定区 */
    //     // judges = "judges",
    //     // /** 手牌区 */
    //     // handcards = "handcards"
    // }

    /** 阶段名(游戏内对应lib.phaseName的索引位置,这是游戏流程阶段，不包括游戏开始，开始抽牌，结束游戏，濒死之类的) */
    export const enum PhaseNameEnum {
        /** 准备阶段 */
        phaseZhunbei,
        /** 判定阶段 */
        phaseJudge,
        /** 抽牌阶段 */
        phaseDraw,
        /** 出牌阶段 */
        phaseUse,
        /** 弃牌阶段 */
        phaseDiscard,
        /** 结束阶段 */
        phaseJieshu,
    }
    // phaseName:['phaseZhunbei','phaseJudge','phaseDraw','phaseUse','phaseDiscard','phaseJieshu']

    /** 
     * get.distance的距离类型
     */
    export const enum DistanceTypeConst {
        /** 原始距离 */
        raw = "raw",
        /** 直线距离 */
        pure = "pure",
        /** 绝对距离 */
        absolute = "absolute",
        /** 攻击距离 */
        attack = "attack",
        /** 默认防御距离(即不需要填类型) */
        none = ""
    }

    /** 游戏的玩法模式 */
    export const enum GameModeConst {
        /** 身份局 */
        identity = "identity",
        /** 国战 */
        guozhan = "guozhan",
        /** 对战 */
        versus = "versus",
        /** 斗地主 */
        chess = "chess",
    }

    /** 
     * 游戏内的颜色（觉醒的颜色）
     * 
     * 准确来说是，$skill等动画时，设置damage.fullscreenavatar[data-nature=xxx]的颜色：
     * 
     * 注：目前看来，为了方便好认，其实涉及颜色的css都用这些来命名指定特种颜色；
     */
    export const enum NatureColorConst {
        /** 紫罗蓝 */
        thunder = 'thunder',
        /** 黄 */
        metal = 'metal',
        /** 绿 */
        wood = 'wood',
        /** 浅蓝 */
        water = 'water',
        /** 棕褐色 */
        soil = 'soil',
        /** 红 */
        fire = 'fire',
        /** 橙色 */
        orange = 'orange',
        /** 灰色 */
        gray = 'gray',

        // /** 墨绿 */
        // poison = 'poison',
        // /** 紫 */
        // brown = 'brown',
    }

    /** 目标连线的颜色 */
    export const enum LineColorConst {
        /** 红 */
        fire = 'fire',
        /** 紫罗蓝 */
        thunder = 'thunder',
        /** 绿 */
        green = 'green'
    }

    /** 游戏内相关的mod检测 */
    export const enum CheckModConst {
        /** 卡牌是否可弃置 */
        cardDiscardable = "cardDiscardable",
        /** 卡牌是否可用 */
        cardEnabled = "cardEnabled",
        /** 卡牌是否可用（适用范围基本可以视为所有情况下） */
        cardEnabled2 = "cardEnabled2",
        /** 卡牌是否可用 */
        cardUsable = "cardUsable",
        /** 卡牌是否可以响应 */
        cardRespondable = "cardRespondable",
        /**
         * 卡牌是否可以救人
         * 要与cardEnabled一起使用（目前看来两个效果一致）
         * 注：还是和cardEnabled不同，设置了该mod检测，只要是在_save，濒死求救阶段，都可以触发；
         *  不过前提，可能还是要通过该阶段的cardEnabled的检测，目前还没确定，日后再做分析
         */
        cardSavable = "cardSavable",
        /** 在全局的防御范围 */
        globalTo = "globalTo",
        /** 在全局的进攻距离 */
        globalFrom = "globalFrom",
        /**角色的攻击范围*/
        attackFrom = "attackFrom",
        /** 攻击到角色的范围 */
        attackTo = "attackTo",
        /** 手牌上限 */
        maxHandcard = "maxHandcard",
        /** 选择的目标 */
        selectTarget = "selectTarget",

        /** 该卡牌的发动源玩家是否能使用该卡牌（该角色是否能使用该牌） */
        playerEnabled = "playerEnabled",
        /** 是否能成为目标 */
        targetEnabled = "targetEnabled",

        /**可以指定任意（范围内）目标*/
        targetInRange = "targetInRange",
        /**弃牌阶段时，忽略的手牌*/
        ignoredHandcard = "ignoredHandcard",

        /** 过滤可以被丢弃的牌 */
        canBeDiscarded = "canBeDiscarded",
        /** 过滤可以获得的牌 */
        canBeGained = "canBeGained",

        /**改变花色*/
        suit = "suit",
        /** 改变判断结果(最终结果) */
        judge = "judge",

        //无懈相关：主要在_wuxie中，（此时应时无懈询问阶段），检测触发卡牌以下对应mod
        //触发阶段为:phaseJudge(判定阶段)
        /** 是否能在判定阶段使用无懈 */
        wuxieJudgeEnabled = "wuxieJudgeEnabled",
        /** 是否能在判定阶段响应无懈 */
        wuxieJudgeRespondable = "wuxieJudgeRespondable",
        //非判定阶段触发
        /** 是否能使用无懈 */
        wuxieEnabled = "wuxieEnabled",
        /** 是否能响应无懈 */
        wuxieRespondable = "wuxieRespondable",

        /** 改变卡牌名字  用于get.name*/
        cardname = "cardname",
        /** 改变卡牌伤害属性   用于get.nature*/
        cardnature = "cardnature",
    }

    /** AI用技能标签 */
    export const enum SkillTagConst {
        /**
         * 【响应闪】
         * 作用是告诉AI手里没『闪』也可能出『闪』,防止没『闪』直接掉血;
         * 常用于视为技；
         */
        respondShan = "respondShan",
        /**
         * 【响应杀】
         * 作用是告诉AI手里没『杀』也可能出『杀』,防止没『杀』直接掉血;
         * 常用于视为技；
         */
        respondSha = "respondSha",
        /**
         * 在createTrigger中使用，可以指示技能不强制发动，暂无用；
         */
        nofrequent = "nofrequent",
        /** 
         * 【卖血】
         * 用于其他AI检测是否是卖血流(if(target.hasSkillTag('maixie')))。并非加了这个AI就会卖血。
         */
        maixie = "maixie",
        /**
         * 【卖血2】
         * 用于chooseDrawRecover 选择抽牌还是回血，即表示该角色血量重要，告诉AI主动优先选择回血。
         */
        maixie_hp = "maixie_hp",
        /**
         * 【卖血3】
         */
        maixie_defend = "maixie_defend",
        /**
         * 【无护甲】
         * 视为无护甲，用于damage，作用是告诉AI，即使有护甲，也不不使用护甲抵扣伤害；
         */
        nohujia = "nohujia",
        /**
         * 【无装备】
         * 视为无装备，用于get.buttonValue中，和下面noh同理,
         * 影响ui的选择项；
         */
        noe = "noe",
        /**
         * 【无手牌】
         * 视为无手牌，用于get.buttonValue中，目前只出现在“连营”和“伤逝”中,用于其它AI检测是否含有标签『无牌』,从而告诉其他AI不要拆迁(因为生生不息)。
         * 应该是影响ui的选择项
         */
        noh = "noh",
        /**
         * 【不能发起拼点】
         * 用于player.canCompare 检测玩家是否能发起拼点（作为来源），可用于常规判定；
         */
        noCompareSource = "noCompareSource",
        /**
         * 【不能成为拼点目标】
         * 用于player.canCompare 检测目标是否能成为拼点的目标，可用于常规判定；
         */
        noCompareTarget = "noCompareTarget",
        /**
         * 用于lib.filter.cardRespondable,检测是否可以响应卡牌（这个竟然参加逻辑中）；
         */
        norespond = "norespond",
        /**
         * 【不能自动无懈】
         * 影响lib.filter.wuxieSwap的检测；
         */
        noautowuxie = "noautowuxie",
        /**
         * 【可救助】
         * 在_save全局技能中检测，标记该技能是可用于濒死阶段救助；（即此技能可以用于自救）
         */
        save = "save",
        /** 
         * 【响应桃】
         * 此技能可以用于救人，
         * 一般用于视为技 
         */
        respondTao = "respondTao",
        /**
         * 【不明置】
         * 影响game.check的检测；
         */
        nomingzhi = "nomingzhi",
        /**
         * 反转装备的优先值，用于设置装备卡牌card.ai.basic.order的默认优先度；
         */
        reverseEquip = "reverseEquip",
        /** 非身份，国战使用，不明；基本没使用上 */
        revertsave = "revertsave",
        /** 改变判定 */
        rejudge = "rejudge",

        //其余一些有些少出场的：
        /** 不会受到火焰伤害 */
        nofire = "nofire",
        /** 不会受到雷电伤害 */
        nothunder = "nothunder",
        /** 不会受到伤害 */
        nodamage = "nodamage",
        /** 使用毒会有收益 */
        usedu = "usedu",
        /** 不受毒影响 */
        nodu = "nodu",
        notrick = "notrick",
        notricksource = "notricksource",
        useShan = "useShan",
        noShan = "noShan",
        nolose = "nolose",
        nodiscard = "nodiscard",

        //个人额外扩展：
        /** 不能被横置 */
        noLink = "noLink",
        /** 不能被翻面 */
        noTurnover = "noTurnover",
    }

    /** AI用卡牌标签 */
    export const enum CardTagConst {
        /** 【响应杀】：即手上没有杀时，也有可能响应杀 */
        respondSha = "respondSha",
        /** 【响应闪】：即手上没有闪时，也有可能响应闪 */
        respondShan = "respondShan",
        /** 【不会受到伤害】 */
        damage = "damage",
        /** 【不受元素伤害】 */
        natureDamage = "natureDamage",
        /** 【不受雷属性伤害】 */
        thunderDamage = "thunderDamage",
        /** 【不受火属性伤害】 */
        fireDamage = "fireDamage",
        /** 【可以指定多个目标】 */
        multitarget = "multitarget",
        /** 【回复体力】 */
        recover = "recover",
        /** 【失去体力】 */
        loseHp = "loseHp",
        /** 【可获得牌】 */
        gain = "gain",
        /** 【可自救】 */
        save = "save",
        /** 【可弃牌】，即弃牌可以有收益 */
        discard = "discard",
        /** 【失去牌】 */
        loseCard = "loseCard",
        /** 【多个目标结算时（？存疑）】 */
        multineg = "multineg",
        /** 【可多次/再次判定/改变判定】 */
        rejudge = "rejudge",
        draw = "draw",
        norepeat = "norepeat",
    }

    /** 
     * player方法自带的动画
     * 
     * 技能配置skillAnimation，所使用的动画type就是$动画方法；
     * 
     * 注：带2的方法是game.chess模式下用的；
     */
    export const enum AniNmaeConst {
        drawAuto = "drawAuto",
        draw = "draw",
        compareMultiple = "compareMultiple",
        compare = "compare",
        throw = "throw",
        throwordered = "throwordered",
        throwordered1 = "throwordered1",
        throwordered2 = "throwordered2",
        throwxy = "throwxy",
        throwxy2 = "throwxy2",
        giveAuto = "giveAuto",
        give = "give",
        equip = "equip",
        gain = "gain",
        gain2 = "gain2",
        skill = "skill",
        fire = "fire",
        thunder = "thunder",
        rare2 = "rare2",
        epic2 = "epic2",
        legend2 = "legend2",
        rare = "rare",
        epic = "epic",
        legend = "legend",
        coin = "coin",
        dust = "dust",
        recover = "recover",
        fullscreenpop = "fullscreenpop",
        damagepop = "damagepop",
        damage = "damage",
        die = "die",
        dieflip = "dieflip",
        phaseJudge = "phaseJudge",
    }

    /** replaceJudge的改判方式 */
    export const enum ReplaceJudgeType {
        /** 用一张牌改判 */
        card = "card",
        /** 从一系列牌中选择一张改判 */
        cards = "cards",
        /** 自己某一区域的牌替代改判 */
        exchange = "exchange",
        /** 自己某一区域的牌代替改判 */
        replace = "replace",
    }

    /** 身份模式的身份 */
    export const enum IdentityConst {
        /** 主 */
        zhu = "zhu",
        /** 内 */
        nei = "nei",
        /** 反 */
        fan = "fan",
        /** 忠 */
        zhong = "zhong",
    }

    /** 事件的type常量（一般用于chooseToUse，useCard） */
    export const enum GameEventType {
        //chooseToUse的type
        /** 回合使用 */
        phase = "phase",
        /** 响应“wuxie”使用 */
        wuxie = "wuxie",

        //useCard的type
        precard = "precard",
        /** useCard事件执行的card */
        card = "card",
        postcard= "postcard",

        //lose的type
        /** 该lose事件是否时"丢弃discard" */
        discard = "discard",
        // damage = "damage",
    }
}
