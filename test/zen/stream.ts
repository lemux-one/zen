import { assertEquals } from '$std/assert/mod.ts'
import { Stream } from '../../src/zen/stream.ts'

Deno.test(function constructor_simpleTest() {
  const stream = new Stream('abc')
  assertEquals(stream.src, 'abc')
  assertEquals(stream.pos, 0)
})

Deno.test(function hasNext_whenEmptyReturnsFalseTest() {
  const stream = new Stream('')
  assertEquals(stream.hasNext(), false)
})

Deno.test(function hasNext_whenNonEmptyReturnsTrueTest() {
  const stream = new Stream('a')
  assertEquals(stream.hasNext(), true)
})

Deno.test(function next_whenLastCharactersTest() {
  const stream = new Stream('abc')
  assertEquals(stream.next(), 'a')
  assertEquals(stream.next(), 'b')
  assertEquals(stream.next(), 'c')
  assertEquals(stream.next(), null)
})

Deno.test(function peek_whenDefaultOffsetTest() {
  const stream = new Stream('abc')
  assertEquals(stream.peek(), 'a')
  assertEquals(stream.next(), 'a')
})
