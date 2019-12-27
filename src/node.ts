import { Yallist } from './yallist'

export class Node {
  public prev: Node | null = null
  public next: Node | null = null
  public list: Yallist | null = null
  constructor(public value: any, prev?: Node | null, next?: Node | null, list?: Yallist) {
    this.list = list ?? null

    if (prev) {
      prev.next = this
      this.prev = prev
    }

    if (next) {
      next.prev = this
      this.next = next
    }
  }
}
