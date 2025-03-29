const corsOptions = {
  origin: process.env.URL_CLIENT || 'http://localhost:5173',
  credentials: true,
};

const cookieSignature = process.env.COOKIE_SIGNATURE || '1232421421';

const port = process.env.PORT || 3000;

const host = process.env.HOST || 'localhost';

export { corsOptions, cookieSignature, port, host };
