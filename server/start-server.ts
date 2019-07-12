import { configureContainer } from "./di-container";
import { Server } from "./server";

configureContainer().then(container => {
    console.log("resolve container")
    container.resolve<Server>('app').start()
} ).catch(err => console.log(err))