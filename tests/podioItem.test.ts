import { podioClient } from "../src/podioSDK";
import "dotenv/config";

describe("podioSDK", () => {
  const oAuthToken = process.env.PODIO_OAUTH_TOKEN!;
  const podio = new podioClient(oAuthToken);

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

  it("should get apps", async () => {
    const { data, error } = await podio.getApps().get();

    expect(error).toBeNull();
    expect(data).toBeDefined();
  });

  it("get app by id", async () => {
    const appId = 28578294;
    const { data, error } = await podio.getAppById(appId).get();

    expect(error).toBeNull();
    expect(data).toBeDefined();
  });
});
