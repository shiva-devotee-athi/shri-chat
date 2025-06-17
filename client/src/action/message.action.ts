import { getRequest, patchRequest, postRequest } from "@/api/api.helper";
import { handleActionsError } from "@/api/axios.config";


export const getAllChatUser = async () => {
  try {
    const response = await getRequest({
      url: `message/chat-user`,
      params: {},
    });

    return response;
  } catch (err) {
    handleActionsError(err);
  }
};

export const getAllConversations = async (id:string) => {
  try {
    const response = await getRequest({
      url: `message/conversation/${id}`,
      params: {},
    });

    return response;
  } catch (err) {
    handleActionsError(err);
  }
};