# noname-ts_Frame
 无名杀，ts开发框架

 # 开始准备
### 一，开发环境：vscode+js+ts+h5
### 二，测试环境：chrome

```
使用vscode的Debugger for Chrome插件进行调试。

配置：
{
    "version": "0.2.0",
    "configurations": [
        {
            "type": "chrome",
            "request": "launch",
            "name": "Launch Chrome against localhost",
            "webRoot": "${workspaceFolder}",
            "file": "${workspaceFolder}/index.html"
        }
    ]
}
```
### 三，将game.js变成第三方库，提供代码提示的.d.ts
需要进行的准备：
1. 一个最新的vscode，内部提供最新的es.d.ts,ts的语法提示
2. 如果需要手动暴露内部对象，可以修改game.js。
 内部通过lib.cheat.i();已经把对象导出了，不过要启动这个方法，需要满足某些情况，通常情况下这些对象都是不暴露的，不过game对象一直暴露出来。
不推荐暴露这些对象，还是按照游戏原有逻辑走，需要快捷调试时，可以考虑直接暴露（不过非常多余，内部准备了暴露这些对象的方式... ...）
```
//需要使用let，let不会暴露到全局window内，var会自动绑定到全局window内
let NonameGame;
(function(nonameGame){
    ... ... 游戏的原代码不用动
    
    //增加：
	nonameGame.status=_status;
	nonameGame.lib=lib;
	nonameGame.game=game;
	nonameGame.ui=ui;
	nonameGame.get=get;
	nonameGame.ai=ai;

	//==============自定义方法===============
	nonameGame.refreshGame = function(){
		this.lib.init.init();
	}
})(NonameGame);

注：已经放弃了该方式了，内部采用更加直接的方式暴露游戏对象，目的是为了方便开发测试，即使联机的情况下也可以使用命令调试（作弊），后续再对这方面屏蔽。
```

3. 导入写好的interface文件夹内的.d.ts文件

### 四，使用typescript编写扩展的准备
1. 安装nodejs，前往
[node.js官网](http://nodejs.cn/download/) 下载nodejs
2. [还是直接上别人安装nodejs和国内镜像站cnpm或者直接装npm的教程就行了](https://www.cnblogs.com/liaojie970/p/9296177.html)。
3. 装好nodejs后，可以使用npm命令，接下来就是在cmd命令行中安装typescript
```
npm install -g typescript
```
4. 增加typescript的编译配置：

- 直接放入tsconfig.json,自己需要创建一个自己的专门放.ts源文件夹
```
tsconfig.json的配置：

{
    "compilerOptions": {
        "target": "es5", //指定ECMAScript目标版本
        "removeComments": true, //删除注释
        "experimentalDecorators": true, //启用实验性的ES装饰器。
        "emitDecoratorMetadata": true, //给源码里的装饰器声明加上设计类型元数据
        // "preserveConstEnums": true, //保留 const和 enum声明
        // "outFile": "./build/extension.js", //编译后输出的文件，输出文件合并成一个指定js，为了方便，集中编译在一起，
        "outFile":"./build/exsrc/ZJ联盟杀/extension.js", //才用这种方式指定输出到一个指定文件夹内（下面include也要对应改）
        // "outFile":"./build/exsrc/加载测试扩展/extension.js", //才用这种方式指定输出到一个指定文件夹内（下面include也要对应改）
        // "outDir":"./build", //指定编译后文件输出的位置，输出的文件不合并
        // "outDir":"extension", 
        // "sourceRoot": "./exsrc/", //源文件路径
        "sourceMap": true,  //开启这个，可以生成一个map映射文件，可以在ts代码断点，调试时跳到ts代码里
        // "rootDir": "./exsrc/", //根目录（跟sourceRoot一致就行）
        // "noImplicitAny": true, //在表达式和声明上有隐含的 any类型时报错
        // "module": "none",  //模块化的风格，none，CommonJS，AMD......
        //增加这个，即使在es5的情况下，也能调用es6的方法提示（不过不能使用es6新语法，这个用ts代替就行了）
        // "noUnusedParameters":false, //若有未使用的参数则抛错。
        //加上这两个，可以防止lib之间的命名冲突之类的问题无法通过编译
        // "skipLibCheck": true,
        // "allowSyntheticDefaultImports": true,

        "lib": [
            "es5",
            "es2015.core",
			"es2015.collection",
			"es2015.generator",
            "es2015.promise",
			"es2015.iterable",
			"es2015.proxy",
			"es2015.reflect",
			"es2015.symbol",
			"es2015.symbol.wellknown",
            "dom",
			"dom.iterable"
        ]
    },
    //编译目录
    "include": [ 
        "interface",
        "exsrc/Utils",
        
        //这样时编译所有
        // "exsrc/*"
        //采用第二种方式时，需要自己指定编译文件的具体路径：
        "exsrc/ZJ联盟杀"
        // "exsrc/加载测试扩展/*"
    ]
}
```
5. 配置好tsconfig.json后，在vscode的命令控制台内，输入tsc，等待编译结束，若没有错误，编译后的文件生成在配置中指定的outFile或者outDir内。将主要的js文件（暂时还没看执行流程）引入index.html中，例：
(该步骤有很大变化，后续统一补充)
```
<script src="build/build.js"></script>
```
6. 开始typescript编程的准备，由于typescript是js语法的超集，如果学习过es6语法的，会非常简单上手，只需要学习类型声明部分即可，[前往ts的官方文档查看](https://www.tslang.cn/docs/handbook/basic-types.html)。

7. vscode自动编译ts：
    在要自动编译 ts 的目录，要有 tsconfig.json 文件；
    对于 VScode ，点击任务 > 运行任务 > tsc: watch。
    [可前往该博客查看](https://blog.csdn.net/lucky541788/article/details/90706272)

8. 如何使用ts自动语法提示：首先.d.ts的目录放入tsconfig.json的"include"中，目前已经规定好在interface目录里；然后如果需要.d.ts文件里的属性字段互相有提示，目前最好，所有.d.ts声明都放在interface中；（注：.d.ts只是声明文件，若运行的游戏对象中没有该方法，就是没有，和该声明文件的声明没有关系）

9. 关于如何进行游戏调试： 
可上网搜索：**Debugger for Chrome** 的vscode插件，按照后，在vscode启用chorome浏览器调试，进入调试模式运行，可以通过vscode代码里进行断点调试；
(注：该调试只能进行一些固定代码的调试，如果是使用new Function创建的方法代码，无法在代码里直接断点调试，那个要调试只能等报错时，会进入VMxxxx文件时，断点可以进行调试，不过比较麻烦，需要一步步慢慢调)

10. 为了方便，已经在game.js添加了额外的加载方式，用来读取个人定制扩展加载，具体信息请查看test/test.js中注释了解；
---

经过一年断断续续准备，搞好基础.d.ts声明文件，
目前还剩UI，联机这两大大模块暂时还没开始详细的研究。

---

注：TypeScript 2.6支持在.ts文件中通过在报错一行上方使用// @ts-ignore来忽略错误。

// @ts-ignore注释会忽略下一行中产生的所有错误。 建议实践中在@ts-ignore之后添加相关提示，解释忽略了什么错误。

// @ts-nocheck 忽略全文

// @ts-check 取消忽略全文

请注意，这个注释仅会隐藏报错，并且我们建议你 极少使用这一注释。不过可以用于导入别人的js代码时，不想修改成ts版本，可以直接使用// @ts-nocheck，不检测ts代码错误，直接进入编译；
---



