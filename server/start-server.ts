import { configureContainer } from './di-container';
import { Server } from './server';
import { validateEnv } from './environment';

validateEnv()
  .then(Env => {
    configureContainer(Env)
      .then(container => {
        container.resolve<Server>('app').start();
      })
      .catch(err => console.log(err));
  })
  .catch(err => console.log(err));
