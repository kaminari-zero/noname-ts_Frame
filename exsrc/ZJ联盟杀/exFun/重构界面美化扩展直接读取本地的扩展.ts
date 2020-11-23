// @ts-nocheck 不需要严格得语法检查错误
module ZJNGEx {
  (function () {
    NG.Utils.importCurContent(this.ZJNGEx, "重构界面美化扩展直接读取本地的扩展", NG.ImportFumType.run,

      function (lib: Lib, game: Game, ui: UI, get: Get, ai: AI, _status: Status) {

        //目前，界面优化扩展 ，和十周年直接有冲突，和蜀汉中兴UI有点冲突
        // 覆盖配置，放在 内部加载游戏配置.ts 中处理；

        //采用自动加载本地预配置好的扩展
        let loadExtensionConfig = window.loadExtensionConfig || lib.config.loadExtensionConfig;
        if (Array.isArray(loadExtensionConfig)) {
          if (loadExtensionConfig.contains("界面美化")) {
            if (typeof game.getFileList != 'function') {
              app.loadPlugins = function (callback) {
                //为了网页版也能测试：
                // callback();
                //手动导入所有尝试下：
                var allPlugins = ["animate", "card", "character", "dialog", "lbtn", "skill"];
                var total = allPlugins.length;
                var current = 0;
                if (total === current) {
                  callback();
                  return;
                }
                var loaded = function () {
                  if (++current === total) {
                    callback();
                  }
                };
                for (let i = 0; i < allPlugins.length; i++) {
                  const element = allPlugins[i];
                  lib.init.js(lib.assetURL + 'extension/' + app.name + '/' + element + '/main.js', null, function () {
                    loaded();
                  }, function (e) {
                    console.info(e);
                    loaded();
                  })
                }
              }
            }
            // 若有，则走原本的逻辑
          }
        }


        return null;
      });
  })();
}