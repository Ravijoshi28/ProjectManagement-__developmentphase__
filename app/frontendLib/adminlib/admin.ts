import { axiosInstance } from "@/app/lib/axios";
export default function fetchAdminStats(){
  return axiosInstance.get('/admin');
}

export const deleteAdminProject = async (projectId: string) => {
  const response = await axiosInstance.delete(`/admin/projects/${projectId}`);
  return response.data.message;
};
