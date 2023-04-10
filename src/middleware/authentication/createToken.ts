import jwt from "jsonwebtoken";

export const createToken = (id: any, role: string) => {
    try {
        // calculate in seconds
        const maxAge = 1 * 24 * 60 * 60;
        const secretKey: any = process.env.JWT_SECRET_KEY;
        const token = jwt.sign({ id, role }, secretKey, {
            expiresIn: maxAge,
        });
        return `Bearer ${token}`;
    } catch (error) {
        throw error;
    }
};
