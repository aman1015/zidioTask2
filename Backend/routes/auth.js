const jwt=require("jsonwebtoken")



 const authenticateToken = (request, response, next) => {
  const authHeader = request.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
 if (!authHeader || !authHeader.startsWith("Bearer ")) {
   return response.status(401).json({ msg: "Token is missing or malformed" });
 }
  if (token == null) {
    return response.status(401).json({ msg: "token is missing" });
  }

  jwt.verify(token,"tcmTM" , (error, user) => {
    if (error) {
      return response.status(403).json({ msg: "invalid token" });
    }

    request.user = user;
    next();
  });
};
module.exports = { authenticateToken} ;
