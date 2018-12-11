import { Injectable } from '@angular/core';

import { Storage }    from '@ionic/storage';


@Injectable({ providedIn: 'root' })
export class StorageService {

  constructor(private storage: Storage) { }

  /**
   * @public getData()
   * - checks local storage for key
   * - returns key value
   * @param key string
   * @return Promise<any>
   */
  public async getData(key: string): Promise<any> {
    try {
      await this.storage.ready();
      return await this.storage.get(key);
    }
    catch(e) { console.log('storage GET error: ', e) }
  }

  /**
   * @public setData()
   * - sets new key in local storage to given value
   * @param key string
   * @param value any
   */
  public async setData(key: string, value: any): Promise<void> {
    try {
      await this.storage.ready();
      await this.storage.set(key, value);
    }
    catch(e) { console.log('storage SET error: ', e) }
  }

  /**
   * @public removeData()
   * - removes selected key value from local storage
   * @param key string
   */
  public async removeData(key: string): Promise<void> {
    try {
      await this.storage.ready();
      await this.storage.remove(key);
    }
    catch(e) { console.log('storage REMOVE error: ', e) }
  }

  /**
   * clearData()
   * - clears all keys from local storage
   */
  public async clearData(): Promise<void> {
    try {
      await this.storage.ready();
      await this.storage.clear();
    }
    catch(e) { console.log('storage CLEAR error: ', e) }
  }
}
