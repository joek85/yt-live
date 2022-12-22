# yt-live
## YouTube livestream audio-only support.


Usage

```
const ytlive = require('../index');
const path = require('path');
const fs = require('fs');

const output = path.resolve(__dirname, 'video.mp4');
const url = ''; // for example https://rr2---sn-vbxgv-cxtz.googlevideo.com/videoplayback?... comming from node-ytdl-core
const live = ytlive({url: url}).pipe(fs.createWriteStream(output))
```

#### It is still in early stages, more improvements needed to stabilize it.

## How it works.

#### Typically YouTube audio and video are split into chunks of 5 seconds sequences.
#### Once request is made, yt-live will request 3 sequences for prebuffering.
#### The sequence number then will be received, it will be incremented by 1 to send another request with the incremented sequence number.
#### Next request will be delayed by calculating the WallTime epoch difference according to a local time epoch.

#### Currently works fine, but needs more improvements to stabilize the requests based on the connection speed and piping.
#### If the connection is slow and the piping is finished the stream will not be playable anymore so we need to start again.