
# Zen

An experimental programming language inspired by Smalltalk.

## Hello World example in Zen

```Zen
zen/rt/Runtime exec: (Function new: (
  zen/io/Console print: (String new: 'Hello, Zen!');
));
```

## Guidelines

1. Message passing as the fundamental construct.
2. Everything is an object.
3. Literals are syntactic sugar but they are objects internally.
4. Messages can be unary or keyword based.
5. Parenthesis decide message resolution in case of ambiguity.
