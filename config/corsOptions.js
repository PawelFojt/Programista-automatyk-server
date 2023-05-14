const whiteList = ["https://programista-automatyk.pl", "http://localhost:3000"];
export const corsOptions = {
    credentials: true,
    origin: (origin, callback) => {
        if (whiteList.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    optionSuccessStatus: 200,
};
