export class RendererContext {
  private _device: GPUDevice;
  private _context: GPUCanvasContext;
  private _textureCacheFolder: FileSystemDirectoryHandle;

  constructor(
    device: GPUDevice,
    context: GPUCanvasContext,
    textureCacheFolder: FileSystemDirectoryHandle
  ) {
    this._device = device;
    this._context = context;
    this._textureCacheFolder = textureCacheFolder;
  }

  get device() {
    return this._device;
  }

  get context() {
    return this._context;
  }

  get textureCacheFolder() {
    return this._textureCacheFolder;
  }
}

export async function initContext(canvas: HTMLCanvasElement) {
  const storage = await navigator.storage.estimate();
  console.log(
    `Storage: ${storage.usage! / 1024 / 1024}MB / ${
      storage.quota! / 1024 / 1024
    }MB`
  );
  const directory = await navigator.storage.getDirectory();
  const textureCacheFolder = await directory.getDirectoryHandle(
    "textureCache",
    {
      create: true,
    }
  );

  const adapter = await navigator.gpu.requestAdapter({
    powerPreference: "high-performance",
  });
  if (!adapter) {
    throw new Error("Failed to request adapter");
  }
  const device = await adapter.requestDevice();
  const canvasFormat = navigator.gpu.getPreferredCanvasFormat();

  const context = canvas.getContext("webgpu");
  if (!context) {
    throw new Error("Failed to get WebGPU context");
  }

  context.configure({
    device,
    format: canvasFormat,
  });

  return new RendererContext(device, context, textureCacheFolder);
}
