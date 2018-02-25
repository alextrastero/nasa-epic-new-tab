const DEV = process.env.NODE_ENV !== 'production'
const KEY = 'nasa-epic-new-tab'

/*
 * Chrome storage model
 *
 * {
 *   lastCaptured: Date,
 *   capturesList: Array
 * }
 *
 */

const getData = () => {
  return new Promise((resolve, reject) => {
    if (DEV) {
      resolve(JSON.parse(window.localStorage.getItem([KEY])))
    }
    window.chrome.storage.sync.get([KEY], (data) => {
      resolve(data[KEY])
    })
  })
}

const setData = (data) => {
  return new Promise((resolve, reject) => {
    if (DEV) {
      resolve(window.localStorage.setItem([KEY], JSON.stringify(data)))
    }
    window.chrome.storage.sync.set({ [KEY]: JSON.stringify(data) }, () => {
      console.log(`${KEY}: stored ${data.capturesList.length} items`)
    })
  })
}

export default {
  getData,
  setData
}
