// pages/home-music/index.js
import { getBanners } from '../../service/api_music'
import queryRect from '../../utils/query-rect'
import throttle from '../../utils/throttle'

const throttleQueryRect=throttle(queryRect,1000)
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banners:[],
    swiperHeight:0

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
   this.getPageData()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  },

  handleSearchClick(){
    wx.navigateTo({
      url: '/pages/detail-search/index',
    })
  },

  getPageData(){
getBanners().then(res=>{
   // setData是同步的还是异步的
      // setData在设置data数据上, 是同步的
      // 通过最新的数据对wxml进行渲染, 渲染的过程是异步
      this.setData({ banners: res.banners })

      // react -> setState是异步
      // this.setState({ name: })
      // console.log(this.state.name)
})
  },

  handleSwiperImageLoaded(){
    //获取图片的高度（获取该图片组件高度）
    throttleQueryRect(".swiper-image").then(res=>{
      const rect=res[0]
      this.setData({swiperHeight:rect.height})
    })
  }
})

