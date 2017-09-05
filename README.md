# graphql-interface-inliner
Manually implementing interfaces in GraphQL is lame.  This tool inlines interfaces fields into types that implement interfaces.

This makes it to easier maintain your schema.  Simply run this on a "dehydrated" schema, and it will produce a "hydrated" schema that can be used with tools that take graph ql schemas as input such as [Graphcool](https://www.graph.cool/) or [Apollo Server](http://dev.apollodata.com/tools).

## Install:
```npm install -g graphql-interface-inliner```

## Usage:
```
graphql-interface-inliner [options] <file>
inlines interface definitions into type definitions

  Options:

    -V, --version  output the version number
    -i, --input    Print the input schema
    -a, --ast      Print the input ast
    -o, --outast   Print the output ast
    -h, --help     output usage information
```


## Example:
### Input File
```
interface Node {
  id: ID!
}

interface Character {
  name: String!
  friends: [Character]
  appearsIn: [Episode]!
}

type Human implements Node, Character {
  starships: [Starship]
  totalCredits: Int
}

type Droid implements Node, Character {
  primaryFunction: String
}

type Starship implements Node {
}

type Episode implements Node {
}
```

### Output
```
interface Node {
  id: ID!
}

interface Character {
  name: String!
  friends: [Character]
  appearsIn: [Episode]!
}

type Human implements Node, Character {
  id: ID!
  name: String!
  friends: [Character]
  appearsIn: [Episode]!
  starships: [Starship]
  totalCredits: Int
}

type Droid implements Node, Character {
  id: ID!
  name: String!
  friends: [Character]
  appearsIn: [Episode]!
  primaryFunction: String
}

type Starship implements Node {
  id: ID!
}

type Episode implements Node {
  id: ID!
}
```

### TODO
* support input from stdin
* better error messages