import {ActorSystem, Configuration} from './system';

export const system = (conf?:Configuration)=> ActorSystem.create(conf);
