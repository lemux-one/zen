
# Zen

An experimental programming language inspired by Smalltalk.

## Hello World example in Zen

```Zen
'Importing from vendor zen'
Console from: 'zen/io'
Runtime from: 'zen/rt'

'Storing a block literal as a callable object'
greet =: [name|
  'Returns a greeting message given a name'
  * =: 'Hello, ${}!' $: name
]

'Execution entry point'
Runtime exec: [
  Console print: (greet call: 'Zen')
]
```

## Guidelines

1. Message passing as the fundamental construct.
2. Everything is an object.
3. Literals are syntactic sugar but they are objects internally.
4. Messages can be unary or keyword based.
5. Parenthesis decide message resolution in case of ambiguity.
