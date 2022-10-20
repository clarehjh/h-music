import { HYEventStore } from 'hy-event-store'

import { getRankings } from '../service/api_music'

const rankingMap = { 0: "newRanking", 1: "hotRanking", 2: "originRanking", 3: "upRanking" }
const types=[3779629,3778678,2884035,19723756]

const rankingStore = new HYEventStore({
  state: {
    newRanking: {}, // 3779629: 新歌
    hotRanking: {}, // 3778678: 热门
    originRanking: {}, //2884035: 原创
    upRanking: {} // 19723756: 飙升

  },
  actions: {
    getRankingDataAction(ctx) {
      // 0: 新歌榜 1: 热门榜 2: 原创榜 3: 飙升榜
      for (let i = 0; i < types.length; i++) {
        getRankings(types[i]).then(res => {
          const rankingName = rankingMap[i]
          ctx[rankingName] = res.playlist
          // switch(i) {
          //   case 0:
          //     ctx.newRanking = res.playlist
          //     break;
          //   case 1:
          //     ctx.hotRanking = res.playlist
          //     break;
          //   case 2:
          //     ctx.originRanking = res.playlist
          //     break;
          //   case 3:
          //     ctx.upRanking = res.playlist
          //     break;
          // }
        })
      }
    }

  }
})

export {
  rankingStore
}
