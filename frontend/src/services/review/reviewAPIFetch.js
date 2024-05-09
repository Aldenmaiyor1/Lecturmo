import { postRequest } from '../postRequest';

const BASE_URL = import.meta.env.VITE_BACKEND_EXPRESS_APP_ENDPOINT_API_URL ?? 'http://localhost:3000/api';

export const addReview = async (courseId, formData,) => {
  
  const res = await postRequest(
    `${BASE_URL}/add-review?courseId=${courseId}`,
    formData
  );
  return res;
};
