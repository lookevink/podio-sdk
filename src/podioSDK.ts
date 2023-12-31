type ItemId = number;
type AppId = number;
type OAuthToken = string;

interface ApiResponse {
  data: any | null;
  error: Error | null;
  remaining_limit: number | null;
  rate_limit: number | null;
}

export class podioClient {
  private baseUrl: string = "https://api.podio.com";
  private token: OAuthToken;
  private endpoint: string = "";
  private payload: any = null;
  private filter: any = null;

  // Auth
  constructor(token: OAuthToken) {
    this.token = token;
  }

  // refresh token function does not require post()
  async refreshToken(
    clientId: string,
    clientSecret: string,
    refreshToken: string
  ): Promise<{ data: any | null; error: Error | null }> {
    this.endpoint = `${this.baseUrl}/oauth/token/v2`;
    this.payload = {
      grant_type: "refresh_token",
      client_id: clientId,
      client_secret: clientSecret,
      refresh_token: refreshToken,
    };

    try {
      const response = await fetch(this.endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify(this.payload),
      });

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(
          `HTTP error! Status: ${response.status}, Details: ${JSON.stringify(
            errorBody
          )}`
        );
      }

      const data = await response.json();
      return { data, error: null };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error : new Error(String(error)),
      };
    }
  }

  // Items
  addItem(appId: AppId, item: any, external_id?: string): this {
    this.endpoint = `${this.baseUrl}/item/app/${appId}/`;
    this.payload = { fields: item };
    if (external_id) {
      this.payload.external_id = external_id;
    }
    return this;
  }

  updateItem(itemId: ItemId, itemValues: any): this {
    this.endpoint = `${this.baseUrl}/item/${itemId}`;
    this.payload = { fields: itemValues };
    return this;
  }

  filterItems(
    appId: AppId,
    filterOptions: {
      sortBy?: string;
      sortDesc?: boolean;
      filters?: { [key: string]: any };
      limit?: number;
      offset?: number;
      remember?: boolean;
    }
  ): this {
    this.endpoint = `${this.baseUrl}/item/app/${appId}/filter/`;
    this.payload = {
      sort_by: filterOptions.sortBy,
      sort_desc: filterOptions.sortDesc,
      filters: filterOptions.filters,
      limit: filterOptions.limit || 30,
      offset: filterOptions.offset || 0,
      remember: filterOptions.remember,
    };
    return this;
  }

  getItemByExternalId(appId: AppId, externalId: string): this {
    this.endpoint = `${this.baseUrl}/item/app/${appId}/external_id/${externalId}`;
    return this;
  }

  getItemValuesV2(itemId: ItemId): this {
    this.endpoint = `${this.baseUrl}/item/${itemId}/value/v2`;
    return this;
  }

  cloneItem(itemId: ItemId): this {
    this.endpoint = `${this.baseUrl}/item/${itemId}/clone`;
    return this;
  }

  deleteItem(itemId: ItemId): this {
    this.endpoint = `${this.baseUrl}/item/${itemId}`;
    return this;
  }

  searchInApp(
    appId: AppId,
    searchOptions: {
      query: string;
      refType?: string;
      searchFields?: string[];
      limit?: number;
      offset?: number;
      counts?: boolean;
      highlights?: boolean;
    }
  ): this {
    // Building the parameters object
    const params: Record<string, string> = {
      query: searchOptions.query,
    };

    if (searchOptions.refType) params["ref_type"] = searchOptions.refType;
    if (searchOptions.searchFields)
      params["search_fields"] = searchOptions.searchFields.join(",");
    if (searchOptions.limit) params["limit"] = searchOptions.limit.toString();
    if (searchOptions.offset)
      params["offset"] = searchOptions.offset.toString();
    if (searchOptions.counts)
      params["counts"] = searchOptions.counts.toString();
    if (searchOptions.highlights)
      params["highlights"] = searchOptions.highlights.toString();

    // Constructing the URL with parameters
    this.endpoint = `${
      this.baseUrl
    }/search/app/${appId}/v2?${new URLSearchParams(params).toString()}`;
    return this;
  }

  getItemCount(
    appId: AppId,
    filters?: {
      viewId?: number;
      filterKey?: string;
      filterValue?: string;
    }
  ): this {
    const params: Record<string, string> = {};
    if (filters?.viewId !== undefined) {
      params["view_id"] = filters.viewId.toString();
    }
    if (filters?.filterKey && filters?.filterValue) {
      params[filters.filterKey] = filters.filterValue;
    }
    this.endpoint = `${
      this.baseUrl
    }/item/app/${appId}/count?${new URLSearchParams(params).toString()}`;
    return this;
  }

  // Apps
  getApps(): this {
    let queryParams: string[] = [];

    //todo: complete adding params dynamically
    const queryString =
      queryParams.length > 0 ? `?${queryParams.join("&")}` : "";
    this.endpoint = `${this.baseUrl}/app/${queryString}?exclude_demo=true&limit=100`;

    return this;
  }

  getAppsBySpaceId(spaceId: number): this {
    this.endpoint = `${this.baseUrl}/app/space/${spaceId}/`;
    return this;
  }

  getAppById(appId: AppId): this {
    this.endpoint = `${this.baseUrl}/app/${appId}`;
    return this;
  }

  // Organizations
  getOrganizations(): this {
    this.endpoint = `${this.baseUrl}/org/`;
    return this;
  }

  // Spaces
  getSpacesByOrgId(orgId: number): this {
    this.endpoint = `${this.baseUrl}/space/org/${orgId}/`;
    return this;
  }

  // Hooks
  createHook(ref_type: string, ref_id: number, url: string, type: any): this {
    this.endpoint = `${this.baseUrl}/hook/${ref_type}/${ref_id}`;
    this.payload = {
      ref_type: ref_type,
      ref_id: ref_id,
      url: url,
      type: type,
    };
    return this;
  }

  validateHook(hookId: number, code: string): this {
    this.endpoint = `${this.baseUrl}/hook/${hookId}/verify/validate`;
    this.payload = { code: code };
    return this;
  }

  getHooks(ref_type: string, ref_id: number): this {
    this.endpoint = `${this.baseUrl}/hook/${ref_type}/${ref_id}`;
    return this;
  }

  //PUT
  async put(): Promise<ApiResponse> {
    try {
      const response = await fetch(this.endpoint, {
        method: "PUT",
        headers: {
          Authorization: `OAuth2 ${this.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.payload),
      });

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(
          `HTTP error! Status: ${response.status}, Details: ${JSON.stringify(
            errorBody
          )}`
        );
      }

      const data = await response.json();
      const remaining_limit = Number(
        response.headers.get("X-Rate-Limit-Remaining")
      );
      const rate_limit = Number(response.headers.get("X-Rate-Limit-Limit"));
      return {
        data,
        error: null,
        remaining_limit: remaining_limit,
        rate_limit: rate_limit,
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error : new Error(String(error)),
        remaining_limit: null,
        rate_limit: null,
      };
    }
  }

  //POST
  async post(): Promise<ApiResponse> {
    try {
      const response = await fetch(this.endpoint, {
        method: "POST",
        headers: {
          Authorization: `OAuth2 ${this.token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(this.payload),
      });

      if (
        !response.ok ||
        !response.headers.get("content-type")?.includes("application/json")
      ) {
        const rawResponse = await response.text();
        console.error("Unexpected response:", rawResponse); // Log the raw response for debugging
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const data = await response.json();
      const remaining_limit = Number(
        response.headers.get("X-Rate-Limit-Remaining")
      );
      const rate_limit = Number(response.headers.get("X-Rate-Limit-Limit"));

      return {
        data,
        error: null,
        remaining_limit: remaining_limit,
        rate_limit: rate_limit,
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error : new Error(String(error)),
        remaining_limit: null,
        rate_limit: null,
      };
    }
  }

  //GET
  async get(): Promise<ApiResponse> {
    try {
      const response = await fetch(this.endpoint, {
        method: "GET",
        headers: {
          Authorization: `OAuth2 ${this.token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(
          `HTTP error! Status: ${response.status}, Details: ${JSON.stringify(
            errorBody
          )}`
        );
      }

      const data = await response.json();
      const remaining_limit = Number(
        response.headers.get("X-Rate-Limit-Remaining")
      );
      const rate_limit = Number(response.headers.get("X-Rate-Limit-Limit"));
      return {
        data,
        error: null,
        remaining_limit: remaining_limit,
        rate_limit: rate_limit,
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error : new Error(String(error)),
        remaining_limit: null,
        rate_limit: null,
      };
    }
  }

  //DELETE
  async delete(): Promise<ApiResponse> {
    try {
      const response = await fetch(this.endpoint, {
        method: "DELETE",
        headers: {
          Authorization: `OAuth2 ${this.token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        const errorBody = await response.json();
        throw new Error(
          `HTTP error! Status: ${response.status}, Details: ${JSON.stringify(
            errorBody
          )}`
        );
      }

      const data = await response.json();
      const remaining_limit = Number(
        response.headers.get("X-Rate-Limit-Remaining")
      );
      const rate_limit = Number(response.headers.get("X-Rate-Limit-Limit"));
      return {
        data,
        error: null,
        remaining_limit: remaining_limit,
        rate_limit: rate_limit,
      };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error : new Error(String(error)),
        remaining_limit: null,
        rate_limit: null,
      };
    }
  }
}
