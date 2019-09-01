function date_time(timestamp) {
  var date = new Date(timestamp);
  var Y = date.getFullYear() + '-';
  var M = (date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1) + '-';
  var D = date.getDate() + ' ';
  var h = date.getHours() + ':';
  var m = date.getMinutes() + ':';
  var s = date.getSeconds();
  var time = Y + M + D + h + m + s;
  return time;
} 
//获取倒计时数据
function getTime(time, fun) {
  //time:标准时间    2017/1/5 1:0:0
  //var EndTime= new Date(time);      //截止时间
  var EndTime = time;
  //console.log("endtime", EndTime);
  var self        = this;
  this.getDiff    = function() {
    return EndTime - new Date().getTime();
  }
  this.getDay     = function() {
    return Math.floor(self.getDiff() / 1000 / 60 / 60 / 24);
  }
  this.getHours   = function() {
    return Math.floor(self.getDiff() / 1000 / 60 / 60 % 24);
  }
  this.getMinutes = function() {
    return Math.floor(self.getDiff() / 1000 / 60 % 60);
  }
  this.getSeconds = function() {
    return Math.floor(self.getDiff() / 1000 % 60);
  }
  this.getDate    = function() {
    var data    = {};
    data.day    = self.getDay();
    data.hour   = self.getHours() + 24 * data.day;
    data.minute = self.getMinutes();
    data.second = self.getSeconds();
    return data;
  }
}

// 抽屉详情属性str => array
function Tap(input) {
  var arr = [], arrayStr = JSON.parse(input);
  arrayStr.forEach(function(value) {
    var obj = {value: []};
    for(var key in value) {
      switch(key) {
        case "name":
          obj.name = value[key];
          break;
        case "code":
          obj.ano = value[key];
          break;
        default:
          obj.value.push(value[key]);
      }
    }
    arr.push(obj);
  })
  return arr;
}

function strToArray(input) {
  if(!input) {
    return [];
  } else {
    var arr = input.split(",")
    return arr;
  }

}
function toString(input) {
  return Object.prototype.toString.call(input);
}
function objLength(input) {
  var type   = toString(input);
  var length = 0;
  if(type != "[object Object]") {
    //throw "输入必须为对象{}！"
  } else {
    for(var key in input) {
      if(key != "number") {
        length++;
      }

    }
  }
  return length;
}
function getAddress(o) {
  this.initObj = function() {
    var pro = {
      province: [],
      city: [],
      area: []
    };
    o.forEach(function(value) {
      pro.province.push(value.name);
    });
    o[0].childrenList.forEach(function(value) {
      pro.city.push(value.name);
    });
    o[0].childrenList[0].childrenList.forEach(function(value) {
      pro.area.push(value.name);
    });
    return this.address = pro;
    ;
  }
  this.setCity = function(p, c) {
    var obj = {
      province: this.address.province,
      city: [],
      area: []
    };
    o[p].childrenList.forEach(function(val) {
      obj.city.push(val.name);
    });
    o[p].childrenList[c].childrenList.forEach(function(val) {
      obj.area.push(val.name);
    });
    return obj;
  }
}
function alert(des){
  var self = this;
  self.setData({
    warning: true,
    warnDes: des
  });
  setTimeout(function() {
    self.setData({
      warning: false,
    })
  }, 1000);
}
module.exports = {
  getTime: getTime,
  Tap: Tap,
  strToArray: strToArray,
  objLength: objLength,
  getAddress: getAddress,
  date_time: date_time,
  alert: alert
}

// module.exports = {
//   getSearchMusic: getSearchMusic
// }
