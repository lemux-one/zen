import { Stream } from './stream.ts'

export class Token {
  type: string
  lexema?: string

  constructor(type: string, lexema?: string) {
    this.type = type
    this.lexema = lexema
  }
}

export class Lexer {
  stream: Stream
  char: string
  lexema: string

  constructor(stream: Stream) {
    this.stream = stream
    this.char = ''
    this.lexema = ''
  }

  next() {
    this.consume()
    if (this.isBlank() && !this.lexema) this.skip()
    return null
  }

  consume() {
    const next = this.stream.next()
    if (next) this.char = next
    else throw new Error('ERR::Lexer: Input stream ended unexpectedly')
  }

  isBlank() {
    return ' \t\n'.includes(this.char)
  }

  skip() {
    while (this.isBlank()) this.consume()
  }
}
