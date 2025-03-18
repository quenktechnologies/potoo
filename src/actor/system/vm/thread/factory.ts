import { Address } from '../../../address';
import {
    isProcessTemplate,
    ProcessTemplate,
    Template
} from '../../../template';
import { VM } from '..';
import { JSThread } from './shared/js';
import { ProcessThread } from './process';

/**
 * ThreadFactory creates Thread implementations based on the provided
 * TemplateType.
 */
export class ThreadFactory {
    /**
     * create a new instance of a Thread for the given TemplateType.
     */
    static create(vm: VM, address: Address, template: Template) {
        if (isProcessTemplate(template))
            return ProcessThread.create(
                vm,
                template,
                address,
                (<ProcessTemplate>template).script
            );

        return new JSThread(vm, template, address);
    }
}
