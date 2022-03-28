const addGoogleUser = (User) => ({ id, email, firstName, lastName, profilePhoto }) => {
    const user = new User({
        id, email, firstName, lastName, profilePhoto, source: "google"
    })
    return user.save()
}

const getUsers = (User) => () => {
    return User.find({})
}

const getUserByEmail = (User) => async ({ email }) => {
    return await User.findOne({ email })
}

const addLocalUser = (User) => ({ id, email, firstName, lastName, password }) => {
    const user = new User({
        id, email, firstName, lastName, password, source: "local"
    })
    return user.save()
}

module.exports = (User) => {
    return {
        addLocalUser: addLocalUser(User),
        addGoogleUser: addGoogleUser(User),
        getUsers: getUsers(User),
        getUserByEmail: getUserByEmail(User)
    }
}