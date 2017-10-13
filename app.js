'use strict'

const Streamer = require('fanfou-streamer')
const notifier = require('node-notifier')
const Fanfou = require('fanfou-sdk')

const {
  CONSUMER_KEY: consumerKey,
  CONSUMER_SECRET: consumerSecret,
  OAUTH_TOKEN: oauthToken,
  OAUTH_TOKEN_SECRET: oauthTokenSecret
} = require('./config')

const options = {
  consumerKey,
  consumerSecret,
  oauthToken,
  oauthTokenSecret
}

const streamer = new Streamer(options)
const ff = new Fanfou(options)

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
