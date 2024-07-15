import { assertEquals, assertThrows } from '$std/assert/mod.ts'
import { Lexer } from '../../src/zen/lexer.ts'
import { Stream } from '../../src/zen/stream.ts'

Deno.test(function constructor_simpleTest() {
  const lexer = new Lexer(new Stream('abc'))
  assertEquals(lexer.stream.src, 'abc')
  assertEquals(lexer.char, '')
  assertEquals(lexer.lexema, '')
})

Deno.test(function consume_Test() {
  const lexer = new Lexer(new Stream('a'))
  assertEquals(lexer.char, '')
  lexer.consume()
  assertEquals(lexer.char, 'a')
  assertThrows(lexer.consume)
})

Deno.test(function isBlank_whenSpaceTest() {
  const lexer = new Lexer(new Stream(' '))
  lexer.consume()
  assertEquals(lexer.isBlank(), true)
})

Deno.test(function isBlank_whenTabTest() {
  const lexer = new Lexer(new Stream('\t'))
  lexer.consume()
  assertEquals(lexer.isBlank(), true)
})

Deno.test(function isBlank_whenLineFeedTest() {
  const lexer = new Lexer(new Stream('\n'))
  lexer.consume()
  assertEquals(lexer.isBlank(), true)
})

Deno.test(function skip_whenSingleBlankTest() {
  const lexer = new Lexer(new Stream('\n;'))
  lexer.consume()
  lexer.skip()
  assertEquals(lexer.char, ';')
})

Deno.test(function skip_whenMultipleBlanksTest() {
  const lexer = new Lexer(new Stream('  \t\t\n\n;'))
  lexer.consume()
  lexer.skip()
  assertEquals(lexer.char, ';')
})
