import { podioClient } from "../src/podioSDK";
import "dotenv/config";

describe("podioSDK", () => {
  const oAuthToken = process.env.PODIO_OAUTH_TOKEN!;
  const podio = new podioClient(oAuthToken);

  it("should refresh token", async () => {
    const clientId = process.env.PODIO_CLIENT_ID!;
    const clientSecret = process.env.PODIO_CLIENT_SECRET!;
    const refreshToken = process.env.PODIO_REFRESH_TOKEN!;

    const { data, error } = await podio.refreshToken(
      clientId,
      clientSecret,
      refreshToken
    );

    console.log(data, error);

    expect(error).toBeNull();
    expect(data).toBeDefined();
  });

  it("should add an item", async () => {
    const appId = 28578294;
    const esoItem = {
      title: "Test ESO Item",
      "last-name": "SDK",
    };

    try {
      const { data, error } = await podio.addItem(appId, esoItem).post();
      console.log("Response Data:", data);
      console.log("Error:", error);

      expect(error).toBeNull();
      expect(data).toBeDefined();
    } catch (e) {
      console.error("API Call Failed:", e);
      throw e;
    }
  });

  it("should add an item with external_id", async () => {
    const appId = 28578294;
    const esoItem = {
      title: "Test ESO Item",
      "last-name": "SDK",
    };
    const externalId = "eso-sdk-test";

    try {
      const { data, error } = await podio
        .addItem(appId, esoItem, externalId)
        .post();
      console.log("Response Data:", data);
      console.log("Error:", error);

      expect(error).toBeNull();
      expect(data).toBeDefined();
    } catch (e) {
      console.error("API Call Failed:", e);
      throw e;
    }
  });

  it("should update an item", async () => {
    const appId = 28578294;

    const esoUpdateValues = { "primary-email": "kevin@lookev.dev" };

    try {
      const { data, error } = await podio
        .updateItem(appId, esoUpdateValues)
        .put();
      console.log("Response Data:", data);
      console.log("Error:", error);

      expect(error).toBeNull();
      expect(data).toMatchObject({
        title: "Test ESO Item",
        "last-name": "SDK",
      });
    } catch (e) {
      console.error("API Call Failed:", e);
      throw e;
    }
  });

  it("should get an item", async () => {
    const itemId = 123456789;
    const { data, error } = await podio.getItemValuesV2(itemId).get();

    expect(error).toBeNull();
    expect(data).toMatchObject({ title: "Test ESO Item", "last-name": "SDK" });
  });

  it("should filter items and return matching", async () => {
    const appId = 28578294;
    const filterOptions = {
      sortBy: "app_item_id",
      // sortBy: "title",
      sortDesc: true,
      filters: { "motivation-level": [6] },
      limit: 50,
    };

    const { data, error } = await podio
      .filterItems(appId, filterOptions)
      .post();

    console.log(data, error);

    expect(error).toBeNull();
    expect(data).toBeDefined();
  }, 15000);

  it("should sort items based on created_on", async () => {
    const appId = 29195140;
    const filterOptions = {
      sortBy: "created_on",
      sort_desc: false,
      limit: 500,
    };

    const { data, error } = await podio
      .filterItems(appId, filterOptions)
      .post();

    console.log(data, error);

    expect(error).toBeNull();
    expect(data).toBeDefined();
  }, 15000);

  it("get item count in an app", async () => {
    const appId = 28578294;
    const { data, error } = await podio.getItemCount(appId).get();

    console.log(data, error);

    expect(error).toBeNull();
    expect(data).toBeDefined();
  });

  it("should get an item by external_id", async () => {
    const appId = 28578294;
    const externalId = "eso-sdk-test";
    const { data, error } = await podio
      .getItemByExternalId(appId, externalId)
      .get();

    expect(error).toBeNull();
    expect(data).toBeDefined();
  });

  it("should delete an item", async () => {
    const itemId = 123456789;
    const { data, error } = await podio.deleteItem(itemId).delete();

    expect(error).toBeNull();
    expect(data).toBeNull();
  });

  it("should search in app v2", async () => {
    const appId = 29185294;
    const searchOptions = {
      query: "Alamo",
      refType: "item",
      limit: 50,
    };
    const { data, error } = await podio.searchInApp(appId, searchOptions).get();

    console.log(data, error);

    expect(error).toBeNull();
    expect(data).toBeDefined();
  });

  it("should get apps", async () => {
    const { data, error } = await podio.getApps().get();

    expect(error).toBeNull();
    expect(data).toBeDefined();
  });

  it("should get apps by space id", async () => {
    const spaceId = 8225207;
    const { data, error } = await podio.getAppsBySpaceId(spaceId).get();

    expect(error).toBeNull();
    expect(data).toBeDefined();
  });

  it("get app by id", async () => {
    const appId = 28578294;
    const { data, error } = await podio.getAppById(appId).get();

    expect(error).toBeNull();
    expect(data).toBeDefined();
  });

  it("should get orgs", async () => {
    const { data, error } = await podio.getOrganizations().get();

    console.log(data, error);
    expect(error).toBeNull();
    expect(data).toBeDefined();
  });

  it("should get spaces", async () => {
    const orgId = 866655;
    const { data, error } = await podio.getSpacesByOrgId(orgId).get();

    console.log(data, error);
    expect(error).toBeNull();
    expect(data).toBeDefined();
  });

  it("should create a webhook", async () => {
    const ref_type = "app";
    const ref_id = 29195140;
    const url = "https://eso-web.easystreetoffers.com/sync/1/";
    const type = "item.create";

    const { data, error } = await podio
      .createHook(ref_type, ref_id, url, type)
      .post();

    console.log(data, error);
    expect(error).toBeNull();
    expect(data).toBeDefined();
  });

  it("should verify a hook", async () => {
    const hookId = 123;
    const code = "something";
    const { data, error } = await podio.validateHook(hookId, code).post();

    console.log(data, error);
    expect(error).toBeNull();
    expect(data).toBeDefined();
  });

  it("should get hooks", async () => {
    const ref_type = "app";
    const ref_id = 29195140;
    const { data, error } = await podio.getHooks(ref_type, ref_id).get();

    console.log(data, error);
    expect(error).toBeNull();
    expect(data).toBeDefined();
  });
});
