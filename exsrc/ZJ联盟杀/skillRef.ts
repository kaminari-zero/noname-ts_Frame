/* 技能引用文件 */

/// <reference path="./skill/skipPhaseSkill.ts" />
/// <reference path="./skill/势力通用技能.ts" />
/// <reference path="./skill/之前旧技能抽取.ts" />
/// <reference path="./skill/测试技能组14.ts" />
/// <reference path="./skill/测试技能组1.ts" />
/// <reference path="./skill/测试技能组2.ts" />
/// <reference path="./skill/测试技能组3.ts" />
/// <reference path="./skill/测试技能组5.ts" />
/// <reference path="./skill/测试技能组6.ts" />
/// <reference path="./skill/测试技能组7.ts" />
/// <reference path="./skill/测试技能组8.ts" />
/// <reference path="./skill/测试技能组9.ts" />
/// <reference path="./skill/测试技能组10.ts" />
/// <reference path="./skill/测试技能组11.ts" />
/// <reference path="./skill/测试技能组15.ts" />
/// <reference path="./skill/测试技能组12.ts" />
/// <reference path="./skill/测试技能组13.ts" />
/// <reference path="./skill/测试技能组4.ts" />
/// <reference path="./skill/测试技能组2-1.ts" />
/// <reference path="./skill/测试技能组2-2.ts" />
/// <reference path="./skill/测试技能组2-3.ts" />
/// <reference path="./skill/测试技能组2-4.ts" />
/// <reference path="./skill/测试模式技能组3.ts" />


/*  

    注: 需要引入文件，目前所使用的编译方式时将所有ts文件编译到一个js文件里，编译之间的顺序，就是按照/// <reference path="xxx" /> 引用的先后顺序合成到一个js文件里；
        该先后顺序，会影响初始化，变量声明作用域的顺序，所以需要严格按照顺序添加到各个引用文件里；
        所有文件的加载顺序，已经在extension.ts 头部声明好了；
*/