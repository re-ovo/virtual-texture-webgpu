import { RendererContext } from "./context";

export function startRendering(context: RendererContext) {
  // Create vertex buffer
  const vertices = new Float32Array([
    0.0,
    0.5,
    0, // Vertex 1 (top)
    -0.5,
    -0.5,
    0, // Vertex 2 (bottom left)
    0.5,
    -0.5,
    0, // Vertex 3 (bottom right)
  ]);

  const vertexBuffer = context.device.createBuffer({
    size: vertices.byteLength,
    usage: GPUBufferUsage.VERTEX | GPUBufferUsage.COPY_DST,
  });

  context.device.queue.writeBuffer(vertexBuffer, 0, vertices);

  // Create vertex shader
  const vertexShader = context.device.createShaderModule({
    code: `
      @vertex
      fn main(@location(0) position: vec3<f32>) -> @builtin(position) vec4<f32> {
        return vec4<f32>(position, 1.0);
      }
    `,
  });

  // Create fragment shader
  const fragmentShader = context.device.createShaderModule({
    code: `
      @fragment
      fn main() -> @location(0) vec4<f32> {
        return vec4<f32>(1.0, 0.0, 0.0, 1.0); // Red color
      }
    `,
  });

  // Create render pipeline
  const pipeline = context.device.createRenderPipeline({
    layout: "auto",
    vertex: {
      module: vertexShader,
      entryPoint: "main",
      buffers: [
        {
          arrayStride: 12, // 3 floats * 4 bytes
          attributes: [
            {
              shaderLocation: 0,
              offset: 0,
              format: "float32x3",
            },
          ],
        },
      ],
    },
    fragment: {
      module: fragmentShader,
      entryPoint: "main",
      targets: [
        {
          format: navigator.gpu.getPreferredCanvasFormat(),
        },
      ],
    },
    primitive: {
      topology: "triangle-list",
    },
  });

  // Create command encoder and render pass
  const commandEncoder = context.device.createCommandEncoder();
  const textureView = context.context.getCurrentTexture().createView();
  const renderPass = commandEncoder.beginRenderPass({
    colorAttachments: [
      {
        view: textureView,
        clearValue: { r: 0.0, g: 0.0, b: 0.0, a: 1.0 },
        loadOp: "clear",
        storeOp: "store",
      },
    ],
  });

  renderPass.setPipeline(pipeline);
  renderPass.setVertexBuffer(0, vertexBuffer);
  renderPass.draw(3); // Draw 3 vertices
  renderPass.end();

  // Submit commands
  context.device.queue.submit([commandEncoder.finish()]);
}
