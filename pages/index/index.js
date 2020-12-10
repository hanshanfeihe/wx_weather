// pages/test/test.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    condiImage:{
      100:'./images/100.svg',
      101: './images/101.svg',
      104:'./images/104.svg',
      300:'./images/300.svg',
      305:'./images/305.svg'
    },
    // 生活指数图片
    lifeImage:{
      comf:'./images/comf.svg',
      drsg:'./images/drsg.svg',
      cw:'./images/cw.svg',
      flu:'./images/flu.svg',
      sport:'./images/sport.svg',
      trav:'./images/trav.svg',
      air:'./images/air.svg',
      uv:'./images/uv.svg'
    },
    wd: '15',
    nowWeatherData:{},
    address:'',
    // 未来几个小时天气数据
    hourlyData:[],
    // 未来几天天气数据
    daysData:[],
    // 生活指数
    lifeStyle:[]
  },
  // 获取用户当前经纬度
  getUserLocation(){
    wx.getLocation({
      type:'gcj02',
      success:(res) =>{
        const latitude = res.latitude
        const longitude = res.longitude
        console.log(latitude,longitude);
        // 解析生成用户地址
        this.changeAddress(longitude,latitude)
      }
    })
  },
  // 解析用户地理位置
  changeAddress(x,y){
    wx.request({
      url:'https://restapi.amap.com/v3/geocode/regeo',
      data:{
        location:x+','+y,
        key:'3a81f6323cd645c21c5c362f81dd8211'
      },
      header:{'content-type':'application/json'},
      success:(res) => {
        console.log(res);
        this.setData({
          address:res.data.regeocode.addressComponent.district
        })
        console.log(this.data.address);
        this.getNowWeather()
        this.getWeatherHourly()
        this.getWeatherDay()
        this.getLifeStyle()
      },
      fail:() => {
        console.log('解析失败');
      }
    })
  },
  // 获取实时天气数据
  getNowWeather(){
    wx.request({
      url:'https://free-api.heweather.com/s6/weather/now',
      data:{
        location:this.data.address,
        key:'cc33b9a52d6e48de852477798980b76e'
      },
      header: { 'content-type': 'application/json' },
      success: (res)=>{
        console.log(res.data);
        let nowWea = res.data.HeWeather6[0].now
        let nowData = {
          // 温度
          tmp:nowWea.tmp,
          // 天气状况
          cond_txt:nowWea.cond_txt,
          // 方向
          wind_dir:nowWea.wind_dir,
          // 对应天气图片
          condImg:this.data.condiImage[nowWea.cond_code]
        }
        this.setData({
          nowWeatherData:nowData
        })
      }
    }
      )
  },
  // 获取未来几个小时天气状况
  getWeatherHourly(){
    wx.request({
      url: 'https://free-api.heweather.com/s6/weather/hourly',
      data:{
        location:this.data.address,
        key:'cc33b9a52d6e48de852477798980b76e'
      },
      header:{'content-type':'application/json'},
      success: (res) =>{
        console.log(res.data);
        let hourArray = []
        res.data.HeWeather6[0].hourly.forEach(item => {
          let item1 = {}
          item1.cond_txt = item.cond_txt;
          item1.cond_Img = this.data.condiImage[item.cond_code]
          item1.cloud = item.cloud
          item1.day = item.time.substr(5,2)+'月'+item.time.substr(8,2)+'日',
          item1.hour = item.time.slice(11)
          // 风向
          item1.wind_dir = item.wind_dir
          // 风力
          item1.wind_sc = item.wind_sc
          hourArray.push(item1)
        })
        this.setData({
          hourlyData:hourArray
        })
        // console.log(this.data.hourlyData);
      }
    })
  },
  // 获取未来几天天气数据
  getWeatherDay(){
    wx.request({
      url:'https://free-api.heweather.com/s6/weather/forecast',
      data:{
        location:this.data.address,
        key:'cc33b9a52d6e48de852477798980b76e'
      },
      header:{'content-type':'applicatio/json'},
      success:(res) =>{
        console.log(res.data);
        let dayArray = []
        res.data.HeWeather6[0].daily_forecast.forEach(item => {
          let item1 = {}
          item1.cond_code_d = item.cond_code_d
          item1.cond_txt_d = item.cond_txt_d
          item1.date = item.date.substr(5,2)+'月'+item.date.substr(8,2)+'日'
          item1.wind_dir = item.wind_dir
          item1.wind_sc = item.wind_sc
          item1.tmax = item.tmp_max
          item1.tmin = item.tmp_min
          item1.img = this.data.condiImage[item.cond_code_d]
          dayArray.push(item1)
        })
        this.setData({
          daysData:dayArray
        })
      }
    })
  },
  // 获取生活指数数据
  getLifeStyle(){
    wx.request({
      url:'https://free-api.heweather.com/s6/weather/lifestyle',
      data:{
        location:this.data.address,
        key:'cc33b9a52d6e48de852477798980b76e'
      },
      header:{'content-type':'application/json'},
      success:(res) =>{
        console.log(res.data);
        this.setData({
          lifeStyle:res.data.HeWeather6[0].lifestyle
        })
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getUserLocation()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // console.log(this.data.address);
    let readyObj = {
      cond_txt:'加载中',
      tmp:'加载中',
      wind_dir:'加载中'
    }
    this.setData({
      nowWeatherData:readyObj
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    // console.log(this.data.address);
    // this.getNowWeather()
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.onLoad()
    wx.stopPullDownRefresh()
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})