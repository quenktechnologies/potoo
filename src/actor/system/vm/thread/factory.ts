import { Platform } from "..";
import { Address } from "../../../address";
import { TemplateType } from "../../../template";
import { JSThread } from "./shared/js";

/**
 * ThreadFactory creates Thread implementations based on the provided 
 * TemplateType.
 */
export class ThreadFactory {

  /**
   * create a new instance of a Thread for the given TemplateType.
   */
  static create(_type:TemplateType, vm:Platform, address:Address) { 

    return new JSThread(vm, address);

  }

}
