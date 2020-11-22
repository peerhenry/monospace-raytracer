import Vec3 from './Vec3'

export interface IntersectResult {
  t: number
  normal: Vec3 | null
}

export const NO_INTERSECTION: IntersectResult = {
  t: Number.MAX_VALUE,
  normal: null
}

export default class Box {
  min: Vec3
  max: Vec3

  constructor(min: Vec3, max: Vec3) {
    this.min = min
    this.max = max
  }

  rayIntersect(rayOrg: Vec3, rayDelta: Vec3): IntersectResult {
    let returnNormal = null
    const min = this.min
    const max = this.max

    let inside = true

    // x part rejection
    let xt: number
    let xn = 0
    if (rayOrg.x < min.x) {
      xt = min.x - rayOrg.x
      if (xt > rayDelta.x) return NO_INTERSECTION
      xt /= rayDelta.x
      inside = false
      xn = -1.0
    } else if (rayOrg.x > max.x) {
      xt = max.x - rayOrg.x
      if (xt < rayDelta.x) return NO_INTERSECTION
      xt /= rayDelta.x
      inside = false
      xn = 1.0
    }
    else xt = -1.0

    // y part rejection
    let yt: number
    let yn = 0
    if (rayOrg.y < min.y) {
      yt = min.y - rayOrg.y
      if (yt > rayDelta.y) return NO_INTERSECTION
      yt /= rayDelta.y
      inside = false
      yn = -1.0
    } else if (rayOrg.y > max.y) {
      yt = max.y - rayOrg.y
      if (yt < rayDelta.y) return NO_INTERSECTION
      yt /= rayDelta.y
      inside = false
      yn = 1.0
    }
    else yt = -1.0

    // z part rejection
    let zt: number
    let zn = 0
    if (rayOrg.z < min.z) {
      zt = min.z - rayOrg.z
      if (zt > rayDelta.z) return NO_INTERSECTION
      zt /= rayDelta.z
      inside = false
      zn = -1.0
    } else if (rayOrg.z > max.z) {
      zt = max.z - rayOrg.z
      if (zt < rayDelta.z) return NO_INTERSECTION
      zt /= rayDelta.z
      inside = false
      zn = 1.0
    }
    else zt = -1.0

    // ray origin inside box?
    if (inside) {
      return {
        t: 0,
        normal: null // skipped returnNormal
      }
    }

    // farthest plane
    let which = 0
    let t = xt
    if (yt > t) {
      which = 1
      t = yt
    }
    if (zt > t) {
      which = 2
      t = zt;
      }
    let x: number, y: number, z: number
    switch (which) {
      case 0: // intersect with yz plane
        y = rayOrg.y + rayDelta.y * t
        if (y < min.y || y > max.y) return NO_INTERSECTION
        z = rayOrg.z + rayDelta.z * t
        if (z < min.z || z > max.z) return NO_INTERSECTION
        returnNormal = new Vec3(xn, 0, 0)
        break
      case 1: // intersect with xz plane
        x = rayOrg.x + rayDelta.x * t
        if (x < min.x || x > max.x) return NO_INTERSECTION
        z = rayOrg.z + rayDelta.z * t
        if (z < min.z || z > max.z) return NO_INTERSECTION
        returnNormal = new Vec3(0, yn, 0)
        break
      case 2: // intersect with xy plane
        x = rayOrg.x + rayDelta.x * t
        if (x < min.x || x > max.x) return NO_INTERSECTION
        y = rayOrg.y + rayDelta.y * t
        if (y < min.y || y > max.y) return NO_INTERSECTION
        returnNormal = new Vec3(0, 0, zn)
        break
    }

    // debug
      return {
        t,
        normal: returnNormal
      }
  }
}
