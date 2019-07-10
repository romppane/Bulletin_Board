import { Post } from '../entities/post';
export function comparePosts(m1: Post, m2: Post) {
  return JSON.stringify(m1) === JSON.stringify(m2);
}

export function limitResponces(responces: any[], limit: number): any[] {
  if (limit > 0) {
    return responces.slice(0, limit);
  }
  else {
    return responces;
  }
}


// Figure out if it's possible to give the sorter function as the parameter.
export function sortBy(o: object[], field: string, selector: string): any[] {
  if (selector === "ascending") {
    return o.concat().sort((a: any, b: any) => (a[field] > b[field]) ? 1 : ((b[field] > a[field]) ? -1 : 0));
  }
  else if (selector === "descending") {
    return o.concat().sort((a: any, b: any) => (a[field] > b[field]) ? -1 : ((b[field] > a[field]) ? 1 : 0));
  }
  else {
    return o;
  }

}
