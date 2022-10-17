import hyRequest from  './index'

 export function getTopMVs(offset,limit=20){
  return hyRequest.get("/top/mv",{
    offset,
    limit
  })

}

