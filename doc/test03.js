var http = require("http");


var opt = {
  host: 'yw-fed-static.oss-cn-hangzhou.aliyuncs.com',
  port: '80',
  method: 'GET',
  path: '/broadcast/sss/sssTest1/demo.json',
  headers: {
    "Content-Type": 'application/json',
  }
}

function getData () {
  return new Promise(function (resolve, reject) {
    var body = '';
    var req = http.request(opt, function (res) {
      res.on('data', function (data) {
        body += data;
      }).on('end', function () {
        setTimeout(() => {
          resolve(body);
        }, 1000);
      });
    })
    req.end();
  })
}

(async () => {
  console.log(111)
  const res = await getData();
  console.log('res', res);
})()