import { h, app } from 'hyperapp'

const url = 'https://api.nasa.gov/EPIC/api/natural?api_key=DEMO_KEY'

const state = {
  capturesList: []
}

const actions = {
  fetchImage: () => (state, actions) => {
    fetch(url)
      .then(res => res.json())
      .then(data => actions.setImages(data))
  },
  setImages: (data) => state => ({ capturesList: data })
}
// api info: https://epic.gsfc.nasa.gov/about/api

const renderMedia = (capture) => {
  const date = capture.date.split(' ')[0].replace(/-/g, '/')
  // <img src={`https://epic.gsfc.nasa.gov/archive/natural/${date}2018/02/18/jpg/epic_1b_20180218003633.jpg`} />
  // <p>{capture.coords.centroid_coordinates.lat}, {capture.coords.centroid_coordinates.lon}</p>

  return (
    <div className='image' style={{position: 'absolute'}}>
      <img src={`https://epic.gsfc.nasa.gov/archive/natural/${date}/thumbs/${capture.image}.jpg`} />
    </div>
  )
}

const view = (state, actions) => (
  <div className='container' oncreate={actions.fetchImage} style={{position:'relative'}}>
    {state.capturesList.map(renderMedia)}
  </div>
)

app(state, actions, view, document.body)
