
/**
 * StateProvider is an interface for providing the 'state' a Reference should be in.
 * @interface
 */
class StateProvider {

  /**
   * provide the state
   * @param {string} state 
   * @param {string} path - Path to the Concern
   * @param {Concern} concern 
   * @param {Context} context 
   */
  provide() {
    
  }

}

export default StateProvider

