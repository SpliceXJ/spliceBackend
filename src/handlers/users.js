import { User } from "../model_methods/userMethods.js";

// New User Authentication
export const createNewUser = async (req, res) => {
  const user = await new User().createNewUser(
      req.body.firstname,
      req.body.lastname,
      req.body.username,
      req.body.email,
      req.body.password,
  );
  if (user) {
    const token = await user.createJWT();
    return res.status(200).json({token})
  };
  return res.status(400).json({message: "account creation un-successful"});
};

// Sign in
export const signin = async (req, res) => {
  const user = new User(req.body.username);
  if (!await user.doesExist()) return res.status(400).json({message:"Invalid Credentials"});
  const token = await user.signIn(req.body.password);
  if (token) {
    return res.status(200).json({token})
  }else{
    return res.status(400).json({message:"Invalid Credentials"});
  }
};

// Forgot Password
export const forgotPassword = async (req, res) => {
  // const user = await prisma.user.findUnique({
  //   where: {
  //     username: req.body.username,
  //   },
  // });
  // if (!user) {
  //   return res.status(400).json({ message: "Invalid username" });
  // }

  // // Check if new password matches confirm password
  // if (req.body.newPassword !== req.body.confirmPassword) {
  //   return res.status(400).json({ message: "Passwords do not match" });
  // }
  // const updatedUser = await prisma.user.update({
  //   where: { username: req.body.username },
  //   data: { password: await hashedPassword(req.body.newPassword) },
  // });
  // // Update user's password

  // const token = createJWT(updatedUser);
  // res.json({ token });
};
