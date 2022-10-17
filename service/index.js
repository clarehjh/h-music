import {BASE_URL,TIMEOUT} from './config'

class HyRequest{
  request(url,method,params){
    return  new Promise((resolve,reject)=>{
    wx.request({
    url:BASE_URL + url,
    data: params,
    method:method,
    timeout: TIMEOUT,
    success: (res) =>{
     resolve(res.data)
    },
    fail:(res)=>{
      reject(res)
    }
  })
    })
  } 

  get(url,params){
   return this.request(url,"GET",params)
  }

 post(url,params){
   return this.request(url,"POST",params)
 }
}

export default new  HyRequest