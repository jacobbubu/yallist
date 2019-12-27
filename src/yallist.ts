import { Node } from './node'

export { Node }
export type ForEachFn = (value: any, index: number, list: Yallist) => void
export type MapFn = (value: any, list: Yallist) => unknown
export type ReduceFn = (previousValue: any, currentValue: any, currentIndex: number) => any

export class Yallist {
  protected _head: Node | null = null
  protected _tail: Node | null = null

  protected _length = 0

  constructor(...args: unknown[])
  constructor(list?: unknown[]) {
    const self = this

    if (list && Array.isArray(list)) {
      list.forEach(function(item) {
        self.push(item)
      })
    } else if (arguments.length > 0) {
      for (let i = 0; i < arguments.length; i++) {
        self.push(arguments[i])
      }
    }
    return self
  }

  get head() {
    return this._head
  }

  get tail() {
    return this._tail
  }

  get length() {
    return this._length
  }

  removeNode(node: Node) {
    if (node.list !== this) {
      throw new Error('removing node which does not belong to this list')
    }

    const next = node.next
    const prev = node.prev

    if (next) {
      next.prev = prev
    }

    if (prev) {
      prev.next = next
    }

    if (node === this._head) {
      this._head = next
    }
    if (node === this._tail) {
      this._tail = prev
    }

    node.list._length--
    node.next = null
    node.prev = null
    node.list = null

    return next
  }

  unshiftNode(node: Node) {
    if (node === this._head) {
      return this._length
    }

    if (node.list) {
      node.list.removeNode(node)
    }

    const head = this._head
    node.list = this
    node.next = head
    if (head) {
      head.prev = node
    }

    this._head = node
    if (!this._tail) {
      this._tail = node
    }
    return ++this._length
  }

  pushNode(node: Node) {
    if (node === this._tail) {
      return this._length
    }

    if (node.list) {
      node.list.removeNode(node)
    }

    const tail = this._tail
    node.list = this
    node.prev = tail
    if (tail) {
      tail.next = node
    }

    this._tail = node
    if (!this._head) {
      this._head = node
    }
    return ++this._length
  }

  push(...args: any[]) {
    for (let i = 0; i < args.length; i++) {
      this._tail = new Node(args[i], this._tail, null, this)
      if (!this._head) {
        this._head = this._tail
      }
      this._length++
    }
    return this._length
  }

  unshift(...args: any[]) {
    for (let i = 0; i < args.length; i++) {
      this._head = new Node(args[i], null, this._head, this)
      if (!this._tail) {
        this._tail = this._head
      }
      this._length++
    }
    return this._length
  }

  pop() {
    if (!this._tail) {
      return undefined
    }

    const res = this._tail.value
    this._tail = this._tail.prev
    if (this._tail) {
      this._tail.next = null
    } else {
      this._head = null
    }
    this._length--
    return res
  }

  shift() {
    if (!this._head) {
      return undefined
    }

    const res = this._head.value
    this._head = this._head.next
    if (this._head) {
      this._head.prev = null
    } else {
      this._tail = null
    }
    this._length--
    return res
  }

  forEach(fn: ForEachFn, thisArg?: unknown) {
    thisArg = thisArg ?? this
    let walker = this._head
    let i = 0
    for (let i = 0; walker !== null; i++) {
      fn.call(thisArg, walker.value, i, this)
      walker = walker.next
    }
  }

  forEachReverse(fn: ForEachFn, thisArg?: unknown) {
    thisArg = thisArg ?? this
    let walker = this._tail
    for (let i = this._length - 1; walker !== null; i--) {
      fn.call(thisArg, walker.value, i, this)
      walker = walker.prev
    }
  }

  get(n: number) {
    let walker = this._head
    let i = 0

    while (walker !== null && i < n) {
      // abort out of the list early if we hit a cycle
      walker = walker.next
      i++
    }
    if (i === n && walker !== null) {
      return walker.value
    }
  }

  getReverse(n: number) {
    let walker = this._tail
    let i = 0

    while (walker !== null && i < n) {
      // abort out of the list early if we hit a cycle
      walker = walker.prev
      i++
    }
    if (i === n && walker !== null) {
      return walker.value
    }
  }

  map(fn: MapFn, thisArg?: unknown) {
    thisArg = thisArg ?? this
    const res = new Yallist()
    let walker = this._head
    while (walker !== null) {
      res.push(fn.call(thisArg, walker.value, this))
      walker = walker.next
    }
    return res
  }

  mapReverse(fn: MapFn, thisArg?: unknown) {
    thisArg = thisArg ?? this
    const res = new Yallist()
    let walker = this._tail
    while (walker !== null) {
      res.push(fn.call(thisArg, walker.value, this))
      walker = walker.prev
    }
    return res
  }

  reduce(fn: ReduceFn, initial?: unknown) {
    let acc
    let walker = this._head
    if (typeof initial !== 'undefined') {
      acc = initial
    } else if (this._head) {
      walker = this._head.next
      acc = this._head.value
    } else {
      throw new TypeError('Reduce of empty list with no initial value')
    }

    for (let i = 0; walker !== null; i++) {
      acc = fn(acc, walker.value, i)
      walker = walker.next
    }
    return acc
  }

  reduceReverse(fn: ReduceFn, initial?: unknown) {
    let acc
    let walker = this._tail
    if (typeof initial !== 'undefined') {
      acc = initial
    } else if (this._tail) {
      walker = this._tail.prev
      acc = this._tail.value
    } else {
      throw new TypeError('Reduce of empty list with no initial value')
    }

    for (let i = 0; walker !== null; i++) {
      acc = fn(acc, walker.value, i)
      walker = walker.prev
    }
    return acc
  }

  toArray() {
    const arr = new Array(this._length)
    let walker = this._head
    for (let i = 0; walker !== null; i++) {
      arr[i] = walker.value
      walker = walker.next
    }
    return arr
  }

  toArrayReverse() {
    const arr = new Array(this._length)
    let walker = this._tail
    for (let i = 0; walker !== null; i++) {
      arr[i] = walker.value
      walker = walker.prev
    }
    return arr
  }

  slice(from?: number, to?: number) {
    to = to ?? this._length
    if (to < 0) {
      to += this._length
    }
    from = from ?? 0
    if (from < 0) {
      from += this._length
    }
    const ret = new Yallist()
    if (to < from || to < 0) {
      return ret
    }
    if (from < 0) {
      from = 0
    }
    if (to > this._length) {
      to = this._length
    }
    let walker = this._head
    let i = 0
    for (; walker !== null && i < from; i++) {
      walker = walker.next
    }
    for (; walker !== null && i < to; i++) {
      ret.push(walker.value)
      walker = walker.next
    }
    return ret
  }

  sliceReverse(from?: number, to?: number) {
    to = to ?? this._length
    if (to < 0) {
      to += this._length
    }
    from = from ?? 0
    if (from < 0) {
      from += this._length
    }
    const ret = new Yallist()
    if (to < from || to < 0) {
      return ret
    }
    if (from < 0) {
      from = 0
    }
    if (to > this._length) {
      to = this._length
    }
    let walker = this._tail
    let i = this._length
    for (; walker !== null && i > to; i--) {
      walker = walker.prev
    }
    for (; walker !== null && i > from; i--, walker = walker.prev) {
      ret.push(walker.value)
    }
    return ret
  }

  splice(start: number, deleteCount: number, ...values: unknown[]) {
    if (start > this._length) {
      start = this._length - 1
    }
    if (start < 0) {
      start = this._length + start
    }

    let walker = this._head
    for (let i = 0; walker !== null && i < start; i++) {
      walker = walker.next
    }

    const ret = []
    for (let i = 0; walker && i < deleteCount; i++) {
      // push deleted value into ret
      ret.push(walker.value)
      walker = this.removeNode(walker)
    }
    if (walker === null) {
      walker = this._tail
    }

    if (walker !== this._head && walker !== this._tail && walker) {
      walker = walker.prev
    }

    for (let i = 0; i < values.length; i++) {
      const inserted =
        walker === this._head
          ? new Node(values[i], null, walker, this)
          : new Node(values[i], walker, walker ? walker.next : null, this)

      if (inserted.next === null) {
        this._tail = inserted
      }
      if (inserted.prev === null) {
        this._head = inserted
      }

      this._length++
      walker = inserted
    }
    return ret
  }

  reverse() {
    const head = this._head
    const tail = this._tail
    for (let walker = head; walker !== null; walker = walker.prev) {
      const p = walker.prev
      walker.prev = walker.next
      walker.next = p
    }
    this._head = tail
    this._tail = head
    return this
  }

  [Symbol.iterator] = function*(this: Yallist) {
    for (let walker = this._head; walker; walker = walker.next) {
      yield walker.value
    }
  }
}
