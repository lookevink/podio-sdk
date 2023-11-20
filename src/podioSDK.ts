type ItemId = number;
type AppId = number;
type OAuthToken = string;

export class podioClient {
  private baseUrl: string = "https://api.podio.com";
  private token: OAuthToken;
  private endpoint: string = "";
  private payload: any = null;
  private filter: any = null;

  constructor(token: OAuthToken) {
    this.token = token;
  }

  eq(field: string, value: string): this {
    this.filter = { [field]: value };
    return this;
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

  getApps(): this {
    let queryParams: string[] = [];

    const queryString =
      queryParams.length > 0 ? `?${queryParams.join("&")}` : "";
    this.endpoint = `${this.baseUrl}/app/${queryString}`;

    return this;
  }

  getAppById(appId: AppId): this {
    this.endpoint = `${this.baseUrl}/app/${appId}`;
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
