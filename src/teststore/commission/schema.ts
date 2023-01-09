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

export interface V1Commission {
  UserID?: string;
  Username?: string;
  EmailAddress?: string;
  PhoneNO?: string;
  FirstName?: string;
  LastName?: string;
  Kol?: boolean;
  SettleType?: V1SettleType;
  SettleMode?: V1SettleMode;
  SettleInterval?: V1SettleInterval;
  GoodID?: string;
  GoodName?: string;
  CoinTypeID?: string;
  CoinName?: string;
  CoinLogo?: string;
  Percent?: string;
  Amount?: string;
  Threshold?: string;
  /** @format int64 */
  StartAt?: number;
  /** @format int64 */
  EndAt?: number;
  /** @format int64 */
  CreatedAt?: number;
  /** @format int64 */
  UpdatedAt?: number;
}

export interface V1CreateCommissionRequest {
  AppID?: string;
  TargetUserID?: string;
  GoodID?: string;
  SettleType?: V1SettleType;
  Value?: string;
  /** @format int64 */
  StartAt?: number;
}

export interface V1CreateCommissionResponse {
  Info?: V1Commission;
}

export interface V1GetAppCommissionsRequest {
  AppID?: string;
  /** @format int64 */
  EndAt?: number;
  SettleType?: V1SettleType;
  /** @format int32 */
  Offset?: number;
  /** @format int32 */
  Limit?: number;
}

export interface V1GetAppCommissionsResponse {
  Infos?: V1Commission[];
  /** @format int64 */
  Total?: number;
}

export interface V1GetCommissionsRequest {
  AppID?: string;
  UserID?: string;
  SettleType?: V1SettleType;
  /** @format int32 */
  Offset?: number;
  /** @format int32 */
  Limit?: number;
}

export interface V1GetCommissionsResponse {
  Infos?: V1Commission[];
  /** @format int64 */
  Total?: number;
}

/** @default "DefaultSettleInterval" */
export enum V1SettleInterval {
  DefaultSettleInterval = "DefaultSettleInterval",
  SettleAggregate = "SettleAggregate",
  SettleMonthly = "SettleMonthly",
  SettleYearly = "SettleYearly",
  SettleEveryOrder = "SettleEveryOrder",
}

/** @default "DefaultSettleMode" */
export enum V1SettleMode {
  DefaultSettleMode = "DefaultSettleMode",
  SettleWithGoodValue = "SettleWithGoodValue",
  SettleWithPaymentAmount = "SettleWithPaymentAmount",
}

/** @default "DefaultSettleType" */
export enum V1SettleType {
  DefaultSettleType = "DefaultSettleType",
  GoodOrderPercent = "GoodOrderPercent",
  LimitedOrderPercent = "LimitedOrderPercent",
  AmountThreshold = "AmountThreshold",
  NoCommission = "NoCommission",
}

export interface V1UpdateCommissionRequest {
  ID?: string;
  AppID?: string;
  Value?: string;
  /** @format int64 */
  StartAt?: number;
}

export interface V1UpdateCommissionResponse {
  Info?: V1Commission;
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
 * @title npool/inspire/gw/v1/commission/commission.proto
 * @version version not set
 */
export class Api<SecurityDataType extends unknown> extends HttpClient<SecurityDataType> {
  v1 = {
    /**
     * No description
     *
     * @tags Gateway
     * @name GatewayCreateCommission
     * @request POST:/v1/create/commission
     */
    gatewayCreateCommission: (body: V1CreateCommissionRequest, params: RequestParams = {}) =>
      this.request<V1CreateCommissionResponse, RpcStatus>({
        path: `/v1/create/commission`,
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
     * @name GatewayGetAppCommissions
     * @request POST:/v1/get/app/commissions
     */
    gatewayGetAppCommissions: (body: V1GetAppCommissionsRequest, params: RequestParams = {}) =>
      this.request<V1GetAppCommissionsResponse, RpcStatus>({
        path: `/v1/get/app/commissions`,
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
     * @name GatewayGetCommissions
     * @request POST:/v1/get/commissionhistories
     */
    gatewayGetCommissions: (body: V1GetCommissionsRequest, params: RequestParams = {}) =>
      this.request<V1GetCommissionsResponse, RpcStatus>({
        path: `/v1/get/commissionhistories`,
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
     * @name GatewayUpdateCommission
     * @request POST:/v1/update/commission
     */
    gatewayUpdateCommission: (body: V1UpdateCommissionRequest, params: RequestParams = {}) =>
      this.request<V1UpdateCommissionResponse, RpcStatus>({
        path: `/v1/update/commission`,
        method: "POST",
        body: body,
        type: ContentType.Json,
        format: "json",
        ...params,
      }),
  };
}
