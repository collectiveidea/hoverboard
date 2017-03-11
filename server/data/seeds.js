import {
  User,
  Story,
  Headline,
  HeadlineRank
} from './models'

function usersList() {
  return [
    new User({
      id: '1',
      name: 'Jon Stokes',
      email: 'jstokes@maxclicky.com',
      website: 'https://github.com/jonstokes',
      password: 'foobarbazqux',
      role: 'admin'
    }),
    new User({
      id: '2',
      name: 'Willy Wonka',
      email: 'wwonka@maxclicky.com',
      website: 'https://example.com/',
      password: 'barfooquxbaz',
      user: 'user'
    })
  ]
}

function headlinesList() {
  return [
    new Headline({ id: '1', text: 'Lorem ipsum dolor sit amet, consectetur', storyId: '1', userId: '1', disabled: false }),
    new Headline({ id: '2', text: 'Donec ipsum dolor sit amet, consectetur', storyId: '1', userId: '1', disabled: false }),
    new Headline({ id: '3', text: 'Nulla ipsum dolor sit amet, consectetur', storyId: '1', userId: '1', disabled: true }),
    new Headline({ id: '4', text: 'Duis ipsum dolor sit amet, consectetur', storyId: '1', userId: '1', disabled: false }),
    new Headline({ id: '5', text: 'Donec vel quam consectetur risus commodo ultricies', storyId: '2', userId: '1', disabled: false }),
    new Headline({ id: '6', text: 'Nulla vel quam consectetur risus commodo ultricies', storyId: '2', userId: '1', disabled: false }),
    new Headline({ id: '7', text: 'Donec tincidunt in lacus ac convallis', storyId: '3', userId: '1', disabled: false }),
    new Headline({ id: '8', text: 'Nulla tincidunt in lacus ac convallis', storyId: '3', userId: '1', disabled: false }),
    new Headline({ id: '9', text: 'Nulla accumsan et sapien quis accumsan', storyId: '4', userId: '1', disabled: false }),
    new Headline({ id: '10', text: 'Lorem accumsan et sapien quis accumsan', storyId: '4', userId: '1', disabled: false }),
    new Headline({ id: '11', text: 'Ut molestie tellus in diam consequat tempor', storyId: '5', userId: '1', disabled: false }),
    new Headline({ id: '12', text: 'Ut two molestie tellus in diam consequat tempor', storyId: '5', userId: '1', disabled: false }),
    new Headline({ id: '13', text: 'Duis et quam non elit tristique tempus', storyId: '6', userId: '1', disabled: false }),
    new Headline({ id: '14', text: 'Duis two et quam non elit tristique tempus', storyId: '6', userId: '1', disabled: false }),
  ]
}

function storiesList() {
  return [
    new Story({ id: '1', url: 'http://foo.com/lorem-1', focusKeyword: 'tacos', archived: false, started: false, userId: '1' }),
    new Story({ id: '2', url: 'http://foo.com/lorem-2', focusKeyword: 'tacos', archived: false, started: false, userId: '1' }),
    new Story({ id: '3', url: 'http://foo.com/lorem-3', focusKeyword: 'tacos', archived: false, started: false, userId: '1' }),
    new Story({ id: '4', url: 'http://foo.com/lorem-4', focusKeyword: 'tacos', archived: false, started: true, userId: '1' }),
    new Story({ id: '5', url: 'http://foo.com/lorem-5', focusKeyword: 'tacos', archived: true, started: true, userId: '1' }),
    new Story({ id: '6', url: 'http://foo.com/lorem-6', focusKeyword: 'tacos', archived: false, started: false, userId: '2' }),
  ]
}

function headlineRanksList() {
  return [
    new HeadlineRank({ id: '1', headlineId: '1', rank: 0, userId: '1' }),
    new HeadlineRank({ id: '2', headlineId: '2', rank: 1, userId: '1' }),
    new HeadlineRank({ id: '3', headlineId: '3', rank: 2, userId: '1' }),
    new HeadlineRank({ id: '4', headlineId: '4', rank: 3, userId: '1' }),
    new HeadlineRank({ id: '5', headlineId: '5', rank: 0, userId: '1' }),
    new HeadlineRank({ id: '6', headlineId: '6', rank: 1, userId: '1' }),
    new HeadlineRank({ id: '7', headlineId: '7', rank: 0, userId: '1' }),
    new HeadlineRank({ id: '8', headlineId: '8', rank: 1, userId: '1' }),
    new HeadlineRank({ id: '9', headlineId: '9', rank: 0, userId: '1' }),
    new HeadlineRank({ id: '10', headlineId: '10', rank: 1, userId: '1' }),
    new HeadlineRank({ id: '11', headlineId: '11', rank: 0, userId: '1' }),
    new HeadlineRank({ id: '12', headlineId: '12', rank: 1, userId: '1' }),
    new HeadlineRank({ id: '13', headlineId: '13', rank: 0, userId: '1' }),
    new HeadlineRank({ id: '14', headlineId: '14', rank: 1, userId: '1' })
  ]
}

export {
  usersList,
  headlinesList,
  storiesList,
  headlineRanksList
}
