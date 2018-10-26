
/**
 * Err describes the JS Error interface independant
 * of the default Error machinery.
 *
 * This is done to avoid hacks required when extending the Error constructor.
 */ 
export interface Err {

  /**
   * message describing the error that occured.
   */
  message: string

}
