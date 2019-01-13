
let isEmpty = (data) =>{
    if(data === undefined || data === null || data === '')
        return true
    else
        return false
}

module.exports = {
    isEmpty : isEmpty
}