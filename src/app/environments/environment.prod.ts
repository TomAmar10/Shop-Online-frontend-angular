const url = 'http://localhost:3200/api';
// const url = 'https://backend-shop-online.onrender.com/api';
export const environment = {
  production: true,
  url,
  userUrl: url + '/users',
  productUrl: url + '/products',
  itemUrl: url + '/items',
  cartUrl: url + '/carts',
  categoryUrl: url + '/categories',
  orderUrl: url + '/orders',
};
