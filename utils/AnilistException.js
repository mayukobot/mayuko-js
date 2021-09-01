const error = new Error('missing');

if(error.message == 'missing') {
    console.log('anime not found')
} else if(error.message == 'nsfw') {
    console.log('channel not nsfw')
} else {
    console.log('general error')
}