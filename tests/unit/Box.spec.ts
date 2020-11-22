import Box, { NO_INTERSECTION } from '@/Box'
import Vec3 from '@/Vec3'

describe('Box', () => {
  it('can be constructed', () => {
    const box = new Box(new Vec3(0, 0, 0), new Vec3(1, 1, 1))
    expect(box.min.x).toBe(0)
    expect(box.min.y).toBe(0)
    expect(box.min.z).toBe(0)
    expect(box.max.x).toBe(1)
    expect(box.max.y).toBe(1)
    expect(box.max.z).toBe(1)
  })

  it('can do ray intersection', () => {
    const box = new Box(new Vec3(-0.1, -0.1, -0.1), new Vec3(0.1, 0.1, 0.1))
    // Act
    const resultMiss = box.rayIntersect(new Vec3(-1,0,-1), new Vec3(0,0,2))
    const resultHit = box.rayIntersect(new Vec3(0, 0, -1), new Vec3(0, 0, 2))
    // Assert
    expect(resultHit.normal).toEqual(new Vec3(0,0,-1))
    expect(resultMiss).toEqual(NO_INTERSECTION)
  })
})
