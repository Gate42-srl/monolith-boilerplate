/**
 * @class PropertyValidator
 * @description Define methods for PropertyValidator
 */
export class PropertyValidator {
  _request: any

  constructor(request: any) {
    this._request = request
  }

  /**
   * @async @method isAuthorized
   * @description Check if the user is authorized to make the request
   */
  async isAuthorized(): Promise<boolean> {
    throw new Error("You must implement isAuthorized method")
  }
}
