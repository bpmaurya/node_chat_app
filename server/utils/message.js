var generateMessage = (from,text)=>{
    return{
        from,
        text,
        createdAt:new Date().getTime(),
    }
}

var generateLocationMessage = (from,lat,lang)=>{
    return {
        from,
        url:`https://www.google.com/maps?q=${lat},${lang}`,
        createdAt:new Date().getTime()
    }
}


module.exports = {generateMessage,generateLocationMessage}