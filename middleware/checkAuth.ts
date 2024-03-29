import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";

export const checkAuth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.cookies.access_token;

  if (!token) {
    return res.status(401).json({
      message: "You must be logged in to do this.",
    });
  }

  try {
    // Verify the token using your secret key
    const decoded = verify(token, process.env.JWT_SECRET as string);

    // Attach the decoded token to the request object
    (<any>req).user = decoded;

    // Proceed to the next middleware
    next();
  } catch (error) {
    console.error.bind(console, `Error in authorization middleware: ${error}`);
    return res.status(403).json({ message: "Authorization failed.", error });
  }
};
