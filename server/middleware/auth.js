import { clerkClient } from "@clerk/express";

const ADMIN_EMAIL = "kushkore.work@gmail.com";

export const protectUser = async (req, res, next) => {
    try {
        const { userId } = req.auth();
        if (!userId) {
            return res.json({ success: false, message: "Authentication required" });
        }
        next();
    } catch (error) {
        return res.json({ success: false, message: "Authentication required" });
    }
}

export const protectAdmin = async (req, res, next)=>{
    try {
        const { userId } = req.auth();

        const user = await clerkClient.users.getUser(userId);
        
        // Check if user email matches admin email
        const userEmail = user.emailAddresses[0]?.emailAddress;
        
        if(userEmail !== ADMIN_EMAIL){
            return res.json({success: false, message: "not authorized"})
        }

        next();
    } catch (error) {
        return res.json({ success: false, message: "not authorized" });
    }
}