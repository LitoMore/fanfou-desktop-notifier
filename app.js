'use strict'

const Streamer = require('fanfou-streamer')
const notifier = require('node-notifier')
const Fanfou = require('fanfou-sdk')

const {
  CONSUMER_KEY,
  CONSUMER_SECRET,
  OAUTH_TOKEN,
  OAUTH_TOKEN_SECRET
} = require('./config')

const streamer = new Streamer({
  consumerKey: CONSUMER_KEY,
  consumerSecret: CONSUMER_SECRET,
  oauthToken: OAUTH_TOKEN,
  oauthTokenSecret: OAUTH_TOKEN_SECRET
})

const ff = new Fanfou({
  auth_type: 'oauth',
  consumer_key: CONSUMER_KEY,
  consumer_secret: CONSUMER_SECRET,
  oauth_token: OAUTH_TOKEN,
  oauth_token_secret: OAUTH_TOKEN_SECRET
})

const replyBox = (message, res) => {
  notifier.notify({
    title: '饭否',
    message,
    reply: true
  }, (error, response, metadata) => {
    if (!error && metadata && metadata.activationType === 'replied') {
      ff.post('/statuses/update', {
        in_reply_to_status_id: res.object.id,
        status: `@${res.source.screen_name} ${metadata.activationValue}`
      }, () => {})
    }
  })
}

const messageBox = (message, res) => {
  notifier.notify({
    title: '饭否',
    message
  })
}

// Mentions
streamer.on('message.mention', res => {
  replyBox(`@${res.source.screen_name} 提到了你\n${res.object.text}`, res)
})

// Reply
streamer.on('message.reply', res => {
  replyBox(`@${res.source.screen_name} 回复了你\n${res.object.text}`, res)
})

// Repost
streamer.on('message.repost', res => {
  replyBox(`@${res.source.screen_name} 转发了\n${res.object.text}`, res)
})

// Add fav
streamer.on('fav.create', res => {
  replyBox(`@${res.source.screen_name} 收藏了\n${res.object.text}`, res)
})

// Del fav
streamer.on('fav.delete', res => {
  replyBox(`@${res.source.screen_name} 取消收藏了\n${res.object.text}`, res)
})

// Create direct message
streamer.on('dm.create', res => {
  messageBox(`@${res.source.screen_name} 私信了你\n${res.object.text}`, res)
})

// Create friend
streamer.on('friends.create', res => {
  messageBox(`@${res.source.screen_name} 关注了你`)
})

// Request friend
streamer.on('friends.request', res => {
  messageBox(`@${res.source.screen_name} 请求关注你`)
})

streamer.start()
