var ServerSelector = function (options) {
    var root = this;
    this.vars = {
        percent: null,
        result: null,
        protocol: 'http',
        servers: [],
        remoteFile: 'latency.png'
    };
    this.testqueue = [];
    this.results = [];
    var construct = function (options) {
        Object.assign(root.vars, options);
        root.vars.cacheControl = new Date().getTime();
        [0, 1, 2].forEach(function (server) {
            root.vars.servers.forEach(function (address) {
                root.testqueue.push(address);
            });
        });
        doTest();
    };
    var doTest = function () {
        if (root.testqueue.length) {
            var address = root.testqueue.shift();
            var index = root.vars.servers.indexOf(address);
            if (!root.results[index]) {
                root.results[index] = [];
            }
            testServer(address)
                    .then(function (latency) {
                        root.results[index].push(latency);
                    })
                    .then(function () {
                        if (typeof root.vars.percent === 'function') {
                            root.vars.percent(calcPercent());
                        }
                    })
                    .then(function () {
                        doTest();
                    });
        } else {
            if (typeof root.vars.result === 'function') {
                var result = [];
                root.results.forEach(function (resultset, i) {
                    resultset.sort();
                    result[i] = resultset[1];
                });
                root.vars.result(result.indexOf(Math.min.apply(Math, result)));
            }
        }
    };
    var calcPercent = function () {
        return Math.floor((arrayLength(root.results) / (root.vars.servers.length * 3)) * 100);
    };
    var arrayLength = function (a) {
        var na = flatten(a);
        return na.length;
    };
    var flatten = function (arr) {
        return arr.reduce(function (flat, toFlatten) {
            return flat.concat(Array.isArray(toFlatten) ? flatten(toFlatten) : toFlatten);
        }, []);
    };
    var testServer = function (server) {
        return new Promise(function (resolve, reject) {
            var startTime = new Date();
            get(root.vars.protocol + '://' + server + '/' + root.vars.remoteFile + '?' + startTime.getTime() + startTime.getMilliseconds())
                    .then(function () {
                        var endTime = new Date();
                        resolve(timeDiff(startTime, endTime));
                    });
        });
    };
    var get = function (url) {
        return new Promise(function (resolve, reject) {
            var req = new XMLHttpRequest();
            req.open('GET', url);

            req.onload = function () {
                if (req.status == 200) {
                    resolve(req.response);
                } else {
                    reject(Error(req.statusText));
                }
            };
            req.onerror = function () {
                reject(Error("Network Error"));
            };
            req.send();
        });
    };
    var timeDiff = function (d1, d2) {
        var start = d1.getTime() + '.' + d1.getMilliseconds();
        var end = d2.getTime() + '.' + d2.getMilliseconds();
        return parseFloat(end) - parseFloat(start);
    };
    construct(options);
};
