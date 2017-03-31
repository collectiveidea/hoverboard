# Hoverboard
An opinionated react + relay + graphql boilerplate (isomorphic, passportjs, postgresql, express, etc.)

# About

I've been a big fan and user of [relay-fullstack](https://github.com/lvarayut/relay-fullstack/),
but it lacks a number of specific things that I use and need. So I end
up spending a bunch of time tweaking it before I can really get started
with it.

Hoverboard, then, is an attempt to build a boilerplate based on `relay-fullstack` but
that contains more of what I'd typically want in any new project, like
user login with `passportjs` and JWT, `postgresql`, some basic
mutations, testing with Jest, and so on.

Here are some of the changes I'm making to the original boilerplate:

- A better starter database interface that's less of a pain to extend and use.
- A directory structure where the code is broken up into more files.
- All the graphql queries are built on a default `viewer` query.

For more, see the next section.

# Technologies

This project includes everything listed on the [relay-fullstack](https://github.com/lvarayut/relay-fullstack/)
page, and adds the following:

- Authentication via `passportjs` (database-only, for now).
- Postgresql, possibly with stored procedures in `.sql`files.
- Jest for testing, and full test coverage for what's included.
- [Breakpoint debugging](https://medium.com/@paul_irish/debugging-node-js-nightlies-with-chrome-devtools-7c4a1b95ae27#.mryvehymk) with `devtool` that works inside Jest tests.
- React Storybook stories for the default included components.
- Travis CI integration

# Setup
You'll need yarn installed, so if you're on OS X then `brew update && brew install yarn`.

Clone the repo and rename it to whatever you want, then go into the directory and `yarn install`.
