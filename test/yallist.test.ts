import { Yallist, Node } from '../src/yallist'

/**
 * Dummy test
 */
describe('basic', () => {
  const initial = [1, 2, 3, 4, 5]
  it('build from single list or args', () => {
    const y = new Yallist(...initial)
    const z = new Yallist(initial)
    expect(y).toEqual(z)
  })
  it('map', () => {
    const add10 = (i: number) => i + 10
    const y = new Yallist(initial)
    expect(y.map(add10).toArray()).toEqual([11, 12, 13, 14, 15])
  })
  it('mapReverse', () => {
    const add10 = (i: number) => i + 10
    const y = new Yallist(initial)
    expect(y.mapReverse(add10).toArray()).toEqual([15, 14, 13, 12, 11])
  })
  it('toArrayReverse', () => {
    const add10 = (i: number) => i + 10
    const y = new Yallist(initial)
    expect(y.map(add10).toArrayReverse()).toEqual([15, 14, 13, 12, 11])
  })
  it('push', () => {
    const y = new Yallist(initial)
    expect(y.push(6, 7, 8)).toBe(8)
  })
  it('toArray', () => {
    const y = new Yallist(initial)
    y.push(6, 7, 8)
    expect(y.toArray()).toEqual([1, 2, 3, 4, 5, 6, 7, 8])
  })
  it('pop', () => {
    const y = new Yallist(initial)
    expect(y.pop()).toBe(5)
  })
  it('shift', () => {
    const y = new Yallist(initial)
    expect(y.shift()).toBe(1)
  })
  it('unshift', () => {
    const y = new Yallist(initial)
    y.unshift(100)
    expect(y.toArray()).toEqual([100, 1, 2, 3, 4, 5])
    expect(y.length).toBe(y.toArray().length)
  })
  it('forEach', () => {
    const y = new Yallist(initial)
    y.forEach((item, i, list) => {
      expect(item).toBe(initial[i])
      expect(list).toBe(y)
    })
  })
  it('forEachReverse', () => {
    const y = new Yallist(initial)
    const reversedInitial = [...initial].reverse()
    let n = 0
    y.forEachReverse((item, i, list) => {
      expect(item).toBe(reversedInitial[n])
      expect(item).toBe(initial[i])
      expect(item).toBe(y.get(i))
      expect(item).toBe(y.getReverse(n))
      n += 1
      expect(list).toBe(y)
    })
    expect(y.getReverse(100)).toBeUndefined()
    expect(y.get(9999)).toBeUndefined()
  })
  it('reduce', () => {
    const sum = (a: number, b: number) => a + b
    const y = new Yallist(initial)
    expect(y.reduce(sum)).toBe(15)
    expect(y.reduce(sum, 100)).toBe(115)
    expect(y.reduceReverse(sum)).toBe(15)
    expect(y.reduceReverse(sum, 100)).toBe(115)
  })
  it('empty', () => {
    expect(new Yallist().pop()).toBeUndefined()
    expect(new Yallist().shift()).toBeUndefined()
  })
  it('length', () => {
    const y = new Yallist()
    y.unshift(1)
    expect(y.length).toBe(1)
    expect(y.toArray()).toEqual([1])
  })
  it('toArray and vice versa', () => {
    const y = new Yallist()
    expect(new Yallist(y.toArray())).toEqual(y)
  })

  describe('slice', () => {
    const cases = [
      [
        [2, 4],
        [3, 4]
      ],
      [[2, -4], []],
      [
        [2, -2],
        [3, 4]
      ],
      [
        [1, -2],
        [2, 3, 4]
      ],
      [[-1, -2], []],
      [
        [-5, -2],
        [2, 3, 4]
      ],
      [
        [-99, 2],
        [1, 2]
      ],
      [[5, 99], [6]],
      [[], [1, 2, 3, 4, 5, 6]]
    ]

    const a = new Yallist(1, 2, 3, 4, 5, 6)

    it('slice', () => {
      cases.forEach(c => {
        expect(a.slice(...c[0])).toEqual(new Yallist(c[1]))
        expect(a.toArray().slice(...c[0])).toEqual(c[1])
      })
    })

    it('sliceReverse', () => {
      cases.forEach(c => {
        const rev = [...c[1]].reverse()
        expect(a.sliceReverse(...c[0])).toEqual(new Yallist(rev))
        expect(
          a
            .toArray()
            .slice(...c[0])
            .reverse()
        ).toEqual(rev)
      })
    })
  })

  describe('unshiftNode/pushNode', () => {
    it('unshiftNode', () => {
      const inserter = new Yallist(1, 2, 3, 4, 5)
      inserter.unshiftNode(inserter.head!.next!)
      expect(inserter.toArray()).toEqual([2, 1, 3, 4, 5])
      inserter.unshiftNode(inserter.tail!)
      expect(inserter.toArray()).toEqual([5, 2, 1, 3, 4])
      inserter.unshiftNode(inserter.head!)
      expect(inserter.toArray()).toEqual([5, 2, 1, 3, 4])
    })

    it('single', () => {
      const single = new Yallist(1)
      single.unshiftNode(single.head!)
      expect(single.toArray()).toEqual([1])
    })

    it('pushNode', () => {
      const inserter = new Yallist(1, 2, 3, 4, 5)
      inserter.pushNode(inserter.tail!.prev!)
      expect(inserter.toArray()).toEqual([1, 2, 3, 5, 4])
      inserter.pushNode(inserter.head!)
      expect(inserter.toArray()).toEqual([2, 3, 5, 4, 1])
      inserter.unshiftNode(inserter.head!)
      expect(inserter.toArray()).toEqual([2, 3, 5, 4, 1])

      const single = new Yallist(1)
      single.pushNode(single.tail!)
      expect(single.toArray()).toEqual([1])

      let swiped = new Yallist(9, 8, 7)
      inserter.unshiftNode(swiped.head!.next!)
      expect(inserter.toArray()).toEqual([8, 2, 3, 5, 4, 1])
      expect(swiped.toArray()).toEqual([9, 7])
    })
  })

  describe('node', () => {
    const swiped = new Yallist(9, 8, 7)
    const inserter = new Yallist(1, 2, 3, 4, 5)
    inserter.pushNode(swiped.head!.next!)
    expect(inserter.toArray()).toEqual([1, 2, 3, 4, 5, 8])
    expect(swiped.toArray()).toEqual([9, 7])

    swiped.unshiftNode(new Node(99))
    expect(swiped.toArray()).toEqual([99, 9, 7])
    swiped.pushNode(new Node(66))
    expect(swiped.toArray()).toEqual([99, 9, 7, 66])

    let e = new Yallist()
    e.unshiftNode(new Node(1))
    expect(e.toArray()).toEqual([1])

    e = new Yallist()
    e.pushNode(new Node(1))
    expect(e.toArray()).toEqual([1])

    // steal them back, don't break the lists
    swiped.unshiftNode(inserter.head!)
    expect(swiped.toArray()).toEqual([1, 99, 9, 7, 66])
    expect(inserter).toEqual(new Yallist(2, 3, 4, 5, 8))
    swiped.unshiftNode(inserter.tail!)
    expect(inserter).toEqual(new Yallist(2, 3, 4, 5))
    expect(swiped).toEqual(new Yallist(8, 1, 99, 9, 7, 66))

    describe('remove node', () => {
      it('remove node exception', () => {
        expect(function remove_foreign_node() {
          e.removeNode(swiped.head!)
        }).toThrow('removing node which does not belong to this list')

        expect(function remove_foreign_node() {
          e.removeNode(new Node('nope'))
        }).toThrow('removing node which does not belong to this list')
      })

      it('remove node', () => {
        e = new Yallist(1, 2)
        e.removeNode(e.head!)
        expect(e).toEqual(new Yallist(2))

        e = new Yallist(1, 2)
        e.removeNode(e.tail!)
        expect(e).toEqual(new Yallist(1))
      })
    })

    it('shift all the way down', () => {
      const e = new Yallist()
      e.push(1)
      e.push(2)
      e.push(3)
      expect(e.shift()).toBe(1)
      expect(e.shift()).toBe(2)
      expect(e.shift()).toBe(3)
      expect(e.shift()).toBeUndefined()
    })

    it('pop all the way down', () => {
      const e = new Yallist()
      e.unshift(1)
      e.unshift(2)
      e.unshift(3)
      expect(e.pop()).toBe(1)
      expect(e.pop()).toBe(2)
      expect(e.pop()).toBe(3)
      expect(e.pop()).toBeUndefined()
    })
  })

  describe('iterate', () => {
    const e = new Yallist(1, 2, 3, 4)
    expect(Array.from(e)).toEqual([1, 2, 3, 4])
  })

  describe('splice', () => {
    let e = new Yallist(1, 2, 3, 4, 5)
    expect(e.splice(2, 0)).toEqual([])
    expect(e).toEqual(new Yallist(1, 2, 3, 4, 5))

    e = new Yallist(1, 2, 3, 4, 5)
    expect(e.splice(2, 1)).toEqual([3])
    expect(e).toEqual(new Yallist(1, 2, 4, 5))

    e = new Yallist(1, 2, 3, 4, 5)
    expect(e.splice(-2, 2)).toEqual([4, 5])
    expect(e).toEqual(new Yallist(1, 2, 3))

    e = new Yallist(1, 2, 3, 4, 5)
    expect(e.splice(2, 0, 6)).toEqual([])
    expect(e).toEqual(new Yallist(1, 2, 6, 3, 4, 5))

    e = new Yallist(1, 2, 3, 4, 5)
    expect(e.splice(-2, 10, 6, 7)).toEqual([4, 5])
    expect(e).toEqual(new Yallist(1, 2, 3, 6, 7))

    e = new Yallist(1, 2, 3, 4, 5)
    expect(e.splice(0, 0, 6)).toEqual([])
    expect(e).toEqual(new Yallist(6, 1, 2, 3, 4, 5))

    e = new Yallist(1, 2, 3, 4, 5)
    expect(e.splice(60, 0, 6)).toEqual([])
    expect(e).toEqual(new Yallist(1, 2, 3, 4, 5, 6))
  })
})
