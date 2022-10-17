// pages/home-video/index.js
import { getTopMVs } from '../../service/video'

Page({
  /**
   * 页面的初始数据
   */
  data: {
    topMVs: [],
    hasMore: true
  },

  /**
   * 生命周期函数--监听页面加载(created)
   * aysnc await
   */
  onLoad: async function (options) {
    this.getTopMVData(0)
  },

  // 封装网络请求的方法
  getTopMVData: async function(offset) {
  if(!this.data.hasMore &&  offset !=0) return

   wx.showNavigationBarLoading()

   const res=await getTopMVs(offset)
   let newData=res.data.topMVs
   if(offset===0){
     newData=res.data
   }else{
     newData=newData.concat(res.data)
   }

   this.setData({topMVs:newData})
   this.setData({hasMore:res.hasMore})
   wx.hideNavigationBarLoading()
   if (offset === 0) {
    wx.stopPullDownRefresh()
  }
  },

  // 封装事件处理的方法
  handleVideoItemClick: function(event) {
   const id=event.currentTarget.dataset.item.id
     // 页面跳转
     wx.navigateTo({
      url: `/pages/detail-video/index?id=${id}`,
    })

  },

    // 其他的生命周期回调函数
    onPullDownRefresh: async function() {
      // const res = await getTopMV(0)
      // this.setData({ topMVs: res.data })
      this.getTopMVData(0)
    },
  
    onReachBottom: async function() {
      // if (!this.data.hasMore) return
      // const res = await getTopMV(this.data.topMVs.length)
      // this.setData({ topMVs: this.data.topMVs.concat(res.data) })
      // this.setData({ hasMore: res.hasMore })
      this.getTopMVData(this.data.topMVs.length)
    }
})