import { getRequest, patchRequest, postRequest } from "@/api/api.helper";
import { handleActionsError } from "@/api/axios.config";

export const getAllUsers = async () => {
  try {
    const response = await getRequest({
      url: "user",
      params: {},
    });

    return response;
  } catch (err) {
    handleActionsError(err);
  }
};

export const getAllUserList = async () => {
  try {
    const response = await getRequest({
      url: "user/list",
      params: {},
    });

    return response;
  } catch (err) {
    handleActionsError(err);
  }
};
