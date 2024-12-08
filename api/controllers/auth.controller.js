import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../lib/prisma.js";

export const registerController = async (req, res) => {
    const { username, email, password } = req.body;
    try {
        /* Create password hash */
        const hashedPassword = await bcrypt.hash(password, 10);

        /* Create a new user in the database */
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword
            }
        });
        res.status(201).json({message: "User has been created successfully."});
    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Failed to create user."});
    }
}
export const loginController = async (req, res) => {
    const { username, password } = req.body;
    try {
        /* Check if the user exists */
        const user = await prisma.user.findUnique({
            where: {username}
        });
        if (!user) {
            return res.status(401).json({message: "Invalid credentials."});
        }
        /* Match if the password is correct */
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({message: "Invalid credentials."});
        }
        /* Generate a cookie token and send back to the user */
        const timeoutAge = 1000 * 60 * 60 * 24 * 7;
        const token = jwt.sign(
            {
                id: user.id,
            },
            process.env.JWT_SECRET_KEY,
            { expiresIn: timeoutAge }
        );
        res.cookie("token", token, {
            httpOnly: true,
            // secure: true /* Uncomment only during deployment */
            maxAge: timeoutAge,
        }).status(200).json({message: "Login successful"});

    } catch (err) {
        console.log(err);
        res.status(500).json({message: "Failed to login user."})
    }
}
export const logoutController = (req, res) => {
    res.clearCookie("token").status(200).json({message: "Logout Successful."})
}