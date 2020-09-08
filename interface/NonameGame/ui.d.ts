declare var ui:UI;
interface UI {
    updates:any[];
    thrown: any[];
    touchlines: any[];
    todiscard:SMap<any>;
    refresh(node):any;
    create:UI.Create,
    click:UI.Click,
    /** 选中的ui */
    selected:{
        /** 选中的按钮列表（技能，操作） */
        buttons:any[],
        /** 选中的卡牌列表 */
        cards:any[],
        /** 选中的玩家目标列表 */
        targets:any[]
    },
    clear():any;
    updatec():any;
    updatex():any;
    updatexr():any;
    updatejm(player,nodes,start,inv):any;
    updatem(player):any;
    updatej(player):any;
    updatehl():any;
    updateh(compute):any;
    updatehx(node):any;
    updated():any;
    updatez():any;
    update():any;
    recycle(node,key):any;

    //【核心】ui的的区域：
    /** 卡堆区（抽牌区） */
    cardPile:HTMLDivElement;
    /** 弃牌区 */
    discardPile:HTMLDivElement;
    /** 特殊区（放置与武将牌上，旁区域） */
    special:HTMLDivElement;
    /** 处理区 */
    ordering:HTMLDivElement;
    
    //玩家身上的区域
    /** 装备区 */
    equips:HTMLDivElement;
    /** 判定区 */
    judges:HTMLDivElement;
    /** 手牌区 */
    handcards:HTMLDivElement;
}