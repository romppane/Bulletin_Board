import { configureContainer } from './di-container';
import { Server } from './server';
import { validateEnv } from './db';

validateEnv().then(value => {
  if (value) {
    configureContainer()
      .then(container => {
        container.resolve<Server>('app').start();
      })
      .catch(err => console.log(err));
  } else {
    console.log('Fill out environmental variables');
  }
});
