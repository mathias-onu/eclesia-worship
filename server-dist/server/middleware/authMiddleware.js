import asyncHandler from "express-async-handler";
import { Dropbox } from "dropbox";
const protect = asyncHandler(async (req, res, next) => {
    const authorization = req.headers.authorization;
    if (authorization && authorization.startsWith('Bearer')) {
        try {
            const token = authorization.split(' ')[1];
            const dbx = new Dropbox({ accessToken: token });
            const response = await dbx.filesListFolder({ path: '/SongBook/Română/' });
            if (response && response.status === 200) {
                next();
            }
            else {
                res.status(401);
                throw new Error('Authorization failed');
            }
        }
        catch (error) {
            res.status(401);
            throw new Error('Token failed');
        }
    }
    else {
        res.status(401);
        throw new Error('No token');
    }
});
export default protect;
//# sourceMappingURL=authMiddleware.js.map