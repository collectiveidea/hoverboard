import User from 'models/user'
import Post from 'models/post'

function usersList() {
  return [
    new User({
      id: '1',
      name: 'Jon Stokes',
      email: 'jon@collectiveidea.com',
      website: 'https://github.com/jonstokes',
      password: 'foobarbazqux',
      role: 'admin'
    }),
    new User({
      id: '2',
      name: 'Willy Wonka',
      email: 'wwonka@collectiveidea.com',
      website: 'https://example.com/',
      password: 'barfooquxbaz',
      user: 'user'
    })
  ]
}

function postsList() {
  return [
    new Post({ id: '1', title: 'This is a taco post', body: 'Mmmm... tacos.', userId: '1' }),
    new Post({ id: '2', url: 'This is burrito post', body: 'Mmmm... burritos.', userId: '1' }),
  ]
}

export {
  usersList,
  postsList,
}
