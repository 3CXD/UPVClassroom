module.exports = function(req, res, next) {
    const user = req.username || "[anónino]";
    console.log(
        "El usuario %s pide la ruta %s",
        user, req.originalUrl);
    next();
}