import fp from "@fingerprintjs/fingerprintjs";

export const getFingerprint = async () => {
  try {
    const loader = await fp.load();
    const _fp = await loader.get();
    return _fp.visitorId;
  } catch (err) {
    throw err;
  }
};
