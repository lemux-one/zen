import { Stream } from './stream.ts'
import { Token, TokenType } from './token.ts'

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
    let next = this.stream.peek()
    if (next !== null && next !== undefined) {
      if (this.blank(next)) {
        this.skip()
        next = this.stream.peek()
        if (next === null || next === undefined) return null
      }
      if (next === "'") return this.str()
      if (this.digit(next)) return this.num()
      if (this.special(next)) return this.sym()
      return this.term()
    }
    return null
  }

  term() {
    let next = this.stream.peek() ?? ''
    while (next && !this.blank(next) && !'()[]{}:,|'.includes(next)) {
      this.consume()
      this.lexema += this.char
      next = this.stream.peek() ?? ''
    }
    return new Token(TokenType.TERM, this.takeLexema())
  }

  sym() {
    this.consume()
    switch (this.char) {
      case '(':
        return new Token(TokenType.L_PAR)
      case ')':
        return new Token(TokenType.R_PAR)
      case '[':
        return new Token(TokenType.L_BKT)
      case ']':
        return new Token(TokenType.R_BKT)
      case '{':
        return new Token(TokenType.L_BRA)
      case '}':
        return new Token(TokenType.R_BRA)
      case ';':
        return new Token(TokenType.SEMI)
      case ':':
        return new Token(TokenType.COLON)
      case '_':
        return new Token(TokenType.UNDER)
      case '.':
        return new Token(TokenType.DOT)
      case ',':
        return new Token(TokenType.COMA)
      case '/':
        return new Token(TokenType.SLASH)
      case '|':
        return new Token(TokenType.BAR)
      default:
        this.err('Unreachable code.')
    }
  }

  num() {
    let float = false
    let next = this.stream.peek()
    while (next && (this.digit(next) || this.special(next, '.') || this.special(next, '_'))) {
      this.consume()
      if (this.special(this.char, '.')) {
        if (float) this.err('Numbers can have only one period (".").')
        float = true
      }
      if (!this.special(this.char, '_')) this.lexema += this.char
      next = this.stream.peek()
    }
    return new Token(TokenType.NUMBER, this.takeLexema())
  }

  special(char: string, expected?: string) {
    if (expected) return char === expected
    return ',._;:/[]{}()|'.includes(char)
  }

  digit(char: string) {
    return '1234567890'.includes(char)
  }

  str() {
    this.consume("'") // eat the initial quote
    if (this.stream.peek() === "'") {
      this.consume("'")
      return new Token(TokenType.STRING, '')
    }
    this.consume() // advance to actual first char
    while (this.char !== "'") {
      this.lexema += this.char
      this.consume()
    }
    return new Token(TokenType.STRING, this.takeLexema())
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
    let next = this.stream.peek()
    while (next !== null && next !== undefined && this.blank(next)) {
      this.consume(next)
      next = this.stream.peek()
    }
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
