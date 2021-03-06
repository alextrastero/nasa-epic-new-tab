// api info: https://epic.gsfc.nasa.gov/about/api
// <img src={`https://epic.gsfc.nasa.gov/archive/natural/${date}2018/02/18/jpg/epic_1b_20180218003633.jpg`} />
// <p>{capture.coords.centroid_coordinates.lat}, {capture.coords.centroid_coordinates.lon}</p>

// https://epic.gsfc.nasa.gov/archive/enhanced/2018/02/17/jpg/epic_RGB_20180217005515.jpg

import { h, app } from 'hyperapp'
import './style.css'
import epicSampleImage from './epic.jpg'
import localStorage from './chrome-storage'
import { trimmer } from './helpers'

const type = 'natural' // enhanced
const url = `https://api.nasa.gov/EPIC/api/${type}?api_key=DEMO_KEY`

const state = {
  capturesList: undefined,
  freshImage: false,
  lastCaptured: undefined
}

// Stop fetchImageTimeout if user is leaving
window.onbeforeunload = () => { window.clearTimeout(fetchImageTimeout) }

let fetchImageTimeout
const actions = {
  /*
   * #startApp
   *
   * fetches chrome-storage for extension data
   * if empty set captured date to today and fetch new images from epic api
   *
   * if contains data, render
   *
   * if data corrupt, dont update state
   *
   */
  startApp: () => (state, actions) => {
    localStorage.getData().then((data) => {
      if (data) {
        actions.setImages({ data })
      } else {
        actions.fetchImage()
      }
    }).catch((err) => console.warn(err))
  },

  fetchImage: () => (state, actions) => {
    window.clearTimeout(fetchImageTimeout)
    if (process.env.NODE_ENV !== 'production') return

    fetchImageTimeout = window.setTimeout(() => {
      window.fetch(url)
        .then(res => res.json())
        .then(data => actions.setImages({ data: { capturesList: trimmer(data) }, freshImage: true }))
    }, 5000) // only fetch new image if user is more than 5sec on tab
  },

  setImages: ({ data, freshImage }) => state => {
    const { capturesList } = data
    const lastCaptured = new Date().getDate()

    if (freshImage) {
      const toBeStored = { capturesList, lastCaptured }

      localStorage.setData(toBeStored).catch((err) => console.warn(err))
    }

    return { capturesList, lastCaptured, freshImage }
  }
}

const renderMedia = (capturesList) => {
  const parseDate = (date) => date.split(' ')[0].replace(/-/g, '/')
  const urlList = capturesList.map((capture) => {
    if (!capture.date) return { url: capture.image }

    return { url: `https://epic.gsfc.nasa.gov/archive/${type}/${parseDate(capture.date)}/jpg/${capture.image}.jpg` }
  })

  return <img className='epic__img' src={urlList[0].url} />
}

const getCoords = (capturesList) => {
  const { lat, lon } = capturesList[0].centroidCoordinates
  return `${lat} ${lon}`
}

const renderFreshImage = () => <a title='new image' className='fresh-image' />

const view = (state, actions) => {
  // render sample image until new image has arrived
  const renderData = state.capturesList || [{
    image: epicSampleImage
  }]

  return (
    <div className='container' oncreate={actions.startApp}>
      <div className='hero'>
        <div className='hero-message'>
          <p>dscovr: epic</p>
          {state.capturesList && <p>coords: {getCoords(state.capturesList)}</p>}
        </div>
        {state.freshImage && renderFreshImage()}
      </div>
      <div className='epic'>
        {renderMedia(renderData)}
      </div>
    </div>
  )
}

app(state, actions, view, document.body)
