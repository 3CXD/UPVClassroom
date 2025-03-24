const basicAuth = require("express-basic-auth");
const db = require("../dataAccess/db");

function authorizer(username, password, cbRes) {
    if(!username.trim()){
        cbRes(null, false);
        return;
    }
    const sql = "SELECT * FROM usuarios WHERE username = ?";
    db.query(sql, [username])
        .then(dbRes => {
            const [rows] = dbRes;
            console.log(rows);
            if(rows.length === 0){
                cbRes(null, false);
                return;
            }
            const usuario = rows[0];
            const loginCorrecto = usuario.password == password;
            cbRes(null, loginCorrecto);
        });
}

const auth = basicAuth({
    authorizer: authorizer,
    authorizeAsync: true,
    challenge: true,
    realm: "Auth required!!!"
});

module.exports = auth;