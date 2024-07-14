export class Stream {
  src: string
  pos: number

  constructor(src: string) {
    this.src = src
    this.pos = 0
  }

  next() {
    if (!this.hasNext()) return null
    return this.src.at(this.pos++)
  }

  peek(offset = 0) {
    if (this.pos + offset >= this.src.length) return null
    return this.src.at(this.pos + offset)
  }

  hasNext() {
    return this.pos < this.src.length
  }
}
