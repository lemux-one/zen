export class Queue<T> {
  elems: T[]

  constructor() {
    this.elems = []
  }

  length() {
    return this.elems.length
  }

  push(elem?: T | null) {
    elem && this.elems.push(elem)
  }

  pop() {
    return this.elems.shift()
  }

  peek(offset = 1) {
    const index = -1 + offset
    return index >= this.elems.length ? undefined : this.elems.at(-1 + offset)
  }

  empty() {
    return this.length() === 0
  }

  clear() {
    this.elems = []
  }
}
