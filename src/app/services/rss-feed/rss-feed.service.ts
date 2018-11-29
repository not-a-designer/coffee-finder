import { Injectable }  from '@angular/core';
import { HttpClient }  from '@angular/common/http';

import { environment } from '@environments/environment';


export interface RSSResult {
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
    enclosure: Array<any>;
    categories: Array<any>;
  }>;
};


@Injectable({ providedIn: 'root' })
export class RssFeedService {

  baseUrl: string = 'https://api.rss2json.com/v1/api.json';

  constructor(private httpClient: HttpClient) { }

  public async getFeed(url: string, limit?: string) {
    let promise = new Promise<RSSResult>(async (resolve, reject) => {
      try {
        console.log(limit.toString());
        const result = await this.httpClient.get<RSSResult>(this.baseUrl, { 
          observe: 'body', params: {
            'rss_url': url,
            'api_key': environment.rss2JsonConfig,
            'count': limit
          }
        }).toPromise();
        if (result['status'] === 'ok') {
          console.log(result.feed.title);
          console.log(result.items.length);
          resolve(result);
        }
      }
      catch(e) { reject(e) }
    });

    return promise;
  }
}
