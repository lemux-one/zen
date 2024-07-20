import { assertEquals, assertThrows } from '$std/assert/mod.ts'
import { Lexer } from '../../src/zen/lexer.ts'
import { Stream } from '../../src/zen/stream.ts'
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
  lexer.consume()
  lexer.skip()
  assertEquals(lexer.char, ';')
})

test(function skip_whenMultipleBlanksTest() {
  const lexer = new Lexer(new Stream('  \t\t\n\n;'))
  lexer.consume()
  lexer.skip()
  assertEquals(lexer.char, ';')
})

test(function str_simpleTest() {
  const stream = new Stream("'abc'")
  const lexer = new Lexer(stream)
  const strToken = lexer.str()
  assertEquals(strToken.type, 'str')
  assertEquals(strToken.lexema, 'abc')
})

test(function str_emptyTest() {
  const stream = new Stream("''")
  const lexer = new Lexer(stream)
  const strToken = lexer.str()
  assertEquals(strToken.type, 'str')
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
  assertEquals(numToken.type, 'num')
  assertEquals(numToken.lexema, '165')
})

test(function num_floatTest() {
  const lexer = new Lexer(new Stream('1.5'))
  const numToken = lexer.num()
  assertEquals(numToken.type, 'num')
  assertEquals(numToken.lexema, '1.5')
})

test(function num_floatWithMultiplePeriodsTest() {
  const lexer = new Lexer(new Stream('1..5'))
  assertThrows(lexer.num)
})

test(function num_floatWithUnderscoreTest() {
  const lexer = new Lexer(new Stream('1_000_000.5'))
  const numToken = lexer.num()
  assertEquals(numToken.type, 'num')
  assertEquals(numToken.lexema, '1000000.5')
})
