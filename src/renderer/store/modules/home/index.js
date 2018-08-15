// 实例，请结合实际修改
import $api from '../../../services/api'
import $http from '../../../services/http/httpAxios'
export default {
  namespaced: true,
  state: {
    searchResult: ''
  },
  getters: {},
  mutations: {
    updateSearchResult (state, payload) {
      state.searchResult = payload
    }
  },
  actions: {
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
    }
  }
}
