const getOtp = async (length = 4) => {
  const min = Math.pow(10, length - 1); // This generates the minimum value for the specified length
  const max = Math.pow(10, length) - 1; // This generates the maximum value for the specified length
  return Math.floor(Math.random() * (max - min + 1)) + min; // Generates a random number in the specified range
};
export default getOtp;
