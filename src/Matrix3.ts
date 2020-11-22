import Vec3 from './Vec3'

export default class Matrix3 {
  elements: Array<number>

  constructor() {
    this.elements = [1,0,0,0,1,0,0,0,1]
  }

  set(a1: number, a2: number, a3: number, b1: number, b2: number, b3: number, c1: number, c2: number, c3: number,) {
    this.elements = [a1, a2, a3, b1, b2, b3, c1, c2, c3]
  }

  multiply(v: Vec3) {
    return new Vec3(
      this.elements[0] * v.x + this.elements[1] * v.y + this.elements[2] * v.z,
      this.elements[3] * v.x + this.elements[4] * v.y + this.elements[5] * v.z,
      this.elements[6] * v.x + this.elements[7] * v.y + this.elements[8] * v.z)
  }
}

