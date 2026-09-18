import { axiosInstance } from "@/app/lib/axios";
interface Data {
  name: string;
  image: string | null;
}
export const changeProfile = async (data: Data) => {
  return await axiosInstance.patch("/profile", data);
};
