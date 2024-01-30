declare global {
  interface Window {
    TVWebSDK: any;
  }

  interface TVWebSDKInstance {
    readIDCardUIOnly: () => void;
    livenessDetection: (options: { mode: string }) => void;
    runPreloadEKYCResources: () => void;
    destroyView: () => void;
  }
}

export {};