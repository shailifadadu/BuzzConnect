import jwt from "jsonwebtoken";

//To generate token, we need to take the payload(userId, res) as i/p
export const generateToken = (userId, res) => {
  //create token(args-> payload, secretOrprivate key, options)
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  //send jwt token to user in cookies
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, //7 days in millisec
    //Marks the cookie as HTTP-only, meaning it cannot be accessed via client-side JavaScript.
    httpOnly: true, //prevent Cross-Site Scripting (XSS) attacks, as malicious scripts cannot read or manipulate the cookie.
    sameSite: "strict", //Prevent Cross-Site Request Forgery (CSRF) attacks by ensuring that the cookie won't be sent with cross-origin requests.
    //Ensures the cookie is only sent over HTTPS when the app is running in a production environment.
    secure: process.env.NODE_ENV !== "development",
  });

  return token;
};
