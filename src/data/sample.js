// Sample data used across all pages
export const HD = {
  items: [
    { id: 1, title: 'Pokémon Center Pikachu Plush (Large)', store: 'Pokémon Center Mega Tokyo', img: 'https://images.unsplash.com/photo-1608889175523-6bebab82e69b?w=800&h=800&fit=crop&q=85', fee: 18, retail: 64, from: 'Tokyo', to: 'NYC', departs: 'May 7', carrier: 'James L.', rating: 5.0, tag: 'Featured', viewers: 9, slots: 3, slotsTotal: 3, category: 'Collectibles' },
    { id: 2, title: 'Eevee Exclusive Figure (Limited Ed.)', store: 'Pokémon Center Mega Tokyo', img: 'https://images.unsplash.com/photo-1566576912321-d58ddd7a6088?w=800&h=800&fit=crop&q=85', fee: 35, retail: 120, from: 'Tokyo', to: 'NYC', departs: 'May 7', carrier: 'James L.', rating: 5.0, tag: 'Only 2 left', viewers: 10, slots: 2, slotsTotal: 4, category: 'Collectibles' },
    { id: 3, title: 'Seasonal KitKat Box (Matcha & Sakura)', store: 'Tokyo Convenience', img: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&h=800&fit=crop&q=85', fee: 14, retail: 38, from: 'Tokyo', to: 'NYC', departs: 'May 7', carrier: 'James L.', rating: 5.0, viewers: 11, slots: 5, slotsTotal: 8, category: 'Food' },
    { id: 4, title: 'Jellycat Bashful Bunny (Large, Cream)', store: 'Harrods', img: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&h=800&fit=crop&q=85', fee: 28, retail: 75, from: 'London', to: 'Boston', departs: 'May 4', carrier: 'Oliver T.', rating: 4.7, slots: 3, slotsTotal: 4, category: 'Gifts' },
    { id: 5, title: 'Fortnum & Mason Earl Grey Tea (250g tin)', store: 'Fortnum & Mason', img: 'https://images.unsplash.com/photo-1564890369478-c89ca3d9da7b?w=800&h=800&fit=crop&q=85', fee: 22, retail: 32, from: 'London', to: 'Boston', departs: 'May 4', carrier: 'Oliver T.', rating: 4.7, slots: 4, slotsTotal: 6, category: 'Food' },
    { id: 6, title: 'Hobonichi Techo Planner 2026', store: 'Hobonichi Tokyo', img: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=800&h=800&fit=crop&q=85', fee: 10, retail: 35, from: 'Tokyo', to: 'LA', departs: 'May 9', carrier: 'Yuki H.', rating: 4.9, tag: 'Trending', slots: 4, slotsTotal: 5, category: 'Stationery' },
    { id: 7, title: 'COSRX Snail Mucin 96% Essence', store: 'Olive Young', img: 'https://images.unsplash.com/photo-1571781926291-c477ebfd024b?w=800&h=800&fit=crop&q=85', fee: 16, retail: 25, from: 'Seoul', to: 'SF', departs: 'May 1', carrier: 'Minho C.', rating: 4.8, tag: 'Departs soon', slots: 5, slotsTotal: 8, category: 'Beauty' },
    { id: 8, title: 'Beauty of Joseon Relief Sun SPF50+', store: 'Olive Young', img: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=800&h=800&fit=crop&q=85', fee: 14, retail: 18, from: 'Seoul', to: 'SF', departs: 'May 1', carrier: 'Minho C.', rating: 4.8, slots: 5, slotsTotal: 10, category: 'Beauty' },
    { id: 9, title: 'Ladurée Macaron Box (12 pcs)', store: 'Ladurée Champs-Élysées', img: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=800&h=800&fit=crop&q=85', fee: 38, retail: 58, from: 'Paris', to: 'NYC', departs: 'May 12', carrier: 'Elise M.', rating: 4.9, slots: 3, slotsTotal: 4, category: 'Food' },
    { id: 10, title: 'Diptyque Baies Candle (190g)', store: 'Diptyque Flagship', img: 'https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=800&h=800&fit=crop&q=85', fee: 30, retail: 78, from: 'Paris', to: 'NYC', departs: 'May 12', carrier: 'Elise M.', rating: 4.9, tag: 'Almost gone', slots: 2, slotsTotal: 4, category: 'Home' },
    { id: 11, title: 'Levain Bakery Cookies (6-pack)', store: 'Levain Bakery', img: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=800&h=800&fit=crop&q=85', fee: 22, retail: 28, from: 'NYC', to: 'LA', departs: 'May 14', carrier: 'Sarah K.', rating: 4.9, tag: 'Trending', slots: 4, slotsTotal: 6, category: 'Food' },
    { id: 12, title: 'Kith × New Balance 550', store: 'Kith NYC', img: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&h=800&fit=crop&q=85', fee: 28, retail: 165, from: 'NYC', to: 'Tokyo', departs: 'May 14', carrier: 'Sarah K.', rating: 4.9, tag: 'Almost gone', slots: 1, slotsTotal: 3, category: 'Fashion' },
  ],
  cities: [
    { code: 'JP', name: 'Tokyo', count: 14, hero: 'https://images.unsplash.com/photo-1536098561742-ca998e48cbcc?w=1200&q=85' },
    { code: 'KR', name: 'Seoul', count: 9, hero: 'https://images.unsplash.com/photo-1548115184-bc6544d06a58?w=1200&q=85' },
    { code: 'FR', name: 'Paris', count: 11, hero: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=1200&q=85' },
    { code: 'GB', name: 'London', count: 8, hero: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=1200&q=85' },
    { code: 'US', name: 'New York', count: 12, hero: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1200&q=85' },
  ],
  user: {
    name: 'Yuki Mori', initials: 'YM', city: 'San Francisco',
    walletAvailable: 482.50, walletPending: 124.00, walletLifetime: 3640.00,
    completedTrips: 14, completedOrders: 23, rating: 4.92, reviews: 47,
    member: 'Verified · Top Carrier',
  },
  // Each carrier exposes the hand-off methods they support so buyers can
  // pick at checkout from a real list, not a hardcoded one.
  carriers: {
    'James L.':  { methods: ['meetup', 'doorstep'],          spots: ['Williamsburg · Devoción Coffee', 'Midtown · Bryant Park (south)', 'JFK Terminal 4 · Arrivals'], doorstepFee: 0,  pickupAddress: '' },
    'Yuki H.':   { methods: ['meetup', 'pickup'],            spots: ['Downtown LA · Verve Coffee', 'Koreatown · Cafe Dulce'],                                       doorstepFee: 0,  pickupAddress: '512 W 6th St · Los Angeles, CA' },
    'Minho C.':  { methods: ['meetup', 'doorstep', 'pickup'], spots: ['SoMa · Sightglass Coffee', 'Mission · Tartine'],                                              doorstepFee: 8,  pickupAddress: '1801 Folsom St · San Francisco, CA' },
    'Elise M.':  { methods: ['meetup'],                       spots: ['SoHo · La Colombe', 'West Village · Joe Coffee', 'Brooklyn Bridge Park'],                     doorstepFee: 0,  pickupAddress: '' },
    'Sarah K.':  { methods: ['doorstep', 'pickup'],           spots: [],                                                                                              doorstepFee: 6,  pickupAddress: '755 N Fairfax Ave · Los Angeles, CA' },
    'Oliver T.': { methods: ['meetup', 'doorstep'],           spots: ['Back Bay · Pavement Coffeehouse', 'Cambridge · Tatte Bakery'],                               doorstepFee: 5,  pickupAddress: '' },
  },
  reviews: [
    { name: 'Emily R.', city: 'New York', rating: 5, body: "I'd been hunting for Pokémon Center plushies for months. Found a traveler heading back from Tokyo — got them at retail in a week. Genuinely magic.", route: 'Tokyo → NYC', avatar: 'ER' },
    { name: 'David K.', city: 'Seoul', rating: 5, body: "I travel for work constantly. I've made over $600 just by carrying snacks on routes I was already flying. Most effortless side income I've had.", route: 'Seoul → London', avatar: 'DK' },
    { name: 'Maya T.', city: 'Paris', rating: 5, body: "The escrow gives me peace of mind. Carrier checked the receipt before payment released — felt completely protected.", route: 'Paris → Boston', avatar: 'MT' },
  ],
};
