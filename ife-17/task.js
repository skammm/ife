
/**
 * Created by hansneil on 21/3/16.
 * ife任务17
 */
/* 数据格式演示
 var aqiSourceData = {
 "北京": {
 "2016-01-01": 10,
 "2016-01-02": 10,
 "2016-01-03": 10,
 "2016-01-04": 10
 }
 };
 */


//以下两个函数用于随机模拟生成测试数据
function getDate(dat){
  var y = dat.getFullYear();
  var m = dat.getMonth() + 1;
  m = m < 10 ? '0' + m : m;
  var d = dat.getDate();
  d = d < 10 ? '0' + d : d;
  return y + '-' + m + '-' + d;
}
function chartDay(seed){
  var returnObj = {};
  var dat = new Date('2019-01-01');
  for(var i=0;i<90;i++){
      var getDat  = getDate(dat);
      returnObj[getDat] = Math.floor(Math.random()*seed)*7+20;
      dat.setDate(dat.getDate() + 1);
  }
  return returnObj;

}
var colors = ['#16324a', '#24385e', '#393f65', '#4e4a67', '#5a4563', '#b38e95',
            '#edae9e', '#c1b9c2', '#bec3cb', '#9ea7bb', '#99b4ce', '#d7f0f8'];
var chartDayData = {
  '北京':chartDay(10),
  '天津':chartDay(80),
  '厦门':chartDay(20),
  '上海':chartDay(60),
  '杭州':chartDay(30),
  '丽水':chartDay(40),
  '嘉兴':chartDay(30),
  '郑州':chartDay(70),
}
function getWidth(width, len) {
  var posObj = {};
  posObj.width = Math.floor(width / (len*2));
  posObj.left = Math.floor(width / len);
  posObj.offsetLeft = (width - posObj.left * (len - 1) - posObj.width) / 2;
  return posObj;
}

function getHintLfeft(posObj, i){
  if (posObj.left * i + posObj.offsetLeft + posObj.width / 2 - 60 <= 0) {
      return 5;
  } else if (posObj.left * i + posObj.offsetLeft + posObj.width / 2 + 60 >= 1200) {
      return (posObj.left * i + posObj.offsetLeft + posObj.width / 2 - 110);
  } else  {
      return (posObj.left * i + posObj.offsetLeft + posObj.width / 2 - 60);
  }
}

function getTitle() {
  switch (pageState.nowGraTime) {
      case "day":
          return "每日";
      case "week":
          return "周平均";
      case "month":
          return "月平均";
  }
}

/**
* addEventHandler方法
* 跨浏览器实现事件绑定
*/
function addEventHandler(ele, event, hanlder) {
  if (ele.addEventListener) {
      ele.addEventListener(event, hanlder, false);
  } else if (ele.attachEvent) {
      ele.attachEvent("on"+event, hanlder);
  } else  {
      ele["on" + event] = hanlder;
  }
}
var chartData={};
var pageState = {
  nowSelectCity: '北京',
  nowGraTime: "day"
}
function initGraTimeForm(){
  var span = document.querySelectorAll('span');
  for(var i=0;i<span.length;i++){
      span[i].onclick = function(){
          for(var i = 0;i<span.length;i++){
              span[i].className='';
          }
          this.className = 'selected';
          pageState.nowGraTime = this.nextElementSibling.value;
          render();
      }
  }
}
function initCitySelector(){
  var select = document.getElementById('city-select');
  
  var option = '';
  for(city in chartDayData){
      option += `<option>${city}</option>`;
  }
  select.innerHTML = option;  
  select.onclick = function(){
      var index = select.selectedIndex;　　　　　　　
      var day = select.options[index].value;
      if(day!==pageState.nowSelectCity){
          pageState.nowSelectCity = day;
          render();
      }
  }
  
}
function render() {
  var innerHTML = "", i = 0;
  var wrapper = document.getElementById("aqi-chart-wrap");
  var width = wrapper.clientWidth;
  var selectedData = chartData[pageState.nowGraTime][pageState.nowSelectCity];
  var len = Object.keys(selectedData).length;
  var posObj = getWidth(width, len);
  innerHTML += "<div class='title'>" + pageState.nowSelectCity + "市01-03月"+ getTitle() +"空气质量报告</div>"
  for (var key in selectedData) {
      innerHTML += "<div class='aqi-bar " + pageState.nowGraTime + "' style='height:" + selectedData[key] + "px; width: " + posObj.width +"px; left:" + (posObj.left * i + posObj.offsetLeft) + "px; background-color:" + colors[Math.floor(Math.random() * 11)] + "'></div>"
      innerHTML += "<div class='aqi-hint' style='bottom: " + (selectedData[key] + 10) + "px; left:" + getHintLfeft(posObj, i++) + "px'>" + key + "<br/> [AQI]: " + selectedData[key] + "</div>"
  }
  wrapper.innerHTML = '<img src="x23.jpg" id="img">'+innerHTML;
  var bar = document.querySelectorAll('.aqi-bar');

  for(var i = 0;i<bar.length;i++){
      bar[i].onmouseover = function(){
          this.classList.add('show');
      }
      bar[i].onmouseout = function(){
          this.classList.remove('show');
      }
  }
}
function initAqiChartData(){
  var month = {},week = {};
  var singleMonth={},singleWeek={};
  var monthCount = 0,weekCount=0,mcount=0,wcount = 0,weekNum=0;
  for(city in chartDayData){
      var day = chartDayData[city];
      var preEveryMonth = '';
      for(p in day){
          mcount+=1;
          wcount += 1;
          weekNum += 1;
         
          monthCount+=day[p];
          weekCount+=day[p];
          var everyMonth = p.slice(0,7);
         
          
          if(weekNum%7===0||everyMonth !== preEveryMonth){
              if(everyWeek !== undefined){
                  singleWeek[everyWeek] = Math.floor(weekCount/wcount);
                  wcount = 0;
                  weekCount = 0;
              }           
          }
          var everyWeek = p.slice(5,7)+'月第'+Math.ceil(weekNum/7)+'周';
          if(everyMonth !== preEveryMonth){
              singleMonth[everyMonth] =Math.floor( monthCount/mcount);
              monthCount = 0;
              mcount = 0;
              weekNum=0;
          }
          preEveryMonth = everyMonth;
          

      }
      month[city] = singleMonth;
      week[city] = singleWeek;
  }
  chartData['day'] = chartDayData;
  chartData['week'] = week;
  chartData['month'] = month;


  render();
}
/**
 *初始化函数
*/
function init() {
  initGraTimeForm();
  initCitySelector();
  initAqiChartData();
}
init();






