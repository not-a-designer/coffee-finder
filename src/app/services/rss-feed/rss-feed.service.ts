import { Injectable }    from '@angular/core';
import { HttpClient }    from '@angular/common/http';

import { environment }   from '@environments/environment';

import * as RssConverter from 'rss-to-json';


interface RSSResult {
  status: string;
  feed: {
    url: string;
    title: string;
    link: string;
    authour: string;
    descritpion: string;
    image: string;
  };
  items: Array<{
    title: string;
    pubDate: string;
    link: string;
    guid: string;
    author: string;
    thumbnail: string;
    description: string;
    content: string;
    enclosure: { link: string; };
    categories: string[];
  }>;
};


@Injectable({ providedIn: 'root' })
export class RssFeedService {

  baseUrl: string = 'https://rss2json.com/api.json?rss_url=';
  authParams: string = `&api_key=${environment.rss2JsonConfig}`;

  constructor(private httpClient: HttpClient) { }

  public async getFeed(url: string, limit?: number): Promise<RSSResult> {
    let promise = new Promise<RSSResult>(async (resolve, reject) => {
      try {
        limit = limit || 15;
        const limitParams = `&count=${limit}`;
        const reqUrl = this.baseUrl + url + this.authParams + limitParams;
        const result = await this.httpClient.get<RSSResult>(reqUrl, { observe: 'body' }).toPromise();
        if (result['status'] === 'ok') {
          console.log(result.feed.title);
          resolve(result);
        }
      }
      catch(e) { reject(e) }
    });

    return promise;
    /*try { 
      const rss = await RssConverter.load(url);
      console.log(...rss)
      return rss;
    }
    catch(e) { console.log(e) }*/
  }
}
