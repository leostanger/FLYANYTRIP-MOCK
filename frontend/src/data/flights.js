import route1Img from '../assets/Popular Flight Routes/1.png'
import route2Img from '../assets/Popular Flight Routes/2.png'
import route3Img from '../assets/Popular Flight Routes/3.png'
import route4Img from '../assets/Popular Flight Routes/4.png'
import route5Img from '../assets/Popular Flight Routes/5.png'
import route6Img from '../assets/Popular Flight Routes/6.png'

const flights = [
  {
    id: 1,
    fromCode: 'DEL',
    toCode: 'BOM',
    price: 3499,
    badge: 'Popular',
    image: route1Img,
  },
  {
    id: 2,
    fromCode: 'BLR',
    toCode: 'GOI',
    price: 2799,
    badge: 'Deal',
    image: route2Img,
  },
  {
    id: 3,
    fromCode: 'BOM',
    toCode: 'DXB',
    price: 12799,
    badge: 'Intl',
    image: route3Img,
  },
  {
    id: 4,
    fromCode: 'DEL',
    toCode: 'SIN',
    price: 8499,
    badge: 'Intl',
    image: route4Img,
  },
  {
    id: 5,
    fromCode: 'HYD',
    toCode: 'BLR',
    price: 1799,
    badge: 'Budget',
    image: route5Img,
  },
  {
    id: 6,
    fromCode: 'MAA',
    toCode: 'CCU',
    price: 4799,
    badge: 'Route',
    image: route6Img,
  },
]

export default flights
