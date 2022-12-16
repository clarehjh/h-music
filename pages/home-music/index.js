// pages/home-music/index.js
import { rankingStore,rankingMap } from '../../store/index'

import { getBanners,getSongMenu  } from '../../service/api_music'
import queryRect from '../../utils/query-rect'
import throttle from '../../utils/throttle'

const throttleQueryRect=throttle(queryRect,1000,{trailing:true})
Page({

  /**
   * 页面的初始数据
   */
  data: {
    banners:[],
    swiperHeight:0,
    recommendSongs: [],
    hotSongMenu:[],
    recommendSongMenu:[],
    rankings:{0:{},2:{},3:{}}

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
   this.getPageData()
    // 发起共享数据的请求
       rankingStore.dispatch("getRankingDataAction")

  //  // 从store获取共享的数据
    rankingStore.onState("hotRanking", (res) => {
         if (!res.tracks) return
         const recommendSongs = res.tracks.slice(0, 6)
         this.setData({ recommendSongs })
    })
    rankingStore.onState("newRanking", this.getRankingHandler(0))
    rankingStore.onState("originRanking", this.getRankingHandler(2))
    rankingStore.onState("upRanking", this.getRankingHandler(3))

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
getSongMenu().then(res => {
  this.setData({ hotSongMenu: res.playlists })
})

getSongMenu("华语").then(res => {
  this.setData({ recommendSongMenu: res.playlists })
})
  },

  handleSwiperImageLoaded(){
    //获取图片的高度（获取该图片组件高度）
    throttleQueryRect(".swiper-image").then(res=>{
      const rect=res[0]
      this.setData({swiperHeight:rect.height})
    })
  },

  //巅峰榜单
  getRankingHandler(idx){
    return(res)=>{
      if(Object.keys(res).length===0) return
      console.log(idx,res)
      const name = res.name
      const coverImgUrl = res.coverImgUrl
      const playCount = res.playCount
      const songList = res.tracks.slice(0, 3)
      const rankingObj = {name, coverImgUrl, playCount, songList}
      const newRankings = { ...this.data.rankings, [idx]: rankingObj}
      this.setData({ 
        rankings: newRankings
      })
    }
  },
  handleMoreClick: function() {
    this.navigateToDetailSongsPage("hotRanking")
  },

  handleRankingItemClick: function(event) {
    const idx = event.currentTarget.dataset.idx
    const rankingName = rankingMap[idx]
    this.navigateToDetailSongsPage(rankingName)
  },

  navigateToDetailSongsPage: function(rankingName) {
    wx.navigateTo({
      url: `/pages/detail-songs/index?ranking=${rankingName}&type=rank`,
    })
  },


})

