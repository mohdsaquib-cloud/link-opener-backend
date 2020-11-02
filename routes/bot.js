const bot = require('../src/bot')
const getUrls = require('get-urls');
const Urls = require('../models/urls')
const config = require("config")
const express = require('express');
const router = express.Router()
const io = require('socket.io')(4000);

io.on('connection', function(socket) {
       console.log('A user connected');       
    //    socket.on('urls', function(urls) {        
    //       console.log(urls)
    //       const newUrl=["www.youtube.com"]
    //       io.sockets.emit('newmsg', newUrl);
    //    })
        const newUrl=["backend - www.youtube.com"]
        io.emit("urls",newUrl)
    });
keywords=[]
function filterUrls(urls){
    filteredUrls=[...urls]
    for(let i in keywords){                   
        for(j in urls){
            if(urls[j].includes(keywords[i])){
                const index = filteredUrls.indexOf(urls[j]);
                if (index > -1) {
                    filteredUrls.splice(index, 1);
                }            
            } 
        }
    }
    return filteredUrls
}

bot.on('message',async(message)=>{
    const urls = Array.from(getUrls(message.content));        
    const filteredUrls = filterUrls(urls)               
    const newUrls = await Urls.create({
        url :  filteredUrls
    })
    console.log(filteredUrls)
    // send urls to fronend
    io.emit('urls', filterUrls)
    await newUrls.save();    
})
bot.login(config.get("DISCORDJS_BOT_TOKEN"))
router.post('/',(req,res)=>{     
    keywords=[...req.body]    
    res.sendStatus(200) 
});

module.exports = router