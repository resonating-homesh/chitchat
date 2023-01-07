export const getSender = (loggedUser, users) => {

    if (users[0]._id)
    {
        return users[0]._id === loggedUser._id ? users[1].name : users[0].name
    }
    else 
    {
        return loggedUser.name
    }
    
}