const otpStore = new Map();

exports.setOTP = (key, otp) => {
  otpStore.set(key, {
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000, 
  });
};

exports.verifyOTP  = (key) => {
  const data = otpStore.get(key);

  if (!data) return null;

  if (Date.now() > data.expiresAt) {
    otpStore.delete(key);
    return null;
  }

  return data.otp;
};

exports.isVerified = (key) => {
  return otpStore.get(key)?.verified === true;
};

exports.deleteOTP = (key) => {
  otpStore.delete(key);
};
