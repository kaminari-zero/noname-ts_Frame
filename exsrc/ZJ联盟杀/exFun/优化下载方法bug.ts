// @ts-nocheck 不需要严格得语法检查错误
module ZJNGEx {
    (function () {
        NG.Utils.importCurContent(this.ZJNGEx, "优化下载方法bug", NG.ImportFumType.run,
            //目前能直接扩展的方法大部分都是点开游戏后执行的方法，如果提前执行的，最好不要在这边扩展
            //优化game.download,解决因为某些原因，导致下载被卡住，现在可以最大重复7次尝试下载:
            function (lib: Lib, game: Game, ui: UI, get: Get, ai: AI, _status: Status) {
                if (typeof window.require == 'function') {
                    game.download = function (url, folder, onsuccess, onerror, dev, onprogress) {
                        if (url.indexOf('http') != 0) {
                            url = get.url(dev) + url;
                        }
                        let count_1 = 0;
                        var dir = folder.split('/');
                        game.ensureDirectory(folder, function () {
                            try {
                                var file = lib.node.fs.createWriteStream(__dirname + '/' + folder);
                            }
                            catch (e) {
                                if (onerror)
                                    onerror();
                            }
                            lib.config.brokenFile.add(folder);
                            game.saveConfigValue('brokenFile');
                            if (!lib.node.http)
                                lib.node.http = require('http');
                            if (!lib.node.https)
                                lib.node.https = require('https');
                            var opts = require('url').parse(encodeURI(url));
                            opts.headers = { 'User-Agent': 'AppleWebkit' };
                            var isGetError = false;
                            var request = (url.indexOf('https') == 0 ? lib.node.https : lib.node.http).get(opts, function (response) {
                                var stream = response.pipe(file);
                                stream.on('finish', function () {
                                    lib.config.brokenFile.remove(folder);
                                    game.saveConfigValue('brokenFile');
                                    if (onsuccess) {
                                        onsuccess();
                                    }
                                });
                                stream.on('error', function (e) {
                                    if (onerror)
                                        onerror();
                                });
                                if (onprogress) {
                                    var streamInterval = setInterval(function () {
                                        if (stream.closed) {
                                            clearInterval(streamInterval);
                                        }
                                        else {
                                            onprogress(stream.bytesWritten);
                                        }
                                    }, 200);
                                }
                            });
                            request.addListener('finish', function () {
                            });
                            request.addListener('error', function (e) {
                                isGetError = true;
                            });
                            request.addListener('close', function () { //优化：添加失败可重试次数
                                if (isGetError) {
                                    if (count_1 >= 7) {
                                        if (onerror)
                                            onerror();
                                    }
                                    else {
                                        ++count_1;
                                        game.download(url, folder, onsuccess, onerror, dev, onprogress);
                                    }
                                }

                            });
                        }, true);
                    };
                }
                return null;
            });
    })();
}