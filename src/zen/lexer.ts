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
    const next = this.stream.peek()
    if (next) {
      this.consume()
      if (this.blank(next) && !this.lexema) this.skip()
      if (this.char === "'") return this.str()
      if (this.digit(next)) return this.num()
    }
    return null
  }

  num() {
    this.lexema = ''
    let float = false
    let next = this.stream.peek()
    while (next && (this.digit(next) || this.sym(next, '.') || this.sym(next, '_'))) {
      this.consume()
      if (this.sym(this.char, '.')) {
        if (float) this.err('Numbers can have only one period (".").')
        float = true
      }
      if (!this.sym(this.char, '_')) this.lexema += this.char
      next = this.stream.peek()
    }
    return new Token('num', this.takeLexema())
  }

  sym(char: string, expected?: string) {
    if (expected) return char === expected
    return '._;:[]{}()'.includes(char)
  }

  digit(char: string) {
    return '1234567890'.includes(char)
  }

  str() {
    this.consume("'") // eat the initial quote
    if (this.stream.peek() === "'") {
      this.consume("'")
      return new Token('str', '')
    }
    this.consume() // advance to actual first char
    while (this.char !== "'") {
      this.lexema += this.char
      this.consume()
    }
    return new Token('str', this.takeLexema())
  }

  consume(expected?: string) {
    if (!this.stream.hasNext()) {
      this.err('Unable to consume, stream ended early.')
    }
    const next = this.stream.next()
    if (expected && next !== expected) {
      this.err(`Expected "${expected}", found "${next}".`)
    }
    this.char = next ?? ''
  }

  blank(char: string) {
    return ' \t\n'.includes(char)
  }

  skip() {
    while (this.blank(this.char)) this.consume()
  }

  takeLexema() {
    const current = this.lexema
    this.lexema = ''
    return current
  }

  err(details = 'Parsing failure.') {
    throw new Error(`ERR::Lexer: ${details}`)
  }
}
