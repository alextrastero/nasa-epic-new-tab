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

export const setData = (data) => {
  if (process.env.NODE_ENV !== 'production') debug()

  return new Promise((resolve, reject) => {
    inLocalhost(reject)
    window.chrome.storage.sync.set({ KEY: data }, () => {
      console.log(`${KEY}: stored`)
    })
  })
}

export const getData = () => {
  return new Promise((resolve, reject) => {
    inLocalhost(reject)
    window.chrome.storage.sync.get([KEY], (items) => {
      resolve(items)
    })
  })
}

const debug = () => {
  window.chrome.storage = window.chrome.storage || { onChanged: { addListener: () => {} } }
  window.chrome.storage.onChanged.addListener((changes, namespace) => {
    for (let key in changes) {
      let storageChange = changes[key]
      console.log('Storage key "%s" in namespace "%s" changed. ' +
        'Old value was "%s", new value is "%s".',
      key,
      namespace,
      storageChange.oldValue,
      storageChange.newValue
      )
    }
  })
}
