import { assertEquals } from '$std/assert/mod.ts'
import { Queue } from '../../src/common/queue.ts'

const { test } = Deno

test(function new_Test() {
  const q = new Queue()
  assertEquals(q.elems.length, 0)
})

test(function push_Test() {
  const q = new Queue<string>()
  q.push('dummy')
  assertEquals(q.length(), 1)
})

test(function peek_Test() {
  const q = new Queue<string>()
  q.push('dummy')
  q.push('more')
  assertEquals(q.peek(), 'dummy')
  assertEquals(q.peek(2), 'more')
  assertEquals(q.peek(3), undefined)
})

test(function pop_Test() {
  const q = new Queue<string>()
  q.push('dummy')
  assertEquals(q.length(), 1)
  assertEquals(q.pop(), 'dummy')
  assertEquals(q.length(), 0)
  assertEquals(q.pop(), undefined)
  assertEquals(q.length(), 0)
})

test(function empty_Test() {
  const q = new Queue<string>()
  assertEquals(q.empty(), true)
  q.push('dummy')
  assertEquals(q.empty(), false)
})

test(function clear_Test() {
  const q = new Queue<string>()
  q.push('dummy')
  assertEquals(q.empty(), false)
  q.clear()
  assertEquals(q.empty(), true)
})
