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

const inLocalhost = (reject) => {
  if (typeof window.chrome.storage === 'undefined') {
    reject('Can\'t access chrome storage, are you on localhost?')
  }
}

const setData = (data) => {
  return new Promise((resolve, reject) => {
    inLocalhost(reject)
    window.chrome.storage.sync.set({ [KEY]: data }, () => {
      console.log(`${KEY}: stored ${data.capturesList.length} items`)
    })
  })
}

const getData = () => {
  return new Promise((resolve, reject) => {
    inLocalhost(reject)
    window.chrome.storage.sync.get([KEY], (data) => {
      resolve(data[KEY])
    })
  })
}

export default {
  getData,
  setData
}
