import beof from 'beof';
import Promise from 'bluebird';
import Guardian from './Guardian';
import { Problem } from './dispatch';
import * as events from './dispatch/events';
import { or, insof, ok } from './funcs';

export const LOG_LEVEL_ERROR = 3;
export const LOG_LEVEL_WARN = 4;
export const LOG_LEVEL_INFO = 5;
export const LOG_LEVEL_DEBUG = 7;

class Logger {

    constructor(logger, level) {

        this._logger = logger;
        this._level = level;

    }

    log(level, message) {

        if (level <= this._level)
            switch (level) {

                case LOG_LEVEL_INFO:
                    this._logger.info(message);
                    break;

                case LOG_LEVEL_WARN:
                    this._logger.warn(message);
                    break;

                case LOG_LEVEL_ERROR:
                    this._logger.error(message);
                    break;

                default:
                    this._logger.log(message);

            }

    }

    info(message) {

        this.log(LOG_LEVEL_INFO, message);

    }

    warn(message) {

        this.log(LOG_LEVEL_WARN, message);

    }

    error(message) {

        this.log(LOG_LEVEL_ERROR, message);

    }

}

export const log_filter = (log, level) =>

    or(
        or(
            insof(events.SelectFailedEvent, e =>
                log.warn(`Actor selection for path '${e.path}' failed!`)),
            or(
                insof(events.MessageDroppedEvent, e =>
                    log.warn(`Message sent to actor '${e.path}' was dropped!`, e.message)),

                insof(events.MessageUnhandledEvent, e =>
                    log.warn(`Message sent to actor '${e.path}' was unhandled ` +
                        `by '${e.name}'!`, e.message)))),

        ok(level >= LOG_LEVEL_INFO,
            or(
                insof(events.ReceiveEvent,
                    e => log.info(`Actor '${e.path}' began receiving with '${e.name}'`)),
                or(
                    insof(events.MessageEvent,
                        e => log.info(`Message sent to '${e.path}' mailbox.`, e.message)),

                    or(
                        insof(events.SelectHitEvent,
                            e => log.info(`
                        Actor '${e.from}'
                        provided a reference to '${e.requested}'
                        `)),

                        or(
                            insof(events.SelectMissEvent,
                                e => log.info(`Actor '${e.from}' ` +
                                    `did not provide a reference to '${e.requested}'`)),

                            insof(events.MessageHandledEvent,
                                e => log.info(`Actor '${e.path}' consumed message ` +
                                    `with '${e.name}'.`, e.message))))))))

/**
 * IsomorphicSystem represents a collection of related Concerns that share a parent Context.
 * Use them to create to represent the guardian of a tree your application will
 * branch into.
 * @implements {System}
 */
class IsomorphicSystem {

    constructor({ log_level = LOG_LEVEL_ERROR, logger = console, subscribers = [] } = {}) {

        this._subs = subscribers;
        this._guardian = new Guardian(this);

        if (log_level > LOG_LEVEL_ERROR)
            this._subs.push(log_filter(logger, log_level));

    }

    /**
     * create a new IsomorphicSystem
     * @param {object} options
     * @returns {IsomorphicSystem}
     */
    static create() {

        return new IsomorphicSystem();

    }

    select(path) {

        return this._guardian.tree.select(path);

    }

    spawn(spec, name) {

        return this._guardian.spawn(spec, name);

    }

    subscribe(f) {

        this._subs.unshift(f);
        return this;

    }

    unsubscribe(f) {

        var i = this._subs.indexOf(f);

        if (i > 0)
            this._subs.splice(i, 1);

        return this;

    }

    publish(evt) {

        this._subs.forEach(s => s.call(this, evt));

    }

}

export default IsomorphicSystem
