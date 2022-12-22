const { PassThrough } = require('stream');

const miniget= require('miniget');

const ytlive = (url) => {
    const stream = createStream();
    startStreaming(stream, url);
    return stream;
};

const USER_AGENT = "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/97.0.4692.98 Safari/537.36";

const headersList = {
    "Accept": "*/*",
    "User-Agent": USER_AGENT,
}
const createStream = () => {
    const stream = new PassThrough({});
    stream._destroy = () => { stream.destroyed = true; };
    return stream;
};
const pipeAndSetEvents = (req, stream, end) => {
    // Forward events from the request to the stream.
    [
        'abort', 'request', 'response', 'error', 'redirect', 'retry', 'reconnect',
    ].forEach(event => {
        req.prependListener(event, stream.emit.bind(stream, event));
    });

    req.pipe(stream, { end });
};

const startStreaming = (stream, audioUrl) => {
    if (stream.destroyed) { return; };
    const requestOptions = Object.assign({}, {
        maxReconnects: 6,
        maxRetries: 3,
        method: 'POST',
        headers: headersList
    });
    let req;
    let downloaded = 0;
    let xSequenceNum = 0;
    let xHeadSeqNum = 0;
    let xSegmentLmt = 0;
    let xHeadTimeMillis = 0;
    let xHeadTimemSec = 0;
    let xWallTimes = 0; // Epoch walltime

    let headm = 3; // 3 sequences of 5s ahead
    let rn = 1; // request number
    let rbuf = 0; // buffer size
    let sq = 0; // sequesnce number

    const onResponse = res => {
        xSequenceNum = res.headers['x-sequence-num'];
        xHeadSeqNum = res.headers['x-head-seqnum'];
        xSegmentLmt = res.headers['x-segment-lmt'];
        xHeadTimeMillis = res.headers['x-head-time-millis'];
        xHeadTimemSec = res.headers['x-head-time-sec'];
        xWallTimes = res.headers['x-walltime-ms'];

        console.log('xSequenceNum = ' + xSequenceNum);
        console.log('xHeadSeqNum = ' + xHeadSeqNum);
        console.log('xSegmentLmt = ' + xSegmentLmt);
        console.log('xHeadTimeMillis = ' + xHeadTimeMillis);
        console.log('xHeadTimemSec = ' + xHeadTimemSec);
        console.log('xWallTimes = ' + xWallTimes);
    };
    const onError = (err) => {
        console.log(err)
    }
    const ondata = chunk => {
        downloaded += chunk.length;
        console.log('chunck length = ' + chunk.length + ' downloaded = ' + downloaded);
    };
    const getNextChunk = () => {
        let url;
        if (sq == 0) {
            url = audioUrl.url + '&headm=' + headm;// + '&rn=' + rn + '&rbuf=' + rbuf;
        } else {
            url = audioUrl.url + '&sq=' + sq + '&rn=' + rn;//+ '&rbuf=' + rbuf;
        }

        requestOptions.headers = Object.assign({}, requestOptions.headers, {});

        req = miniget(url, requestOptions);
        req.on('error', onError)
        req.on('data', ondata);
        req.on('response', onResponse);
        req.on('end', () => {
            rn++;
            //rbuf += 5000;
            sq = xSequenceNum;

            var start = new Date(parseInt(xWallTimes));
            var now = new Date().getTime();
            var delay = (now - xWallTimes);

            console.log('start = ' + start + ' now = ' + now + ' delay = ' + delay)

            sq++;

            setTimeout(getNextChunk, delay)

        });
        pipeAndSetEvents(req, stream, false);
    };
    getNextChunk();

    stream._destroy = () => {
        stream.destroyed = true;
        req.destroy();
        req.end();
    };
}
module.exports = ytlive;