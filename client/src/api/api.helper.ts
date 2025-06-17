import authAxios, { handleActionsError } from "@/api/axios.config";

type RequestProps = {
  url: string;
  data?: {};
  params?: {};
};

export const getRequest = async ({ url, params = {} }: RequestProps) => {
  try {
    const res = await authAxios.get(url, { params });
    return res.data;
  } catch (err) {
    return err;
  }
};

//  OR =====> In case of Redux Thunk  <======
//  export const getRequest = async ({ url, params = {}, thunkApi }) => {
//    try {
//      const res = await axios.get(url, { params });
//      return res.data;
//    } catch (err) {
//      return thunkApi.rejectWithValue(err);
//      return err;
//    };
//  };

export const postRequest = async ({
  url,
  data = {},
  params = {},
}: RequestProps) => {
  try {
    const res = await authAxios.post(url, data, { params });
    return res.data;
  } catch (err) {
    handleActionsError(err);
    return err;
  }
};

export const postFormDataRequest = async ({
  url,
  data = {},
  params = {},
}: RequestProps) => {
  try {
    const res = await authAxios.post(url, data, {
      params,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (err) {
    return err;
  }
};

export const patchRequest = async ({
  url,
  data = {},
  params = {},
}: RequestProps) => {
  try {
    const res = await authAxios.patch(url, data, { params });
    return res.data;
  } catch (err) {
    return err;
  }
};

export const patchFormDataRequest = async ({
  url,
  data = {},
  params = {},
}: RequestProps) => {
  try {
    const res = await authAxios.patch(url, data, {
      params,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return res.data;
  } catch (err) {
    return err;
  }
};

export const putRequest = async ({
  url,
  data = {},
  params = {},
}: RequestProps) => {
  try {
    const res = await authAxios.put(url, data, { params });
    return res.data;
  } catch (err) {
    return err;
  }
};

export const deleteRequest = async ({ url, params = {} }: RequestProps) => {
  try {
    const res = await authAxios.delete(url, { params });
    return res.data;
  } catch (err) {
    return err;
  }
};
