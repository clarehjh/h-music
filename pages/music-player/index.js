// pages/music-player/index.js
import { getSongDetail,getSongLyric } from '../../service/api_player'
import  {audioContext} from '../../store/index'
import {parseLyric } from   '../../utils//parse-lyric.js'

Page({
  data: {
    id: 0,
    currentSong: {},//当前歌曲
    durationTime:0,//总时间
    currentTime:0,//播放当前时间
    isMusicLyric:true,//根据宽度比来控制是否显示歌词
    lyricInfos: [],//歌曲信息，包括时间，歌词
    currentLyricIndex:0, //用于统计当前时间的标记
    currentLyricText:"", //当前时间显示的歌词
    currentPage: 0,
    contentHeight: 0,
    sliderValue:0 ,//当前滑动块数据
    sliderChanging:false //当前是否在滑动

  },
  onLoad: function (options) {
    // 1.获取传入的id
    const id = options.id
    this.setData({ id })

    // 2.根据id获取歌曲信息
    this.getPageData(id)

    // 3.动态计算内容高度
    const globalData = getApp().globalData
    const screenHeight = globalData.screenHeight
    const statusBarHeight = globalData.statusBarHeight
    const navBarHeight = globalData.navBarHeight
    const deviceRadio=globalData.deviceRadio
    const contentHeight = screenHeight - statusBarHeight - navBarHeight
    this.setData({ contentHeight ,isMusicLyric: deviceRadio>= 2})

    // 4.创建播放器
    audioContext.stop()
    audioContext.src = `https://music.163.com/song/media/outer/url?id=${id}.mp3`
    audioContext.autoplay=true
    // 5.audioContext的事件监听
    this.setupAudioContextListener()
  },

  // ===============网络请求============
  getPageData: function(id) {
    getSongDetail(id).then(res => {
      this.setData({ currentSong: res.songs[0],durationTime:res.songs[0].dt })
    })
    getSongLyric(id).then(res=>{
      const lyricString=res.lrc.lyric
      const lyrics=parseLyric(lyricString)
      console.log(lyrics)
      this.setData({  lyricInfos: lyrics})
    })
  },

  //audio监听
setupAudioContextListener:function(){
  audioContext.onCanplay(()=>{
    audioContext.play()
  })

  //监听时间改变
  audioContext.onTimeUpdate(()=>{
    //1.获取当前时间
    const currentTime=audioContext.currentTime * 1000

    //2.根据当前时间修改currentTime/sliderValue
    if(!this.data.isSliderChanging){
      const sliderValue=currentTime / this.data.durationTime * 100
      this.setData({sliderValue,currentTime})
    }
    //3.根据当前time查找播放的歌词
    let i=0
    for(;i<this.data.lyricInfos.length;i++){
      const lyricInfo=this.data.lyricInfos[i]
      if(currentTime<lyricInfo.time){
          break
      }
    }
    //设置当前歌词的索引内容
    const currentIndex=i-1
    if(this.data.currentLyricIndex !==currentIndex){
      const currentLyricInfo=this.data.lyricInfos[currentIndex]
      this.setData({ currentLyricText: currentLyricInfo.text, currentLyricIndex: currentIndex })
    }

  })

},



  // 事件处理
  handleSwiperChange: function(event) {
    const current = event.detail.current
    this.setData({ currentPage: current })
  },

  handleSliderChanging: function(event) {
    const value = event.detail.value
    const currentTime = this.data.durationTime * value / 100
    this.setData({ isSliderChanging: true, currentTime, sliderValue: value })
  },

  handleSliderChange: function(event) {
    // 1.获取slider变化的值
    const value = event.detail.value

    // 2.计算需要播放的currentTIme
    const currentTime = this.data.durationTime * value / 100

    // 3.设置context播放currentTime位置的音乐
    audioContext.pause()
    audioContext.seek(currentTime / 1000)

    // 4.记录最新的sliderValue, 并且需要讲isSliderChaning设置回false
    this.setData({ sliderValue: value, isSliderChanging: false })
  },

  onUnload: function () {

  },

  onUnload: function () {

  },
})