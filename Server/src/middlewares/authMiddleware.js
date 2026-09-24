import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    // 1. Get the 'Authorization' header from the incoming request.
    // This contains the secret token the user sent (usually from Postman or frontend).
    const authHeader = req.headers.authorization;

    // 2. Check if the header even exists. 
    // If the user forgot to send the header, stop here and return a 401 (Unauthorized) error.
    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization header is required",
      });
    }

    // 3. Extract the actual token string.
    // The header usually looks like: "Bearer eyJhbGciOi..."
    // We check if it starts with "Bearer ". If yes, we split the string by space " " 
    // and grab the second part (index 1), which is just the pure token.
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.split(" ")[1]
      : null;

    // 4. Check if the token extraction was successful.
    // If the format was wrong (e.g., they didn't type "Bearer "), stop here.
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Bearer token is required",
      });
    }

    // 5. Verify if the token is authentic and valid.
    // jwt.verify takes the token and decrypts it using your secret key (JWT_SECRET) from the .env file.
    // If the token is valid, it decodes the hidden data (payload) and saves it into 'decoded'.
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    // 6. Attach the user's data to the request object ('req').
    // When the user logged in, their 'id' was stored inside the token.
    // Now we extract it (`decoded.id`) and attach it to `req.user` so that
    // the next functions/controllers down the line know exactly WHO is making this request.
    req.user = {
      id: decoded.id,
    };
    
    // Log it in the console just for development/debugging purposes.
    console.log("Auth middleware:", decoded );
    
    // 7. Everything is successful! Pass the control to the next function/route.
    // If you don't call next(), the request will hang forever and never finish.
    next();
  } catch (error) {
    // 8. Catching Errors.
    // If jwt.verify() fails (because the token was altered, fake, or expired),
    // JavaScript immediately jumps down here and throws a 401 error.
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default authMiddleware;
