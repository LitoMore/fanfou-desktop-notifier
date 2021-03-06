# fanfou-desktop-notifier

Fanfou Desktop Notifier

## Requirements

- **macOS**: >= 10.8 or Growl if earlier.
- **Linux**: `notify-osd` or `libnotify-bin` installed (Ubuntu should have this by default)
- **Windows**: >= 8, task bar balloon for Windows < 8. Growl as fallback. Growl takes precedence over Windows balloons.
- **General Fallback**: Growl

See [documentation and flow chart for reporter choice](./DECISION_FLOW.md)

## Usage

1. Clone this repository

```bash
$ git clone https://github.com/LitoMore/fanfou-desktop-notifier.git
```

2. Install Dependencies

```bash
$ cd fanfou-desktop-notifier
$ npm install
```

3. Create config file

```bash
$ cp config.json.example config.json
```

4. Config your account in `config.json`

```json
{
  "CONSUMER_KEY": "consumer_key",
  "CONSUMER_SECRET": "consumer_secret",
  "OAUTH_TOKEN": "oauth_token",
  "OAUTH_TOKEN_SECRET": "oauth_token_secret"
}
```

5. Launch notifier

```bash
$ node app.js
```

Or launch with [pm2](https://github.com/Unitech/PM2)

```bash
$ pm2 start app.js
```

## Related

- [fanfou-sdk](https://github.com/LitoMore/fanfou-sdk-node) - Fanfou SDK for Node.js
- [fanfou-streamer](https://github.com/LitoMore/fanfou-streamer) - Fanfou Streaming API SDK for Node.js

## License

MIT © [LitoMore](https://github.com/LitoMore)
