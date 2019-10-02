# PassThePopcorn Freeleech Automator

A node.js script that automates the downloading of PassThePopcorn freeleech torrents.

## To install

`npm install`

Copy `example.config.json` to `config.json` and fill in your apiUser and apiKey credentials from your user profile.

Add a `downloadPath` to `config.json` to have the torrents added to your torrent client's watch directory.

## To run

`npm start` to run manually.

`npm run schedule` to run at an interval of `x` minutes as defined by the `interval` setting in `config.json`. This is helpful for running in screen or tmux.

## Discord notifications

Create a Webhook URL for a Discord channel and place it as `discordWebhookUrl` in your config file to be notified of grabbed torrents.

## Configuration

Configuration options with defaults shown

```javascript
{
  "apiUser": "", // apiUser credential found in PTP profile security tab.
  "apiKey": "", // apiKey credential found in PTP profile security tab.
  "minseeders": -1, // Minimum amount of seeders. Set to -1 for unlimited.
  "maxseeders": -1, // Maximum amount of seeders. Set to -1 for unlimited.
  "minleechers": -1, // Minimum amount of leechers. Set to -1 for unlimited.
  "maxleechers": -1, // Maximum amount of leechers. Set to -1 for unlimited.
  "minsize": -1, // Minimum size in megabytes. Set to -1 for unlimited.
  "maxsize": -1, // Maximum size in megabytes. Set to -1 for unlimited.
  "maxAge": -1, // Maximum time in minutes since torrent was uploaded. See below note.
  "releaseYear": -1, // Filter by release year. Comma separated list of years.
  "resolution": -1, // Filter by resolution. Comma separated list of resolutions. See below for possible values.
  "imdbRating": -1, // Filter by minimum IMDB rating.
  "codec": -1, // Filter by codex. See below for possible values.
  "container": -1, // Filter by container. See below for possible values.
  "source": -1, // Filter by source. See below for possible values.
  "downloadPath": "", // Path to download .torrent files to. Optional.
  "discordWebhookUrl": "", // Discord webhook URI. Optional.
  "interval": -1 // Interval, in minutes, that you'd like to run the script at. 
}
```

## maxAge

Set `maxAge` to filter freeleech torrents by upload date, in minutes. Be aware that some torrents are given freeleech status well after initial upload, & in this case those torrents may not be filtered if this config is set.

## Filter Options

| Resolution | Codec | Container | Source |
| --- | --- | --- | --- | 
|anysd|XviD|AVI|CAM|
|anyhd|DivX|MPG|TS|
|anyhdp|H.264|MKV|R5|
|anyuhd|x264|MP$|DVD-Screener|
|ntsc|H.265|VOV IFO|VHS|
|pal|x265|ISO|WEB|
|480p|DVD5|m2ts|DVD|
|576p|DVD9| |TV|
|720p|BD25| |HDTV|
|1080i|BD50| |HD-DVD|
|1080p|BD66| |Blu-ray|
|2160p|BD100| | |
