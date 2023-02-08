/* eslint-disable */
/* tslint:disable */
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

export interface ProtobufAny {
  "@type"?: string;
  [key: string]: any;
}

export interface RpcStatus {
  /** @format int32 */
  code?: number;
  message?: string;
  details?: ProtobufAny[];
}

export interface V1CreateReadStateRequest {
  AppID?: string;
  UserID?: string;
  AnnouncementID?: string;
}

export interface V1CreateReadStateResponse {
  Info?: V1ReadState;
}

export interface V1GetAppReadStatesRequest {
  AppID?: string;
  /** @format int64 */
  Offset?: number;
  /** @format int64 */
  Limit?: number;
}

export interface V1GetAppReadStatesResponse {
  Infos?: V1ReadState[];
  /** @format int64 */
  Total?: number;
}

export interface V1GetAppUserReadStatesRequest {
  TargetAppID?: string;
  TargetUserID?: string;
  /** @format int64 */
  Offset?: number;
  /** @format int64 */
  Limit?: number;
}

export interface V1GetAppUserReadStatesResponse {
  Infos?: V1ReadState[];
  /** @format int64 */
  Total?: number;
}

export interface V1GetNAppReadStatesRequest {
  TargetAppID?: string;
  /** @format int64 */
  Offset?: number;
  /** @format int64 */
  Limit?: number;
}

export interface V1GetNAppReadStatesResponse {
  Infos?: V1ReadState[];
  /** @format int64 */
  Total?: number;
}

export interface V1GetReadStateRequest {
  AppID?: string;
  UserID?: string;
  AnnouncementID?: string;
}

export interface V1GetReadStateResponse {
  Info?: V1ReadState;
}

export interface V1GetReadStatesRequest {
  AppID?: string;
  UserID?: string;
  /** @format int64 */
  Offset?: number;
  /** @format int64 */
  Limit?: number;
}

export interface V1GetReadStatesResponse {
  Infos?: V1ReadState[];
  /** @format int64 */
  Total?: number;
}

export interface V1ReadState {
  AnnouncementID?: string;
  AppID?: string;
  AppName?: string;
  UserID?: string;
  EmailAddress?: string;
  PhoneNO?: string;
  Username?: string;
  Title?: string;
  Content?: string;
  /** @format int64 */
  CreatedAt?: number;
}

export type QueryParamsType = Record<string | number, any>;
export type ResponseFormat = keyof Omit<Body, "body" | "bodyUsed">;

export interface FullRequestParams extends Omit<RequestInit, "body"> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseFormat;
  /** request body */
  body?: unknown;
  /** base url */
  baseUrl?: string;
  /** request cancellation token */
  cancelToken?: CancelToken;
}

export type RequestParams = Omit<FullRequestParams, "body" | "method" | "query" | "path">;

export interface ApiConfig<SecurityDataType = unknown> {
  baseUrl?: string;
  baseApiParams?: Omit<RequestParams, "baseUrl" | "cancelToken" | "signal">;
  securityWorker?: (securityData: SecurityDataType | null) => Promise<RequestParams | void> | RequestParams | void;
  customFetch?: typeof fetch;
}

export interface HttpResponse<D extends unknown, E extends unknown = unknown> extends Response {
  data: D;
  error: E;
}

type CancelToken = Symbol | string | number;

export enum ContentType {
  Json = "application/json",
  FormData = "multipart/form-data",
  UrlEncoded = "application/x-www-form-urlencoded",
  Text = "text/plain",
}

export class HttpClient<SecurityDataType = unknown> {
  public baseUrl: string = "";
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>["securityWorker"];
  private abortControllers = new Map<CancelToken, AbortController>();
  private customFetch = (...fetchParams: Parameters<typeof fetch>) => fetch(...fetchParams);

  private baseApiParams: RequestParams = {
    credentials: "same-origin",
    headers: {},
    redirect: "follow",
    referrerPolicy: "no-referrer",
  };

  constructor(apiConfig: ApiConfig<SecurityDataType> = {}) {
    Object.assign(this, apiConfig);
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  protected encodeQueryParam(key: string, value: any) {
    const encodedKey = encodeURIComponent(key);
    return `${encodedKey}=${encodeURIComponent(typeof value === "number" ? value : `${value}`)}`;
  }

  protected addQueryParam(query: QueryParamsType, key: string) {
    return this.encodeQueryParam(key, query[key]);
  }

  protected addArrayQueryParam(query: QueryParamsType, key: string) {
    const value = query[key];
    return value.map((v: any) => this.encodeQueryParam(key, v)).join("&");
  }

  protected toQueryString(rawQuery?: QueryParamsType): string {
    const query = rawQuery || {};
    const keys = Object.keys(query).filter((key) => "undefined" !== typeof query[key]);
    return keys
      .map((key) => (Array.isArray(query[key]) ? this.addArrayQueryParam(query, key) : this.addQueryParam(query, key)))
      .join("&");
  }

  protected addQueryParams(rawQuery?: QueryParamsType): string {
    const queryString = this.toQueryString(rawQuery);
    return queryString ? `?${queryString}` : "";
  }

  private contentFormatters: Record<ContentType, (input: any) => any> = {
    [ContentType.Json]: (input: any) =>
      input !== null && (typeof input === "object" || typeof input === "string") ? JSON.stringify(input) : input,
    [ContentType.Text]: (input: any) => (input !== null && typeof input !== "string" ? JSON.stringify(input) : input),
    [ContentType.FormData]: (input: any) =>
      Object.keys(input || {}).reduce((formData, key) => {
        const property = input[key];
        formData.append(
          key,
          property instanceof Blob
            ? property
            : typeof property === "object" && property !== null
            ? JSON.stringify(property)
            : `${property}`,
        );
        return formData;
      }, new FormData()),
    [ContentType.UrlEncoded]: (input: any) => this.toQueryString(input),
  };

  protected mergeRequestParams(params1: RequestParams, params2?: RequestParams): RequestParams {
    return {
      ...this.baseApiParams,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.baseApiParams.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      },
    };
  }

  protected createAbortSignal = (cancelToken: CancelToken): AbortSignal | undefined => {
    if (this.abortControllers.has(cancelToken)) {
      const abortController = this.abortControllers.get(cancelToken);
      if (abortController) {
        return abortController.signal;
      }
      return void 0;
    }

    const abortController = new AbortController();
    this.abortControllers.set(cancelToken, abortController);
    return abortController.signal;
  };

  public abortRequest = (cancelToken: CancelToken) => {
    const abortController = this.abortControllers.get(cancelToken);

    if (abortController) {
      abortController.abort();
      this.abortControllers.delete(cancelToken);
    }
  };

  public request = async <T = any, E = any>({
    body,
    secure,
    path,
    type,
    query,
    format,
    baseUrl,
    cancelToken,
    ...params
  }: FullRequestParams): Promise<HttpResponse<T, E>> => {
    const secureParams =
      ((typeof secure === "boolean" ? secure : this.baseApiParams.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const queryString = query && this.toQueryString(query);
    const payloadFormatter = this.contentFormatters[type || ContentType.Json];
    const responseFormat = format || requestParams.format;

    return this.customFetch(`${baseUrl || this.baseUrl || ""}${path}${queryString ? `?${queryString}` : ""}`, {
      ...requestParams,
      headers: {
        ...(requestParams.headers || {}),
        ...(type && type !== ContentType.FormData ? { "Content-Type": type } : {}),
      },
      signal: cancelToken ? this.createAbortSignal(cancelToken) : requestParams.signal,
      body: typeof body === "undefined" || body === null ? null : payloadFormatter(body),
    }).then(async (response) => {
      const r = response as HttpResponse<T, E>;
      r.data = null as unknown as T;
      r.error = null as unknown as E;

      const data = !responseFormat
        ? r
        : await response[responseFormat]()
            .then((data) => {
              if (r.ok) {
                r.data = data;
              } else {
                r.error = data;
              }
              return r;
            })
            .catch((e) => {
              r.error = e;
              return r;
            });

      if (cancelToken) {
        this.abortControllers.delete(cancelToken);
      }

      if (!response.ok) throw data;
      return data;
    });
  };
}

/**
 * @title npool/notif/gw/v1/announcement/readstate/readstate.proto
 * @version version not set
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  v1 = {
    /**
     * No description
     *
     * @tags Gateway
     * @name GatewayCreateReadState
     * @request POST:/v1/create/readstate
     */
    gatewayCreateReadState: (body: V1CreateReadStateRequest, params: RequestParams = {}) =>
      this.request<V1CreateReadStateResponse, RpcStatus>({
        path: `/v1/create/readstate`,
        method: "POST",
        body: body,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Gateway
     * @name GatewayGetAppReadStates
     * @request POST:/v1/get/app/readstates
     */
    gatewayGetAppReadStates: (body: V1GetAppReadStatesRequest, params: RequestParams = {}) =>
      this.request<V1GetAppReadStatesResponse, RpcStatus>({
        path: `/v1/get/app/readstates`,
        method: "POST",
        body: body,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Gateway
     * @name GatewayGetAppUserReadStates
     * @request POST:/v1/get/app/user/readstates
     */
    gatewayGetAppUserReadStates: (body: V1GetAppUserReadStatesRequest, params: RequestParams = {}) =>
      this.request<V1GetAppUserReadStatesResponse, RpcStatus>({
        path: `/v1/get/app/user/readstates`,
        method: "POST",
        body: body,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Gateway
     * @name GatewayGetNAppReadStates
     * @request POST:/v1/get/n/app/readstates
     */
    gatewayGetNAppReadStates: (body: V1GetNAppReadStatesRequest, params: RequestParams = {}) =>
      this.request<V1GetNAppReadStatesResponse, RpcStatus>({
        path: `/v1/get/n/app/readstates`,
        method: "POST",
        body: body,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Gateway
     * @name GatewayGetReadState
     * @request POST:/v1/get/readstate
     */
    gatewayGetReadState: (body: V1GetReadStateRequest, params: RequestParams = {}) =>
      this.request<V1GetReadStateResponse, RpcStatus>({
        path: `/v1/get/readstate`,
        method: "POST",
        body: body,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),

    /**
     * No description
     *
     * @tags Gateway
     * @name GatewayGetReadStates
     * @request POST:/v1/get/readstates
     */
    gatewayGetReadStates: (body: V1GetReadStatesRequest, params: RequestParams = {}) =>
      this.request<V1GetReadStatesResponse, RpcStatus>({
        path: `/v1/get/readstates`,
        method: "POST",
        body: body,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}
