class User {
  constructor({ id, name, email, website, password, role }) {
    this.id = id
    this.name = name
    this.email = email
    this.website = website
    this.password = password
    this.role = role
  }
}

class Post {
  constructor({ id, title, body, userId }) {
    this.id = id;
    this.title = title;
    this.body = body;
    this.userId = userId;
  }
}

export { User, Post }
