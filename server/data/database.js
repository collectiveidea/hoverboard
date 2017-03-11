import Logger from '../utils/logger'

import {
  Headline
} from './models'

import {
  usersList,
  headlinesList,
  storiesList,
  headlineRanksList
} from './seeds'

class Database {
  constructor(users, headlines, stories, headlineRanks) {
    this.usersList = users
    this.headlinesList = headlines
    this.storiesList = stories
    this.headlineRanksList = headlineRanks

    this.getUser = this.getUser.bind(this)
    this.getStory = this.getStory.bind(this)
    this.getHeadline = this.getHeadline.bind(this)
    this.getStories = this.getStories.bind(this)
    this.updateHeadline = this.updateHeadline.bind(this)
    this.updateHeadlines = this.updateHeadlines.bind(this)
    this.insertHeadline = this.insertHeadline.bind(this)
    this.updateHeadlineRank = this.updateHeadlineRank.bind(this)

    this.viewer = null
    this.withViewer = this.withViewer.bind(this)

    this.reset = this.reset.bind(this)
  }

  reset() {
    this.usersList = usersList()
    this.headlinesList = headlinesList()
    this.storiesList = storiesList()
    this.headlineRanksList = headlineRanksList()
  }

  // Queries

  getUser(id) {
    const user = this.usersList.find(u => u.id === id)
    Logger.log('Database.getUser', id, user)
    return user
  }

  getUserByCredentials(creds) {
    // TODO: Match password
    const { email } = creds
    const user = this.usersList.find(u => u.email === email)
    Logger.log('getUserByCredentials', creds, user)
    return user
  }

  getStory(id) {
    const story = this.storiesList.find(s => s.id === id)
    Logger.log('Database.getStory', id, story)
    return story
  }

  getHeadline(id) {
    const headline = this.headlinesList.find(h => h.id === id)
    Logger.log('Database.getHeadline', id, headline)
    return headline
  }

  getStories(args, filterFunction) {
    const userStories = this.storiesList.filter(s => (s.userId === this.viewer.id))
    const stories = this.getFromList(userStories, args, filterFunction)
    Logger.log('Database.getStories', args, stories)
    return stories
  }

  getHeadlines(args, story) {
    let headlines = this.headlinesList.filter(
      h => h.storyId === story.id
    ).sort((a, b) => this.getHeadlineRank(a.id).rank > this.getHeadlineRank(b.id).rank)

    headlines = this.getFromList(headlines, args)

    Logger.log('Database.getHeadlines', { args, story }, headlines)
    return headlines
  }

  // Mutations
  updateHeadline(headlineId, newAttrs, rank) {
    const headline = this.getHeadline(headlineId)

    // Update any attr keys, but skip local id, mutation id, and rank.
    Object.keys(newAttrs).forEach((key) => {
      if ((key !== 'id') && (key !== 'clientMutationId') && (key !== 'rank')) {
        headline[key] = newAttrs[key]
      }
    })

    // If rank needs updating, update the rank object.
    if (!(rank === undefined)) {
      this.updateHeadlineRank(headline.id, rank)
    }

    Logger.log('Database.updateHeadline', { headlineId, newAttrs, rank }, headline)
    return headline
  }

  updateHeadlines(headlines) {
    // loop through headlines and update them.
    headlines.forEach((newHeadlineAttrs, index) => {
      this.updateHeadline(newHeadlineAttrs.id, newHeadlineAttrs, index)
    })
    Logger.log('Database.updateHeadlines', {}, headlines)
    return headlines
  }

  insertHeadline(headlineAttrs) {
    const headline = new Headline({
      id: headlineAttrs.id,
      text: headlineAttrs.text,
      storyId: headlineAttrs.storyId,
      userId: this.viewer.id,
      disabled: headlineAttrs.disabled
    })
    // Create headlineRank object
    return this.headlinesList.push(headline)
  }

  // private

  withViewer(newViewer) {
    this.viewer = newViewer
    return this
  }

  updateHeadlineRank(headlineId, newRank) {
    const headlineRank = this.getHeadlineRank(headlineId)
    headlineRank.rank = newRank
    Logger.log('updateHeadlineRank', { headlineId, newRank })
    return headlineRank
  }

  getHeadlineRank(headlineId) {
    const headlineRank = this.headlineRanksList.find(
      hr => (hr.headlineId === headlineId) && (hr.userId === this.viewer.id)
    )
    Logger.log('getHeadlineRank', headlineId, headlineRank)
    return headlineRank
  }

  getFromList(list, { first, after, last, before, limit }, filterFunction = () => true) {
    if (first) {
      return list.filter(filterFunction).slice(0, first)
    } else if (last) {
      return list.filter(filterFunction).slice(-last)
    } else if (after) {
      return list.filter(filterFunction).slice(after + 1, list.length)
    } else if (before) {
      return list.filter(filterFunction).slice(0, before)
    }
    return list.filter(filterFunction)
  }
}

export default new Database(usersList(), headlinesList(), storiesList(), headlineRanksList())
