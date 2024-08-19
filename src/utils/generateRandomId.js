import { nanoid } from "@reduxjs/toolkit";

const generateRandomId = () => {
  const randomId = nanoid(5);
  return randomId;
};

export default generateRandomId;
