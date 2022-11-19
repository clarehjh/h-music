// pages/music-player/index.js
// import { getSongDetail,getSongLyric } from '../../service/api_player'
// import  {audioContext} from '../../store/index'
// import {parseLyric } from   '../../utils//parse-lyric.js'
import { audioContext, playerStore } from '../../store/index'

const playModeNames=['order','repeat','random']

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
    sliderChanging:false ,//当前是否在滑动
    isPlaying:false,
    playModeIndex: 0,

    playingModeName:'order',
    playingName: "pause",



  },
  onLoad: function (options) {
    // 1.获取传入的id
    const id = options.id
    this.setData({ id })

    // 2.根据id获取歌曲信息
    this.setupPlayerStoreListener()
    // 3.动态计算内容高度
    const globalData = getApp().globalData
    const screenHeight = globalData.screenHeight
    const statusBarHeight = globalData.statusBarHeight
    const navBarHeight = globalData.navBarHeight
    const deviceRadio=globalData.deviceRadio
    const contentHeight = screenHeight - statusBarHeight - navBarHeight
    this.setData({ contentHeight ,isMusicLyric: deviceRadio>= 2})
  },





  // 事件处理
  handleSwiperChange: function(event) {
    const current = event.detail.current
    this.setData({ currentPage: current })
  },

  handleSliderChanging: function(event) {
    const value = event.detail.value
    const currentTime = this.data.durationTime * value / 100
    this.setData({ isSliderChanging: true, currentTime,  })
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
    //返回
    handleBackBtnClick: function() {
      wx.navigateBack()
    },
    handleModeBtnClick: function() {
      // 计算最新的playModeIndex
      let playModeIndex = this.data.playModeIndex + 1
      if (playModeIndex === 3) playModeIndex = 0
  
      // 设置playerStore中的playModeIndex
      playerStore.setState("playModeIndex", playModeIndex)
    },
  
    handlePlayBtnClick: function() {
      playerStore.dispatch("changeMusicPlayStatusAction")
    },
  
     // ========================   数据监听   ======================== 
  setupPlayerStoreListener: function() {
    // 1.监听currentSong/durationTime/lyricInfos
    playerStore.onStates(["currentSong", "durationTime", "lyricInfos"], ({
      currentSong,
      durationTime,
      lyricInfos
    }) => {
      if (currentSong) this.setData({ currentSong })
      if (durationTime) this.setData({ durationTime })
      if (lyricInfos) this.setData({ lyricInfos })
    })

    // 2.监听currentTime/currentLyricIndex/currentLyricText
    playerStore.onStates(["currentTime", "currentLyricIndex", "currentLyricText"], ({
      currentTime,
      currentLyricIndex,
      currentLyricText
    }) => {
      // 时间变化
      if (currentTime && !this.data.isSliderChanging) {
        const sliderValue = currentTime / this.data.durationTime * 100
        this.setData({ currentTime, sliderValue })
      }
      // 歌词变化
      if (currentLyricIndex) {
        this.setData({ currentLyricIndex, lyricScrollTop: currentLyricIndex * 35 })
      }
      if (currentLyricText) {
        this.setData({ currentLyricText })
      }
    })

    // 3.监听播放模式相关的数据
    playerStore.onStates(["playModeIndex", "isPlaying"], ({playModeIndex, isPlaying}) => {
      if (playModeIndex !== undefined) {
        this.setData({ 
          playModeIndex, 
          playModeName: playModeNames[playModeIndex] 
        })
      }

      if (isPlaying !== undefined) {
        this.setData({ 
          isPlaying,
          playingName: isPlaying ? "pause": "resume" 
        })
      }
    })
  },

  onUnload: function () {

  },

  
})