/* global describe it expect beforeEach */

import Database from '../data/database'
import { Headline } from '../data/models'

describe('Database', () => {
  const viewer = Database.getUser('1')
  const db = Database.withViewer(viewer)

  beforeEach(() => {
    Database.reset()
  })

  describe('getUser', () => {
    it('gets the user by ID', () => {
      const user = db.getUser('1')
      expect(user.id).toBe('1')
      expect(user.email).toBe('jstokes@maxclicky.com')
    })
  })

  describe('getStory', () => {
    it('gets the story for a viewer and ID', () => {
      const story = db.getStory('1')
      const expectedStory = {
        id: '1',
        userId: db.viewer.id,
        archived: false,
        started: false,
        url: 'http://foo.com/lorem-1',
        focusKeyword: 'tacos'
      }
      expect(story).toEqual(expectedStory)
    })
  })

  describe('getHeadline', () => {
    it('gets a headline with a rank for a viewer', () => {
      const expectedHeadline = {
        id: '1',
        disabled: false,
        storyId: '1',
        text: 'Lorem ipsum dolor sit amet, consectetur',
        userId: '1'
      }
      const headline = db.getHeadline('1')
      expect(headline).toEqual(expectedHeadline)
    })
  })

  describe('getStories', () => {
    it('gets a list of stories for a user', () => {
      const expectedStoryIds = ['1', '2', '3', '4', '5']
      const storyIds = db.getStories({}).map(s => s.id)

      expect(storyIds).toEqual(expectedStoryIds)
    })
  })

  describe('getHeadlines', () => {
    it('gets an ordered list of headlines for a story with ranks', () => {
      // Re-order the headlines so that the ranks don't equal IDs and regular order.
      db.updateHeadlineRank('1', 3)
      db.updateHeadlineRank('4', 0)

      const story = db.getStory('1')
      const headlines = db.getHeadlines({}, story)

      // Now the test
      expect(headlines.map(h => db.getHeadlineRank(h.id).rank)).toEqual([0, 1, 2, 3])
      expect(headlines.map(h => h.id)).toEqual(['4', '2', '3', '1'])
    })
  })

  describe('updateHeadlineRank', () => {
    it('updates a headline rank', () => {
      db.updateHeadlineRank('1', 6)
      expect(db.getHeadlineRank('1').rank).toBe(6)
    })
  })

  describe('updateHeadline', () => {
    it('updates a headline, rank included', () => {
      db.updateHeadline('1', { disabled: true }, 6)

      const headline = db.getHeadline('1')
      expect(db.getHeadlineRank('1').rank).toBe(6)
      expect(headline.disabled).toBe(true)
    })

    it('does not step on the headline\'s id', () => {
      db.updateHeadline('1', { id: '17' })

      const headline = db.getHeadline('1')
      expect(headline.id).toBe('1')
    })

    it('does not add a clientMutationId key to the headline', () => {
      db.updateHeadline('1', { clientMutationId: '22' })

      const headline = db.getHeadline('1')
      expect(headline.clientMutationId).not.toBeDefined()
    })
  })

  describe('updateHeadlines', () => {
    it('updates a story\'s headlines', () => {
      const story = db.getStory('1')
      const newHeadlineAttrsList = [
        new Headline({ id: '4', text: 'Duis ipsum dolor sit amet, consectetur', storyId: '1', userId: '1', disabled: false }),
        new Headline({ id: '2', text: 'Donec ipsum dolor sit amet, consectetur', storyId: '1', userId: '1', disabled: false }),
        new Headline({ id: '3', text: 'Nulla ipsum dolor sit amet, consectetur', storyId: '1', userId: '1', disabled: true }),
        new Headline({ id: '1', text: 'Lorem ipsum dolor sit amet, consectetur', storyId: '1', userId: '1', disabled: false }),
      ]

      db.updateHeadlines(newHeadlineAttrsList)

      const headlines = db.getHeadlines({}, story)

      expect(headlines.map(h => h.id)).toEqual(['4', '2', '3', '1'])
      expect(headlines.map(h => db.getHeadlineRank(h.id).rank)).toEqual([0, 1, 2, 3])
    })
  })
})
