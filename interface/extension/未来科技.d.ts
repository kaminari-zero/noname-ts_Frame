/** 扩展定义先咱暂时放再这里 */
interface Get {
    /**
     * 随机获取一名除该指定玩家以外的玩家
     * @param pl 
     */
    other(pl:Player):Player;

    /**
     * 获取目标玩家的击杀数
     * @param target 
     */
    killNum(target:Target):number;

    /**
     * 根据名字来获取到对应卡牌名和技能名
     * @param tra 
     * @param type 默认时卡牌，技能都打印；"skill"打印技能，"card"打印卡牌名
     */
    egname(tra:string, type?:string):string;

    /** 
     * 【真正之名】
     * 
     * 非国战模式，玩家英文名为player.name;
     * 在国战player.name1才是玩家英文名，player.name是座位号。
     */
    truename(pe:Player):string;
}

declare namespace Lib.element {
    interface Content {
        
    }

    interface Player {
        /**
         * 改变血量至X
         * 
         * 等同于，player.hp=num;不过这是有时机的
         * @param num 
         */
        changeHpTo(num:number):GameEvent;

        /**
         * 改变血量上限至X
         * @param num 
         */
        changeMaxHpTo(num:number):GameEvent;
        
        /**
         * 改变回合内阶段顺序
         * @param isChangePhaseAllthetime 可加true使其回合一直这样
         * @param name 
         */
        changePhase(...name:string[]):Player;
        changePhase(isChangePhaseAllthetime:boolean,...name:string[]):Player;
        /**
         * 主动重置“changePhase”改变的回合顺序(必须要使用changePhase)
         */
        resetChangePhase():Player;

        //【最大最小】
        // 用来检测玩家的某种属性的值是否为场上最高或最低
        // shushing为玩家的某种属性，如countCards('h')，hp，maxHp等等(直接比较属性值，和自带的一些比较方法不一样)
        // 不一定要是游戏自带的，但必须是已经定义的而且是数字，否则跳过此函数或游戏出错
        // arg里可以填'one'，表示唯一最高或最低
        /**
         * 检测玩家的某种属性的值是否为场上最高
         * @param shushing 玩家lib.element.player身上的元素key
         * @param isOneof 是否使用大于等于，即最大之一
         * @param arg 携带参数，如果有，则调用对应方法，传参处理；
         */
        ismax(shushing:string, ...arg):boolean;
        ismax(shushing:string,isOneof:string, ...arg):boolean;
        /**
         * 检测玩家的某种属性的值是否为场上最小
         * @param shushing 玩家lib.element.player身上的元素key
         * @param isOneof 是否使用大于等于，即最小之一
         * @param arg 携带参数，如果有，则调用对应方法，传参处理；
         */
        ismin(shushing:string, ...arg):boolean;
        ismin(shushing:string,isOneof:string, ...arg):boolean;

        /**
         * 国战时，改变三国杀的势力
         * 
         * 国战时连胜利条件一起改变
         * @param group 
         * @param log 取值false，不打印日志
         */
        changeGroupIdentity(group:string, log?:boolean):void;

        /**
         * 【暂时死亡】
         * 
         * (无时机)
         * 操作后玩家死亡，并在time个数个玩家死亡时复活num体力值，摸num2张牌。
         * @param time 第几轮复活
         * @param num 复活时，回复的体力值数
         * @param num2 复活时摸牌数
         */
        timedie(time:number,num?:number,num2?:number);

        /**
         * 【使用特殊杀】
         * 
            player.useModSha(target,card,mod);
            target目标
            card卡牌，默认是无属性杀
            mod效果
            除了card有默认值、mod外，用法与player.useCard一样
            mod现在有这几个：
                direct 不可闪避
                unequip 无视防具
                baseDamage:num 基础伤害加num //酒加的是基础伤害
                trigger.baseDamage的初始伤害为1
                extraDamage:num 对指定目标伤害加num //烈弓是指定伤害
                trigger.extraDamage的初始值为0"

                个人扩展：
                fengyin 封印角色所有技能
                loseHp 伤害变成失去
                extraSha 该杀为额外出的杀
                nature 属性伤害杀（fire,thunder）
         *
         * usecard的参数列表，正常情况下的参数就是usecard+mod参数：
         *  itemtype为“cards”：设置next.cards，是指所使用的card;
         *  itemtype为“card”/拥有name属性的object：设置next.card，设置使用的卡牌，若为视为使用该卡牌，此时cards就是视为使用该卡牌的时所使用的卡牌；
         *  itemtype为“players”/“player”：设置next.targets，设置目标;
         *  string类型：
         *      特殊的string类型：
         *          "noai"：设置next.noai为true;
         *          "nowuxie"：设置next.nowuxie为true，既可不被无懈;
         *      否则，设置next.skill；
         *  boolean类型：设置next.addCount，是否计入使用，若为false，则不会缓存进player.stat(从而不计入使用次数)；
         * @param arg 
         */
        useModSha(target:Target,mod:ModShaMap):GameEvent;
        useModSha(target:Target,cards:Card[],mod:ModShaMap):GameEvent;
        useModSha(...arg):GameEvent;
    }
}

declare namespace Lib {
    interface Filter {
        
    }
}

interface Game {
    /*
        设置对象的属性

        obj:操作的对象；
        property：设置的对象属性名；
        attributes：对象属性的基本配置：value,writable,enumerable,configurable,get,set；
            目前的取值：
            get.objtype为对象则为，attribute配置（即以json结构直接传）；
            为boolean类型则为，设置configurable的值；
            否则，设置value的值（即player,card这些对象都可以作为值保存）；

        ⚠️注意：如果writable为false，configurable为true时，通过o.name = "詹姆斯-韦恩"是无法修改成功的，但是使用Object.defineProperty()
        value是该属性的属性值，默认为undefined。
        writable是一个布尔值，表示属性值（value）是否可改变（即是否可写），默认为true。
        enumerable是一个布尔值，表示该属性是否可遍历，默认为true。如果设为false，会使得某些操作（比如for...in循环、Object.keys()）跳过该属性。
        configurable是一个布尔值，表示可配置性，默认为true。如果设为false，将阻止某些操作改写该属性，比如无法删除该属性，也不得改变该属性的属性描述对象（value属性除外）。也就是说，configurable属性控制了属性描述对象的可写性。
        get是一个函数，表示该属性的取值函数（getter），默认为undefined。
        set是一个函数，表示该属性的存值函数（setter），默认为undefined。
    */
    setProperty(obj:object, property:string, ...attributes):boolean;

    /** 
     * 创建特殊时机的全局技能 
     * 
     * 当前：创建扩展死亡、出杀音效
     * 
     * skillName:创建的技能名（会自动转化为全局技能）
     * types：
     *  特殊字符串："die","sha";
     *  其余字符串：扩展包的名字（指extensionName）；
     */
    createSkill(skillName:string, ...types):ExSkillData;

    /** 【随机用牌】随机其他角色对player使用card */
    otherUseCard(...arg):void;
}

/** 杀特殊功能扩展 */
interface ModShaMap {
    /** 无视防具 */
    unequip?:boolean;
    /** 基础伤害增加 */
    baseDamage?:number;
    /** 额外伤害增加 */
    extraDamage?:number;
    /** 无法闪避 */
    direct?:boolean;

    //后续个人增加
    /** 封印角色所有技能 */
    fengyin?:boolean;
    /** 伤害变成失去 */
    loseHp?:boolean;
    /** 该杀为额外出的杀 */
    extraSha?:boolean;
    /** 属性伤害杀 */
    nature?:NG.Nature;
}