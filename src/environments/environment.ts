// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  firebaseConfig: {
    apiKey: 'AIzaSyARNWC-h20iHtUaOL_9D7BGNHGwvx4fY1s',
    authDomain: 'orden-pedidos.firebaseapp.com',
    databaseURL: 'https://orden-pedidos.firebaseio.com',
    projectId: 'orden-pedidos',
    storageBucket: 'orden-pedidos.appspot.com',
    messagingSenderId: '544672712834'
  }
  /*firebaseConfig: {
    apiKey: 'AIzaSyARNWC-h20iHtUaOL_9D7BGNHGwvx4fY1s',
    authDomain: 'orden-compras.firebaseapp.com',
    databaseURL: 'https://orden-compras.firebaseio.com',
    projectId: 'orden-compras',
    storageBucket: 'orden-compras.appspot.com',
    messagingSenderId: '544672712834'
  }*/
};
