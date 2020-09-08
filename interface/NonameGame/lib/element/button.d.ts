declare namespace Lib.element {

    interface Button extends HTMLDivElement,IButtonLink {
        /**
         * 设置当前按钮进_status.event.excludeButton排除列表中
         */
        exclude(): void;
    }

    /** button的link */
    interface IButtonLink {
        // 由于link的类型教多，所以其字段时不稳定的：
        /**
         * node.link主要类型对应，按钮的数据类型：
         * 
         * type类型，ui.create.button的类型，即按钮的类型（字符串常量）：
         * 
            blank：对应item为card，效果：不显示卡面，显示背面；

            card：对应item为card，效果：展示卡牌；

            vcard：对应item为string,则是卡牌名；否则类型为CardBaseUIData或者CardBaseUIData2，效果：展示虚构卡牌（非卡堆里的）；

            character：对应item为string,则是武将名，效果：展示武将并附带一个功能按钮；

            player：对应的item为Player，则是玩家，效果：展示玩家的武将；

            text：对应的item为“html文档文本”，则是html文档的显示，效果：展示这段文档；

            textButton：对应的item为“html文档文本”，则是html文档的显示，效果：应该是按钮功能的文本，例如链接，暂不明确，待后期观察
         */
        link:Card|Player|string|CardBaseData;
    }

    // interface CardButton extends Card {
    //     link:any;
    // }
}