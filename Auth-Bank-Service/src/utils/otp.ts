

import crypto from 'crypto';


export const generateOtp = (): string => {
   return crypto.randomInt(100000, 1000000).toString();
};


export const getOtpExpiry = (minutes: 10) : Date => {
    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + minutes);
    return expiry;
};
