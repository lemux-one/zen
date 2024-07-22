import { assertEquals, assertThrows } from '$std/assert/mod.ts'
import { Lexer } from '../../src/zen/lexer.ts'
import { Stream } from '../../src/zen/stream.ts'
import { TokenType } from '../../src/zen/token.ts'
const { test } = Deno

test(function constructor_simpleTest() {
  const lexer = new Lexer(new Stream('abc'))
  assertEquals(lexer.stream.src, 'abc')
  assertEquals(lexer.char, '')
  assertEquals(lexer.lexema, '')
})

test(function consume_Test() {
  const lexer = new Lexer(new Stream('a'))
  assertEquals(lexer.char, '')
  lexer.consume()
  assertEquals(lexer.char, 'a')
  assertThrows(lexer.consume)
})

test(function consume_expectedMatchesTest() {
  const lexer = new Lexer(new Stream('b'))
  assertEquals(lexer.char, '')
  lexer.consume('b')
  assertEquals(lexer.char, 'b')
})

test(function consume_expectedDoesNotMatchTest() {
  const lexer = new Lexer(new Stream('b'))
  assertEquals(lexer.char, '')
  assertThrows(() => lexer.consume('a'))
  assertEquals(lexer.char, '')
})

test(function blank_whenSpaceTest() {
  const lexer = new Lexer(new Stream(' '))
  lexer.consume()
  assertEquals(lexer.blank(lexer.char), true)
})

test(function blank_whenTabTest() {
  const lexer = new Lexer(new Stream('\t'))
  lexer.consume()
  assertEquals(lexer.blank(lexer.char), true)
})

test(function blank_whenLineFeedTest() {
  const lexer = new Lexer(new Stream('\n'))
  lexer.consume()
  assertEquals(lexer.blank(lexer.char), true)
})

test(function skip_whenSingleBlankTest() {
  const lexer = new Lexer(new Stream('\n;'))
  lexer.skip()
  lexer.consume()
  assertEquals(lexer.char, ';')
})

test(function skip_whenMultipleBlanksTest() {
  const lexer = new Lexer(new Stream('  \t\t\n\n;'))
  lexer.skip()
  lexer.consume()
  assertEquals(lexer.char, ';')
})

test(function str_simpleTest() {
  const stream = new Stream("'abc'")
  const lexer = new Lexer(stream)
  const strToken = lexer.str()
  assertEquals(strToken.type, TokenType.STRING)
  assertEquals(strToken.lexema, 'abc')
})

test(function str_emptyTest() {
  const stream = new Stream("''")
  const lexer = new Lexer(stream)
  const strToken = lexer.str()
  assertEquals(strToken.type, TokenType.STRING)
  assertEquals(strToken.lexema, '')
})

test(function takeLexema_simpleTest() {
  const lexer = new Lexer(new Stream(''))
  assertEquals(lexer.lexema, '')
  lexer.lexema = 'dummy'
  const taken = lexer.takeLexema()
  assertEquals(taken, 'dummy')
  assertEquals(lexer.lexema, '')
})

test(function num_integerTest() {
  const lexer = new Lexer(new Stream('165'))
  const numToken = lexer.num()
  assertEquals(numToken.type, TokenType.NUMBER)
  assertEquals(numToken.lexema, '165')
})

test(function num_floatTest() {
  const lexer = new Lexer(new Stream('1.5'))
  const numToken = lexer.num()
  assertEquals(numToken.type, TokenType.NUMBER)
  assertEquals(numToken.lexema, '1.5')
})

test(function num_floatWithMultiplePeriodsTest() {
  const lexer = new Lexer(new Stream('1..5'))
  assertThrows(lexer.num)
})

test(function num_floatWithUnderscoreTest() {
  const lexer = new Lexer(new Stream('1_000_000.5'))
  const numToken = lexer.num()
  assertEquals(numToken.type, TokenType.NUMBER)
  assertEquals(numToken.lexema, '1000000.5')
})

test(function next_nullWhenAllBlanksTest() {
  const lexer = new Lexer(new Stream('  \t\n '))
  assertEquals(lexer.stream.hasNext(), true)
  assertEquals(lexer.next(), null)
})

test(function next_strTokenTest() {
  const lexer = new Lexer(new Stream("'dummy'"))
  assertEquals(lexer.stream.hasNext(), true)
  const strToken = lexer.next()
  assertEquals(strToken?.type, TokenType.STRING)
  assertEquals(strToken?.lexema, 'dummy')
  assertEquals(lexer.next(), null)
})

test(function next_numTokenTest() {
  const lexer = new Lexer(new Stream("0.5"))
  assertEquals(lexer.stream.hasNext(), true)
  const strToken = lexer.next()
  assertEquals(strToken?.type, TokenType.NUMBER)
  assertEquals(strToken?.lexema, '0.5')
  assertEquals(lexer.next(), null)
})

test(function sym_openClosePairsTest() {
  const lexer = new Lexer(new Stream('[]{}()'))
  assertEquals(lexer.next()?.type, TokenType.L_BKT)
  assertEquals(lexer.next()?.type, TokenType.R_BKT)
  assertEquals(lexer.next()?.type, TokenType.L_BRA)
  assertEquals(lexer.next()?.type, TokenType.R_BRA)
  assertEquals(lexer.next()?.type, TokenType.L_PAR)
  assertEquals(lexer.next()?.type, TokenType.R_PAR)
  assertEquals(lexer.next(), null)
})

test(function sym_singlesTest() {
  const lexer = new Lexer(new Stream(',._;:/'))
  assertEquals(lexer.next()?.type, TokenType.COMA)
  assertEquals(lexer.next()?.type, TokenType.DOT)
  assertEquals(lexer.next()?.type, TokenType.UNDER)
  assertEquals(lexer.next()?.type, TokenType.SEMI)
  assertEquals(lexer.next()?.type, TokenType.COLON)
  assertEquals(lexer.next()?.type, TokenType.SLASH)
  assertEquals(lexer.next(), null)
})
