// api info: https://epic.gsfc.nasa.gov/about/api
// <img src={`https://epic.gsfc.nasa.gov/archive/natural/${date}2018/02/18/jpg/epic_1b_20180218003633.jpg`} />
// <p>{capture.coords.centroid_coordinates.lat}, {capture.coords.centroid_coordinates.lon}</p>

// https://epic.gsfc.nasa.gov/archive/enhanced/2018/02/17/jpg/epic_RGB_20180217005515.jpg

import { h, app } from 'hyperapp'
import './style.css'
import epicSampleImage from './epic.jpg'
import { setData, getData } from './chrome-storage'

const type = 'natural' // enhanced
const url = `https://api.nasa.gov/EPIC/api/${type}?api_key=DEMO_KEY`

const state = {
  capturesList: undefined,
  freshImage: false,
  lastCaptured: new Date().getDate() // this needs to be stored in localStorage
}
const today = new Date().getDate()

const actions = {
  startApp: () => (state, actions) => {
    actions.fetchImages()

    // if (state.lastCaptured === today) {
      // actions.fetchStoredImage()
    // } else {
      // actions.setCapturedDate()
      // actions.fetchImage()
    // }
  },

  /*
   * #fetchImages
   *
   * fetches chrome-storage for extension data
   * if empty set captured date to today and fetch new images from epic api
   *
   * if contains data, render
   *
   * if data corrupt, dont update state
   *
   */
  fetchImages: () => (state, actions) => {
    getData()
      .then((dunno) => { console.log('workded', dunno) })
      .catch((err) =>  {
        console.warn(err)
        // const sampleImage = {
          // image: epicSampleImage,
          // coords: { centroid_coordinates: { lat: 'asd', lon: 'dsa' } }
        // }
        // actions.setImages({ new: false, data: [sampleImage] })
      })
  },

  /*
   * #fetchStoredImage
   *
   * Fetch data from chrome.storage
   * If no data present ??
   */
  fetchStoredImage: () => (state, actions) => {
    getData()
      .then((dunno) => {
        console.log('workded', dunno)
      })
      .catch((err) =>  {
        console.warn(err)
        const sampleImage = {
          image: epicSampleImage,
          coords: { centroid_coordinates: { lat: 'asd', lon: 'dsa' } }
        }
        actions.setImages({ new: false, data: [sampleImage] })
      })
  },
  fetchImage: () => (state, actions) => {
    fetch(url)
      .then(res => res.json())
      .then(data => actions.setImages({ freshImage: true, data }))
  },
  setCapturedDate: (today) => state => ({ lastCaptured: today }),
  setImages: ({ data, freshImage }) => state => ({ capturesList: data, freshImage: true })
}

const renderMedia = (capturesList) => {
  const parseDate = (date) => date.split(' ')[0].replace(/-/g, '/')
  const urlList = capturesList.map((capture) => {
    if (!capture.date) return { url: capture.image }

    return { url: `https://epic.gsfc.nasa.gov/archive/${type}/${parseDate(capture.date)}/jpg/${capture.image}.jpg` }
  })

  return (
    <img className='epic__img' src={urlList[0].url} />
  )
}

const getCoords = (capturesList) => {
  const { lat, lon } = capturesList[0].coords.centroid_coordinates
  return `${lat} ${lon}`
}

const renderFreshImage = () => ( <a title='new image' className='fresh-image' /> )

const view = (state, actions) => {
  // render sample image until new image has arrived
  const renderData = state.capturesList || [{
    // {state.capturesList.length && renderMedia(state.capturesList)}
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
