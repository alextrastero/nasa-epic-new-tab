
/*
 * Outputs:
 * {
 *   image: String (image url)
 *   date: String (image taken date)
 *   centroidCoordinates: Obj (lat and lon)
 * }
 */
export const trimmer = (data) => {
  const parsed = []
  data.forEach((val) => {
    parsed.push({
      image: val.image,
      date: val.date,
      centroidCoordinates: val.centroid_coordinates
    })
  })

  return parsed
}
