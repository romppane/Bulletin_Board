import { configureContainer } from './di-container';
import { Server } from './server';
import { start } from './db';

if (start()) {
  configureContainer()
    .then(container => {
      container.resolve<Server>('app').start();
    })
    .catch(err => console.log(err));
} else {
  console.log('Fill out environmental variables');
}
