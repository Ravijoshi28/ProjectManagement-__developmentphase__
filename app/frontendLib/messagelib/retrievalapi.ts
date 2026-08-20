import { axiosInstance } from "@/app/lib/axios";

interface RetrievalArgs {
  text: string;
  projectId: string;
  file: {
    url: string;
    mimeType: string;
    text?: string;
  };
}

export const retrieveAnswer = async ({ text, projectId, file }: RetrievalArgs) => {
  const res = await axiosInstance.post("/RagModel/retrival", {
    text,
    projectId,
    file: { ...file, text: file.text || text },
  });

  return res.data.data as string;
};
