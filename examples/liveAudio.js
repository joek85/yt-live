const  ytlive = require('../index');
const path = require('path');
const fs = require('fs');

const output = path.resolve(__dirname, 'video.mp4');
const url = 'https://rr2---sn-vbxgv-cxtz.googlevideo.com/videoplayback?expire=1671750096&ei=cI2kY_HdErCyxN8Pq5uWyAw&ip=178.135.10.118&id=QUltEEznigw.1&itag=140&aitags=140&source=yt_live_broadcast&requiressl=yes&mh=zD&mm=44%2C29&mn=sn-vbxgv-cxtz%2Csn-hgn7ynek&ms=lva%2Crdu&mv=m&mvi=2&pl=24&initcwndbps=227500&vprv=1&live=1&hang=1&noclen=1&mime=audio%2Fmp4&ns=QTLvqNwomHuvHdu_FuQzilcK&gir=yes&mt=1671728196&fvip=5&keepalive=yes&fexp=24001373%2C24007246&c=WEB&n=6HDPC9MzgCFgvQ&sparams=expire%2Cei%2Cip%2Cid%2Caitags%2Csource%2Crequiressl%2Cvprv%2Clive%2Chang%2Cnoclen%2Cmime%2Cns%2Cgir&lsparams=mh%2Cmm%2Cmn%2Cms%2Cmv%2Cmvi%2Cpl%2Cinitcwndbps&lsig=AG3C_xAwRgIhAMFo_p_zgUxe5N5ICzeZFnFcUJ04fPHXQqstaowdtgjuAiEAqh0UkaLt1RNiZUl9-r5hi3pIZ1e0IOgxugFCiWSL6Q0%3D&sig=AOq0QJ8wRQIhALdv2N2wyNl7iBNGSeQ0znisJ1x07EvDECj5fwQVu6TMAiA_fvFguinPOKCEZDWfKVotdrk9cui-bNoxeu3QuhJJ-w%3D%3D';

const live = ytlive({url: url}).pipe(fs.createWriteStream(output))