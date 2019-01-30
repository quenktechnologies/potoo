import { Context } from '../../../context';
import { System } from '../../';
import { PushStr } from '../op/push';
import { Stop } from '../op/stop';
import { Restart } from '../op/restart';
import { Run } from '../op/run';
import { Op } from '../op';

export const stop: Op<Context, System<Context>>[] = [
  new PushStr(0),
  new Stop()
];

export const restart: Op<Context, System<Context>>[] = [
  new PushStr(0),
  new PushStr(0),
  new Restart(),
  new Run()
];
