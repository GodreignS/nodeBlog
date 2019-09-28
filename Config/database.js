let password = process.env.db_password;
let username = process.env.db_username;
let db_name = process.env.db_name;
let db_port = process.env.db_port

module.exports = {
    //Local storage  mongoURI: `mongodb://127.0.0.1:${db_port}/${db_name}`
    mongoURI: `mongodb+srv://${username}:${password}@cluster0-1j1u8.mongodb.net/${db_name}?retryWrites=true&w=majority`
}