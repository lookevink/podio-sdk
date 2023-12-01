type ItemId = number;
type AppId = number;
type OAuthToken = string;

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

  //PUT
  async put(): Promise<{ data: any | null; error: Error | null }> {
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
      return { data, error: null };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error : new Error(String(error)),
      };
    }
  }

  //POST
  async post(): Promise<{ data: any | null; error: Error | null }> {
    try {
      const response = await fetch(this.endpoint, {
        method: "POST",
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
      return { data, error: null };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error : new Error(String(error)),
      };
    }
  }

  //GET
  async get(): Promise<{ data: any | null; error: Error | null }> {
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
      return { data, error: null };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error : new Error(String(error)),
      };
    }
  }

  //DELETE
  async delete(): Promise<{ data: any | null; error: Error | null }> {
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
      return { data, error: null };
    } catch (error) {
      return {
        data: null,
        error: error instanceof Error ? error : new Error(String(error)),
      };
    }
  }
}
