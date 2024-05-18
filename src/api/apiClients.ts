import axios from "axios";
import {
  API_URL,
  EVENT_ID,
  FUND_ID,
  WEEZEVENT_APP_KEY,
  WEEZEVENT_SYSTEM_ID,
  WEEZEVENT_URL,
} from "../config";

export async function apiRequest(
  method: string,
  path: string,
  data?: object,
  params?: { [key: string | number | symbol]: any },
) {
  return axios({
    method: method,
    baseURL: API_URL,
    url: path,
    params: params,
    data: data,
  }).catch(function (error) {
    if (error.response) {
      throw error;
    } else if (error.request) {
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log("Error", error.message);
    }
    console.log(error.config);
  });
}

export async function weezRequest(
  method: string,
  path: string,
  data?: object,
  params?: string[],
) {
  let requestParams: { [key: string]: string | number } = {
    system_id: WEEZEVENT_SYSTEM_ID,
    app_key: WEEZEVENT_APP_KEY,
  };
  let requestData: { [key: string]: string | number } = {
    ...data,
  };
  if (params) {
    if (params.includes("FUND_ID")) {
      requestData.fun_id = FUND_ID;
    }
    if (params.includes("EVENT_ID")) {
      requestData.event_id = EVENT_ID;
    }
    if (params.includes("AUTH")) {
      const auth_info = localStorage.getItem("@auth_info");
      if (auth_info != null) {
        requestParams.sessionid = JSON.parse(auth_info).sessionId;
      }
    }
  }
  return axios({
    method: method,
    baseURL: WEEZEVENT_URL,
    url: path,
    params: requestParams,
    data: requestData,
    // Passer la réponse en Français
    headers: { "accept-language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7" },
  }).catch(function (error) {
    if (error.response) {
      throw error;
    } else if (error.request) {
      console.log(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log("Error", error.message);
    }
    console.log(error.config);
  });
}
