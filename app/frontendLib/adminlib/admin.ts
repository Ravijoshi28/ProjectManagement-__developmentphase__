import { axiosInstance } from "@/app/lib/axios";
import { toast } from "sonner";

export default function fetchAdminStats(){

    try {
            const res=axiosInstance.get('/admin');
                return res;

    } catch (error) {
        toast.error("Error in fetching admin stats")
    }
}