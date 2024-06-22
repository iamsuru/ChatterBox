const Auth = require("../src/models/userModel")


const SearchUser = async (req, res) => {
    const keyword = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: "i" } },
            { username: { $regex: req.query.search, $options: "i" } }
        ]
    } : {};

    const users = await Auth.find(keyword).find({ _id: { $ne: req.auth._id } })

    res.send(users);
}


module.exports = { SearchUser }