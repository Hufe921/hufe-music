// 实例，请结合实际修改
import $api from '../../../services/api'
import $http from '../../../services/http/httpAxios'
export default {
  namespaced: true,
  state: {
    searchResult: '',
    is_play: false,
    currentTime: 0,
    song: {},
    playlist: []
  },
  getters: {},
  mutations: {
    updateSearchResult (state, payload) {
      state.searchResult = payload
    },
    // 设置播放数据
    SET_PLAYER_DATA (state, payload) {
      Object.keys(payload).forEach(key => {
        state[key] = payload[key]
      })
    },
    // 设置播放列表
    SET_PLAYER_LIST (state, payload) {
      state.playlist = payload
    }
  },
  actions: {
    // 播放音乐
    playMusic ({commit}, ids) {
      commit('SET_PLAYER_DATA', {is_play: false, currentTime: 0})
      $http($api.getSongDetail, {ids}).then(res => {
        commit('SET_PLAYER_DATA', {song: res.data.songs[0]})
        commit('SET_PLAYER_DATA', {is_play: true})
      })
    },
    // 播放歌单
    async playList ({dispatch, commit}, id) {
      let data = await dispatch('getPlaylistDetail', {id})
      let list = data.code === 200 ? data.playlist.tracks : []
      commit('SET_PLAYER_LIST', list)
      if (list.length) {
        dispatch('playMusic', list[0].id)
      }
    },
    // 搜索
    getSearch ({
      commit
    }, payload) {
      return new Promise((resolve, reject) => {
        $http($api.getSearch, payload).then(({
          data
        }) => {
          commit('updateSearchResult', data)
          resolve(data)
        }).catch(({
          data
        }) => {
          reject(data)
        })
      })
    },
    // banner
    getBanner ({
      commit
    }, payload) {
      return new Promise((resolve, reject) => {
        $http($api.getBanner, payload).then(({
          data
        }) => {
          resolve(data)
        }).catch(({
          data
        }) => {
          reject(data)
        })
      })
    },
    // 推荐歌单
    getPersonal ({
      commit
    }, payload) {
      return new Promise((resolve, reject) => {
        $http($api.getPersonal, payload).then(({
          data
        }) => {
          resolve(data)
        }).catch(({
          data
        }) => {
          reject(data)
        })
      })
    },
    // 获取歌单详情
    getPlaylistDetail ({
      commit
    }, payload) {
      return new Promise((resolve, reject) => {
        $http($api.getPlaylistDetail, payload).then(({
          data
        }) => {
          resolve(data)
        }).catch(({
          data
        }) => {
          reject(data)
        })
      })
    },
    // 获取歌曲详情
    getSongDetail ({
      commit
    }, payload) {
      return new Promise((resolve, reject) => {
        $http($api.getSongDetail, payload).then(({
          data
        }) => {
          resolve(data)
        }).catch(({
          data
        }) => {
          reject(data)
        })
      })
    }
  }
}
