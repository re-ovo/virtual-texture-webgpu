import { Mat4, mat4, quat, Quat, vec3, Vec3 } from "wgpu-matrix";
import { RendererContext } from "./context";

export class Camera {
  private readonly _context: RendererContext;

  private readonly _position: Vec3;
  private readonly _rotation: Quat;

  private readonly _viewMatrix: Mat4;
  private readonly _viewMatrixInverse: Mat4;

  private readonly _projectionMatrix: Mat4;

  constructor(context: RendererContext, position: Vec3, rotation: Quat) {
    this._context = context;
    this._position = position;
    this._rotation = rotation;
    this._viewMatrix = mat4.create();
    this._viewMatrixInverse = mat4.create();
    this._projectionMatrix = mat4.create();
    this.update();
  }

  update() {
    mat4.translation(this._position, this._viewMatrix);
    mat4.mul(this._viewMatrix, mat4.fromQuat(this._rotation), this._viewMatrix);

    mat4.invert(this._viewMatrix, this._viewMatrixInverse);

    mat4.perspective(
      Math.PI / 2,
      this._context.canvas.width / this._context.canvas.height,
      0.1,
      1000,
      this._projectionMatrix
    );
  }

  get position() {
    return this._position;
  }

  get rotation() {
    return this._rotation;
  }

  set position(value: Vec3) {
    vec3.copy(value, this._position);
    this.update();
  }

  set rotation(value: Quat) {
    quat.copy(value, this._rotation);
    this.update();
  }

  get viewMatrix() {
    return this._viewMatrix;
  }

  get viewMatrixInverse() {
    return this._viewMatrixInverse;
  }

  get projectionMatrix() {
    return this._projectionMatrix;
  }
}
