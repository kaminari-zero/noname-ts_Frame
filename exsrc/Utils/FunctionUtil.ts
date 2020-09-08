namespace NG {
    /** 方法工具：函数式编程,测试直接传入游戏环境中 */
    export class FunctionUtil {
        //======================条件方法============================
        static defaultTrue() {
            return true;
        }

        static defaultFalse() {
            return false;
        }

        /** 默认返回true的方法 */
        static getDefaultTrueFun() {
            return this.defaultTrue;
        }

        /** 默认返回false的方法 */
        static getDefaultFalseFun() {
            return this.defaultFalse;
        }

        /** 结果取非 */
        static resultNotFun(cond: ConditionFun, ...condis: any[]) {
            let result = cond.apply(null, condis);
            return !result;
        }

        /** 而且and:只要有一个是false，就返回false,都为true才返回true */
        static resultAndFun(conds: ConditionFun[], ...args: any[]) {
            let result = conds.every((element: ConditionFun) => {
                return element.apply(null, args);
            });
            return result;
        }

        /** 或者or:只要有一个是true，就返回true */
        static resultOrFun(conds: ConditionFun[], ...args: any[]) {
            let result = conds.some((element: ConditionFun) => {
                return element.apply(null, args);
            });
            return result;
        }

        /** 异或xor:如果a、b两个值不相同，则异或结果为1。如果a、b两个值相同，异或结果为0。 */
        static resultXorFun(cond1: ConditionFun, cond2: ConditionFun, ...args: any[]) {
            let result1 = cond1.apply(null, args);
            let result2 = cond2.apply(null, args);
            return result1 != result2;
        }

        /** 执行所有条件方法（把条件方法的返回值视为必定成功，单纯执行方法） */
        static defaultDoAllFun(conds: ConditionFun[], ...args: any[]) {
            conds.forEach((element: ConditionFun) => {
                element.apply(null, args);
            });
            return true;
        }

        /** 根据返回值，选择触发制定条件的，并返回其结果 */
        static selectedFun(conds: ConditionFun[], ...args: any[]) {
            let fristCond = conds.shift();
            let result = fristCond.apply(null, args);
            let seletedCond = conds[result];
            if (seletedCond) {
                return seletedCond.apply(null, args);
            } else {
                return false;
            }
        }

        /** 等于 */
        static equalFun(cond1: ConditionFun, cond2: ConditionFun, ...args: any[]) {
            let result1 = cond1.apply(null, args);
            let result2 = cond2.apply(null, args);
            return result1 == result2;
        }

        /** 等于 */
        static unequalFun(cond1: ConditionFun, cond2: ConditionFun, ...args: any[]) {
            let result1 = cond1.apply(null, args);
            let result2 = cond2.apply(null, args);
            return result1 != result2;
        }

        /** 大于 */
        static gtFun(cond1: ConditionFun, cond2: ConditionFun, ...args: any[]) {
            let result1 = cond1.apply(null, args);
            let result2 = cond2.apply(null, args);
            return result1 > result2;
        }

        /** 大于等于 */
        static gteFun(cond1: ConditionFun, cond2: ConditionFun, ...args: any[]) {
            let result1 = cond1.apply(null, args);
            let result2 = cond2.apply(null, args);
            return result1 >= result2;
        }

        /** 小于 */
        static ltFun(cond1: ConditionFun, cond2: ConditionFun, ...args: any[]) {
            let result1 = cond1.apply(null, args);
            let result2 = cond2.apply(null, args);
            return result1 < result2;
        }

        /** 小于等于 */
        static lteFun(cond1: ConditionFun, cond2: ConditionFun, ...args: any[]) {
            let result1 = cond1.apply(null, args);
            let result2 = cond2.apply(null, args);
            return result1 == result2;
        }

        /** 直接返回处理结果 */
        static resultFun(cond: ConditionFun, ...args: any[]) {
            return cond.apply(null, args);
        }

        /** 返回制定类型的一个条件 */
        static getConditon(type: ConditionType, condis: ConditionFun[]): ConditionFun {
            switch (type) {
                case ConditionType.false:
                    return this.getDefaultTrueFun();
                case ConditionType.true:
                    return this.getDefaultTrueFun();

                //逻辑表达式
                case ConditionType.not:
                    //非只针对一个条件
                    return this.curry(this.resultNotFun, null, [condis[0]]);
                case ConditionType.and:
                    return this.curry(this.resultAndFun, null, condis);
                case ConditionType.or:
                    return this.curry(this.resultOrFun, null, condis);
                case ConditionType.xor:
                    return this.curry(this.resultXorFun, null, [condis[0], condis[1]]);
                case ConditionType.selete:
                    return this.curry(this.selectedFun, null, condis);
                case ConditionType.result:
                    return this.curry(this.resultFun, null, [condis[0]]);

                //条件表达式，两个条件之间的
                case ConditionType.equal:
                    return this.curry(this.equalFun, null, [condis[0], condis[1]]);
                case ConditionType.unequal:
                    return this.curry(this.unequalFun, null, [condis[0], condis[1]]);
                case ConditionType.gt:
                    return this.curry(this.gtFun, null, [condis[0], condis[1]]);
                case ConditionType.gte:
                    return this.curry(this.gteFun, null, [condis[0], condis[1]]);
                case ConditionType.lt:
                    return this.curry(this.ltFun, null, [condis[0], condis[1]]);
                case ConditionType.lte:
                    return this.curry(this.lteFun, null, [condis[0], condis[1]]);
            }
        }

        /** 嵌套条件实现:创建一个复杂的条件树 */
        static createConditionTree(datas: BaseConditionNode) {
            let type = datas.type;
            let nodes = datas.nodes;
            let condis = datas.conditionFuns;
            let resultFun = [];
            //目前还是以综合条件展开：即当前条件列表里的条件和子节点的条件一起以type类型条件
            if (nodes && nodes.length) {
                for (let i = 0; i < nodes.length; i++) {
                    // nodes[i].root = datas;
                    let fun = this.createConditionTree(nodes[i]);
                    resultFun.push(fun);//创建子节点
                }
            }

            //用返回的条件和当前的条件合并成一个大条件：
            let lastFun = this.getConditon(type, resultFun.concat(condis));
            return lastFun;
        }


        /****************************************以下为正规函数式编程****************************************** */
        /*
          看完了简单的函数式编程的介绍很迷，有很多过于深入的东西：
          函数式编程：范畴学
          深入概念：
            map，join，functor，Maybe，Either，monad，chain

            高阶函数，尾递归
            注：虽然深入了解一下，但还是深入复杂的操作，还是有点不太理解；
        */
        //一些数组高阶实现：
        //投影函数：函数应用于一个值并创建一个新值的过程，成为“投影”；
        /** map：遍历所有，生成新数组结果 */
        static map(array:any[],fn?:OneParmFun<any,any>){
            let results = [];
            if(!fn) fn = x => x;
            for(const value of array) results.push(fn(value));
            return results;
        }
        /** filter：过滤 */
        static filter(array:any[],fn?:OneParmFun<any,boolean>){
            let results = [];
            if(!fn) fn = x => true;
            for(const value of array) (fn(value))?results.push(value):undefined;
            return results;
        }
        //连接操作
        /** contentAll：连接数组内所有数组（展开） */
        static contentAll(array:any[],fn?:OneParmFun<any,boolean>){
            let results = [];
            if(!fn) fn = x => x;
            for(const value of array) results.push.apply(results,value);
            return results;
        }
        /** reduce:累加器（组合） */
        static reduce(array:any[],fn?:TwoParmFun<any,any,any>,initialValue?:any){
            let accumlator = (initialValue !== undefined)?initialValue:array[0];
            if(!fn) fn = (x,y) => x+y;
            if(initialValue === undefined)
                for(let i=1;i<array.length;i++) accumlator = fn(accumlator,array[i]);
            else 
                for(const value of array) accumlator = fn(accumlator,value);

            return [accumlator];
        }
        /** zip：合并两个数组 */
        static zip(leftArr:any[],rightArr:any[],fn){
            let index,results = [];
            for(index = 0;index<Math.min(leftArr.length,rightArr.length);index++)
                results.push(fn(leftArr[index],rightArr[index]));

            return results;
        }

        /** 
         * 函数柯里化（简单实现）
         * 
         * 类似数学的交换率：
         *  只传递给函数一部分参数来调用它，
         *  让它返回一个函数去处理剩下的参数
         * 
         * 实质的函数式编程，不应该绑定环境constext
         */
        static curry(fn: Function, constext, ...arg) {
            let all = arg;
            return (...rest) => {
                all.push(...rest);
                return fn.apply(constext, all);
            }
        }

        /** 函数柯里化2:需要满足参数个数才执行函数，否则，一直返回柯里化函数 */
        static curry2(fn, ...arg) {
            let all = arg || [],
                length = fn.length;
            return (...rest) => {
                let _args = all.slice(0); //拷贝新的all，避免改动公有的all属性，导致多次调用_args.length出错
                _args.push(...rest);
                if (_args.length < length) {
                    return this.curry2.call(this, fn, ..._args);
                } else {
                    return fn.apply(this, _args);
                }
            }
        }

        /** 函数柯里化3：参数不确定时，只要输入参数继续柯里化，否则执行最终的函数 */
        static curry3(fn, ...arg) {
            let all = arg || [],
                length = fn.length;
            return (...rest) => {
                let _args = all;
                _args.push(...rest);
                if (rest.length === 0) {
                    all = [];
                    return fn.apply(this, _args);
                } else {
                    return this.curry3.call(this, fn, ..._args);
                }
            }
        }

        //偏函数：偏函数应用，可以实现任意位置的参数柯里化,忽略位置用undefined占位；
        static partial(fn, ...partialArgs) {
            // var _ = {};
            // var args = [].slice.call(arguments, 1);
            var args = partialArgs;
            return function () {
                var position = 0, len = args.length;
                // for (var i = 0; i < len; i++) {
                //     args[i] = args[i] === _ ? arguments[position++] : args[i]
                // }
                // while (position < arguments.length) args.push(arguments[position++]);
                for (let i = 0; i < len && position < arguments.length; i++) {
                    if(args[i] === undefined) {
                        args[i] = arguments[position++];
                    }
                }
                return fn.apply(null, args);
            };
        }

        //同一性（id函数）：
        /**
         * identity函数
         * 
         * 返回自身结果，可用于组合中的位置测试用，
         * 将identity添加到数据流中可能可能出错的地方，打印接收到的输入参数。
         * @param x 
         */
        static identity(x){
            // console.log("identity:",x);
            return x;
        }

        //可缓存性（cacheable/momoize）
        /**
         * 返回f()的带有记忆功能的版本
         * 只有当f()的实参的字符串表示都不相同它才会工作
         * 增加空间复杂度，减少时间复杂度
         */
        static memorize(fn: (...args) => any) {
            let cache = Object.create(null); //将值保存在闭包内  【有内存泄漏风险】
            return function (...args) {
                //将实参转换为字符串形式，并将其用做缓存的键
                // var key = arguments.length + Array.prototype.join.call(arguments, ",");
                let key = args.join("-");
                if (key in cache) return cache[key];
                else return cache[key] = fn.apply(this, arguments);
            };
        }

        //组合/管道（compose）
        /*
        Unix的部分概念：
        1.每个程序只做好一件事情。为了完成一项新的人物，重新构建要好于在复杂的旧程序中添加新“属性”。
        2.每个程序的输出应该是另一个尚未可知的程序的输入。
        3.每一个基础函数都需要接受一个参数并返回数据。

        组合，管道的思想就是基于Unix的概念;

        组合满足结合律：compose(f,compose(g,h))==compose(compose(f,g),h)
        */
        /**
         * 组合多个函数
         * 
         * 其数据流的运行顺序：从右到左；
         * 注：遇到复杂函数之间组合，可以使用柯里化，偏函数使其参数一致，化为一元函数式；
         */
        static compose(...fns:OneParmFun<any,any>[]) {
                return (value) =>
                    this.reduce(fns.reverse(),(acc,fn)=>fn(acc),value);
        }
        /**
         * 管道
         * 
         * 其数据流的运行顺序：从左到右（Unix风格）；
         */
        static pipe(...fns:OneParmFun<any,any>[]) {
            return (value) =>
                this.reduce(fns,(acc,fn)=>fn(acc),value);
        }

        

        //实现一个复杂的条件树（还没想好）：
        // let tree:BaseConditionNode;//根节点树
        // let cacheCNodes:BaseConditionNode[] = [];//缓存节点池
        // /** 创建一个条件节点 */
        // static createConditionNode(type:ConditionType,root:BaseConditionNode) {
        //     let node:BaseConditionNode;
        //     if(cacheCNodes.length) {
        //         node = cacheCNodes.shift();
        //         node = initNode(node,type,root);
        //     } else {
        //         node = {
        //             /** 类型 */
        //             type:type,
        //             /** 当前的节点 */
        //             nodes:[],
        //             /** 当前节点的条件 */
        //             conditionFuns:[],
        //             /** 当前节点的父节点 */
        //             root:root
        //         };
        //     }
        //     return node;
        // }
        // static initNode(node:BaseConditionNode,type:ConditionType,root:BaseConditionNode) {
        //     node.root = root;
        //     node.type = type;
        //     node.nodes = [];
        //     node.conditionFuns = [];
        //     return node;
        // }

        //嵌合条件数据结构：
        // let data:BaseConditionNode = {
        //     type:ConditionType.and,
        //     conditionFuns:[],
        //     nodes:[
        //         {
        //             type:ConditionType.and,
        //             conditionFuns:[],
        //             nodes:[                       
        //             ]
        //         },
        //         {
        //             type:ConditionType.and,
        //             conditionFuns:[],
        //             nodes:[                     
        //             ]
        //         }
        //     ]
        // };
    }

    //函数式编程的错误处理：函子（funtor）
    /*
        函子的定义：
            函子是一个普遍对象（在其他语言中，可能是一个类），它实现了map函数，在遍历每个对象值的时候生成一个新对象。
    
        函子的概念：
        函子是函数式编程里面最重要的数据类型，也是基本的运算单位和功能单位。
        它首先是一种范畴，也就是说，是一个容器，包含了值和变形关系。比较特殊的是，它的变形关系可以依次作用于每一个值，将当前容器变形成另一个容器。
        一般约定，函子的标志就是容器具有map方法。该方法将容器里面的每一个值，映射到另一个容器。

        函数式编程里面的运算，都是通过函子完成，即运算不直接针对值，而是针对这个值的容器----函子。
        函子本身具有对外接口（map方法），各种函数就是运算符，通过接口接入容器，引发容器里面的值的变形。
        学习函数式编程，实际上就是学习函子的各种运算。由于可以把运算方法封装在函子里面，所以又衍生出各种不同类型的函子，有多少种运算，就有多少种函子。
        函数式编程就变成了运用不同的函子，解决实际问题。

        函子：
        1.函子是一个持有值得容器。
        2.函子实现了map方法，即对该容器的值的处理方法，处理后会生成一个新的函子，允许链式操作。

    */

    /** 
     * 函子：
     * 一个持有值的普通对象；
     * 实现了map接口，在遍历每个对象值得时候生成一个新的对象
     */
    interface Functor {
        // new (value:any):Functor;
        /** 持有的值 */
        value:any;
        /**
         * map函数
         */
        map:OneParmFun<OneParmFun<any,any>,Functor>;
    }

    /** 基础函子，实现map接口 */
    export class Container implements Functor {
        value:any;

        constructor(val:any){
            this.value = val;
        }

        map(fn:OneParmFun<any,any>){
            return new Container(fn(this.value));
        }
        // map:OneParmFun<OneParmFun<any,any>,Functor>;

        // /**
        //  * 可以实现map之间的嵌套
        //  */
        // join(){
        //     return this.value;
        // }

        // /** 简化获取 */
        // chain(){

        // }
    }

    /**
     * Pointed函子
     * 
     * 函子的子集，实现了of接口；
     * 函数式编程一般约定，函子有一个of方法，用来生成新的容器。
     * 常用：MayBe,Either...
     */
    export class Pointed extends Container {
        
        map(fn:OneParmFun<any,any>){
            return Pointed.of(fn(this.value));
        }

        /** join方法： */
        join() {
            return this.value;
        }

        /**
         * of函数，创建新的函子
         */
        static of(val:any){
            return new this(val);
        }
    }

    /**
     * MayBe函子
     * 
     * 可以简单，防止null，undefined错误导致运行过程错误，一种对错误处理的方式（忽视错误）；
     * MayBe的map，会在传入的函数之前先进行isNothing函数检查容器值；
     * 该方式的错误不会抛出异常；
     */
    export class MayBe extends Pointed {
        /**
         * 检查值是否null，undefined
         */
        isNothing(){
            return (this.value === null || this.value === undefined);
        }

        map(fn:OneParmFun<any,any>){
            return this.isNothing()? MayBe.of(null) : MayBe.of(fn(this.value));
        }

        // join(){
        //     return this.isNothing()? MayBe.of(null) : this.value;
        // }
    }

    //函数式编程的对错误处理方式：
    /*
    Either函数：
        即使用Nothing，Some两个抽象子类，利用Nothing短路特性来进行错误处理，Some则正常执行；

        以下实现用left，right（下面使用value表示）；
        left为错误处理的默认值，right为执行正确的值；
        因此，可以视为一个左边提供默认值的函数使用；

    阮一峰函数式编程入门教程:
        条件运算if...else是最常见的运算之一，函数式编程里面，使用 Either 函子表达。
        Either 函子内部有两个值：左值（Left）和右值（Right）。右值是正常情况下使用的值，左值是右值不存在时使用的默认值。
        Either 函子的常见用途是提供默认值。
        Either 函子的另一个用途是代替try...catch，使用左值表示错误。
    */
    export class Either implements Container {
        left: any;
        value;//right的值

        constructor(left: any, right: any) {
            this.left = left;
            this.value = right;
        }

        map(fn: OneParmFun<any, any>) {
            return this.value ?
                Either.of(this.left, fn(this.value)) :
                Either.of(fn(this.left), this.value);
        }

        /**
         * of函数，创建新的函子
         */
        static of(left, right) {
            return new Either(left, right);
        };
    }

    /** 
     * 其map只返回自身，不能运行函数；
     * 其自身会引起链式执行的短路；
     */
    export class Nothing extends Pointed{
        map(fn:OneParmFun<any,any>){
            return this;
        }
    }
    /** 可以在这里运行函数 */
    export class Some extends Pointed{}
    /** Either错误处理 */
    export class Either2 extends Pointed {
        map(fn:OneParmFun<any,any>){
            // return Either2.of(fn(this.value));
            let result:Pointed;
            try{
                result = Either2.of(fn(this.value));
            }catch(err){
                result = Nothing.of({message:"Nothing错误截取："+this.value,errorCode:err});//err['statusCode']
            }
            return result;
        }
        // /**
        //  * of函数，创建新的函子
        //  */
        // static of(val:any){
        //     let result:Pointed;
        //     try{
        //         result = new Either2(val);
        //     }catch(err){
        //         result = Nothing.of({message:"Nothing错误截取："+val,errorCode:err['statusCode']});
        //     }
        //     return result;
        // }
    }

    /**
     * Monad 函子
     * 
     * 实现了chain方法；
     * 
     * 函子是一个容器，可以包含任何值。函子之中再包含一个函子，也是完全合法的。但是，这样就会出现多层嵌套的函子。
     * Monad 函子的作用是，总是返回一个单层的函子。
     * 它有一个flatMap（chain）方法，与map方法作用相同，唯一的区别是如果生成了一个嵌套函子，它会取出后者内部的值，保证返回的永远是一个单层的容器，不会出现嵌套的情况。
     */
    export class Monad extends Pointed {
        // value:Pointed;

        constructor(val:Pointed){
            super(val);
            // this.value = val;
        }

        map(fn:OneParmFun<any,Monad>){
            return Monad.of(fn(this.value));
        }

        /**
         * join方法：
         * 
         * join方法保证了flatMap（chain）方法总是返回一个单层的函子。这意味着嵌套的函子会被铺平（flatten）。
         */
        join() {
            return this.value;
        }

        /**
         * chain方法
         * 
         * 返回的永远是一个单层的容器,将嵌套函子铺平;
         * 是一种简化map(f).join的操作;
         * @param fn 
         */
        chain(fn:OneParmFun<any,Monad>):Monad {
            return this.map(fn).join();
        }
        // flatMap(fn:OneParmFun<any,any>) {
        //     return this.map(fn).join();
        // }
    }


    /**
     * ap 函子
     * 
     * 实现了ap方法的函子。
     * 函子里面包含的值，完全可能是函数。我们可以想象这样一种情况，一个函子的值是数值，另一个函子的值是函数。
     */
    export class Ap extends Pointed {
        constructor(val:Function){
            super(val);
        }

        /**
         * ap方法
         * 
         * ap 函子的意义在于，对于那些多参数的函数，就可以从多个容器之中取值，实现函子的链式操作。
         * 即把一个函数的赋参数，变成，ap函子连续的链式操作。
         * @param f ap方法的参数不是函数，而是另一个函子
         */
        ap(f:Container) {
            return Ap.of(this.value(f.value));
        }

        /**
         * of函数，创建新的函子
         */
        static of(val:any){
            return new this(val);
        }
    }


    /** 条件类型 */
    export const enum ConditionType {
        false,
        true,

        //逻辑表达式
        not,
        and,
        or,
        xor,

        //条件表达式
        equal,
        unequal,
        gt,
        gte,
        lt,
        lte,
        /** 任意 */
        Infinity,
        /** 无 */
        NaN,

        /** 选择其中一项 */
        selete,
        /** 默认全执行，并返回1 */
        all,
        /** 返回一个结果 */
        result,
    }

    /** 条件方法(扩展1：返回数字可以扩展更多功能/...扩展2：直接什么都能返回) */
    export type ConditionFun = (...condis: any[]) => any;

    /** 基础条件树（实现起来好复杂） */
    export interface BaseConditionNode {
        /** 类型 */
        type: ConditionType;
        /** 当前节点的条件 */
        conditionFuns: ConditionFun[];

        //为条件补充参数(暂时无用)
        /** 参数列表 */
        args?: any[];
        /** 绑定作用域 */
        thisObj?: any;

        //暂时不做树节点操作
        /** 当前的节点（若没有，则为叶子节点） */
        nodes?: BaseConditionNode[];
        /** 当前节点的父节点(执行时自动绑定,若没有则为根节点) */
        root?: BaseConditionNode;
    }

    // /** 条件表达式的类型（无用，统一到条件类型里去了） */
    // const enum CondExpreType {
    //     equal,
    //     unequal,
    //     gt,
    //     gte,
    //     lt,
    //     lte,
    //     Infinity,
    //     NaN,
    // }
}

// (function() {
//     //测试组合用：
//     // let ss = (str:string) => str.split(" ");
//     // let count = (array:any[]) => array.length;
//     // let oddOrEven = (ip) => ip%2==0?"even":"odd";
//     // const countWords = NG.FunctionUtil.compose(count,ss);

//     // let strs = "hello your reading about composition";
//     // console.log("输出单词数：",countWords(strs));

//     //测试MayBe
//     let result = NG.MayBe.of("George")
//             .map((x:string) => x.toUpperCase())
//             .map(x=>undefined)
//             .map(x => "Mr. " + x);
//     console.log("MayBe最终输出结果：",result);
    
//     //测试Either，目前需要自己搭建一个
//     let result2 = NG.Either.of("结果为空","George222222abc")
//             .map((x:string) => x.toUpperCase())
//             .map(x=>undefined)
//             .map(x => "Mr. " + x);
//     console.log("Either最终输出结果2：",result2);
//     //测试错误截取
//     let result3 = NG.Either2.of("George33333")
//             // .map(x=>undefined)
//             .map((x:string) => x.toUpperCase())
//             .map(x => "Mr. " + x);
//     console.log("Either2最终输出结果3：",result3);

//     //测试Monad函子

//     //测试Ap函数：
//     function add(x) {
//         return function (y) {
//             return x + y;
//         };
//     }  
//     // let result4 = NG.Ap.of(add)
//     //     .ap(NG.MayBe.of(2))
//     //     .ap(NG.MayBe.of(3));
//     let result4 = NG.Ap.of(add(2)).ap(NG.MayBe.of(3));
//     console.log("Ap函数最终输出结果4：",result4);
// })();