# relaid
An opinionated react + relay + graphql boilerplate (isomorphic, passportjs, postgresql, express, etc.)

# About

I've been a big fan and user of [relay-fullstack](https://github.com/collectiveidea/relaid.git), 
but it lacks a number of specific things that I use and need. So I end
up spending a bunch of time tweaking it before I can really get started
with it.

Relaid, then, is an attempt to build a boilerplate based on `relay-fullstack` but
that contains more of what I'd typically want in any new project, like
user login with `passportjs` and JWT, `postgresql`, some basic
mutations, testing with Jest, and so on.

# Technologies

This project includes everything listed on the [relay-fullstack](https://github.com/collectiveidea/relaid.git)
page, and adds the following:

- A better starter database interface that's less of a pain to extend and use.
- A directory structure where the code is broken up into more files.
- Authentication via `passportjs` (database-only, for now).
- All the graphql queries are built on a default `viewer` query.
- Postgresql, possibly with stored procedures in `.sql`files.
- Jest for testing, and full test coverage for what's included.
- Breakpoint debugging with `devtool` that works inside Jest tests.
- React Storybook stories for the default included components.
- Travis CI integration
