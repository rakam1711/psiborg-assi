import crypto from "crypto";

const { iv, SECRETKEY } = process.env;

const encrypt = async (token) => {
  try {
    const cipher = crypto.createCipheriv(
      "aes-256-cbc",
      Buffer.from(SECRETKEY, "hex"),
      Buffer.from(iv, "hex")
    );
    let encrypted = cipher.update(token, "utf-8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
  } catch (err) {
    console.log(err.message);
  }
};

export { encrypt };
