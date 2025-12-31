exports.generateOTP = (length = 6) => {
  const characters = '0123456789';
  let opt = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    opt += characters.charAt(randomIndex);
  }

  return opt;
}