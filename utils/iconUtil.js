import { layouts } from '../static/lib/mapbox-maki'

export default function iconMap (icon) {
  let newIcon = icon
  if (icon.indexOf('.svg') === -1 && layouts.all.all.indexOf(icon) !== -1) {
    newIcon = `${icon}-15.svg`
  } else if (icon.indexOf('.svg') === -1) {
    newIcon = 'marker-15.svg'
  }
  return newIcon
}

