const proxy = [
  {
    context: '/auth',
    // target: 'http://localhost:8080',
    target: 'https://dev-9grk-oh6.us.auth0.com',
    secure: false
  }
];
module.exports = proxy;