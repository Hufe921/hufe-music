const homeModule = {
  // 搜索
  getSearch: {
    url: 'search',
    method: 'get'
  },
  // banner
  getBanner: {
    url: 'banner',
    method: 'get'
  },
  // 推荐歌单
  getPersonal: {
    url: 'personalized',
    method: 'get'
  },
  // 获取歌单详情
  getPlaylistDetail: {
    url: 'playlist/detail',
    method: 'get'
  },
  // 获取歌曲详情
  getSongDetail: {
    url: 'song/detail',
    method: 'get'
  }
}
export default homeModule
