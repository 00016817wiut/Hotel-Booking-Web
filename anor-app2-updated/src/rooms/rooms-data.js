const rooms = [
  {
    id: '101',
    title: 'Standard Double',
    price: 55,
    images: [
      require('./../assets/images/room.jpg'),
      require('./../assets/images/room1.png'),
      require('./../assets/images/room2.png'),
      require('./../assets/images/room3.png')
    ],
    beds: '1 double bed',
    size: '22 m²',
    amenities: ['Free Wi-Fi','Air conditioning','Flat-screen TV','Mini-bar'],
    description: 'Cozy comfortable room with modern amenities. Ideal for solo travelers or couples.'
  },
  {
    id: '201',
    title: 'Superior Twin',
    price: 75,
    images: [
      require('./../assets/images/room1.png'),
      require('./../assets/images/room2.png'),
      require('./../assets/images/room3.png')
    ],
    beds: '2 single beds',
    size: '28 m²',
    amenities: ['Free Wi-Fi','Breakfast included','Safe','Coffee machine'],
    description: 'Spacious twin room, perfect for friends or colleagues traveling together.'
  },
  {
    id: '301',
    title: 'Deluxe Suite',
    price: 120,
    images: [
      require('./../assets/images/room2.png'),
      require('./../assets/images/room3.png'),
      require('./../assets/images/room.jpg')
    ],
    beds: '1 king bed',
    size: '48 m²',
    amenities: ['Free Wi-Fi','Balcony','Hot tub','Room service'],
    description: 'Large suite with separate living area and premium services for a luxurious stay.'
  }
];

export default rooms;
