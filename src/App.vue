<template lang="pug">
#app
  //- p , - ~ : ; = ! * # $ @
  p {{ titleMessage }}
  div(v-for="(line, index) in lines" :key="index" v-html="line")
  button(@click="toggle") {{ interval ? 'Pause ' : 'Play' }}
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Box from './Box'
import Vec3 from './Vec3'
import Matrix3 from './Matrix3'

function createCube(size: number): Box {
  const half = size / 2
  return new Box(new Vec3(-half, -half, -half), new Vec3(half, half, half))
}

const ssRayDelta = new Vec3(0, 0, 2)
const ssLightRaw = new Vec3(1, 3, 4) // unnormalized
const ll = Math.sqrt(ssLightRaw.x * ssLightRaw.x + ssLightRaw.y * ssLightRaw.y + ssLightRaw.z * ssLightRaw.z)
const ssLight = new Vec3(ssLightRaw.x / ll, ssLightRaw.y / ll, ssLightRaw.z / ll) // normalized

interface EnvironmentState {
  osRayDelta: Vec3,
  osLight: Vec3
}

export default defineComponent({
  name: 'App',
  data() {
    return {
      lines: [] as Array<string>,
      newLines: [] as Array<string>,
      resX: 60,
      resY: 30,
      objects: [] as Box[],
      stepCounter: 0,
      interval: undefined as number | undefined,
      transform: new Matrix3(),
      environmentState: {
        osRayDelta: ssRayDelta,
        osLight: ssLight,
      } as EnvironmentState,
    }
  },
  computed: {
    titleMessage: {
      get(): string {
        return this.interval ? 'Playing ' + this.stepCounter : 'Paused'
        // return String(this.resX)
      },
      set() {},
    },
  },
  methods: {
    setup() {
      this.objects.push(createCube(0.9))
      // this.objects.push(
      //   new Box(new Vec3(-0.1, -0.3, -0.45), new Vec3(0.1, 0.3, 0.45))
      // )
    },
    toggle() {
      if (!this.interval) this.interval = window.setInterval(() => this.tick(), 40)
      else {
        window.clearInterval(this.interval)
        this.interval = undefined  
      }
    },
    tick() {
      // var t0 = performance.now()
      this.stepCounter = this.stepCounter + 1
      // update box transform
      this.transform = new Matrix3()
      const speed = 10
      const bank = (this.stepCounter / 50)*speed
      const pitch = 2
      const heading = (this.stepCounter / 150)*speed // 2
      const cosb = Math.cos(bank)
      const sinb = Math.sin(bank)
      const cosp = Math.cos(pitch)
      const sinp = Math.sin(pitch)
      const cosh = Math.cos(heading)
      const sinh = Math.sin(heading)
      // this.transform.set(cos, sin, 0, -sin, cos, 0, 0, 0, 1)
      this.transform.set(
        cosh*cosb + sinh*sinp*sinb, sinb*cosp, -sinh*cosb + cosh*sinp*sinb,
        -cosh*sinb + sinh*sinp*cosb, cosb*cosp, sinb*sinh + cosh*sinp*cosb,
        sinh*cosp, -sinp, cosh*cosp
      )
      // calculate environment state
      this.environmentState.osRayDelta = this.transform.multiply(ssRayDelta)
      this.environmentState.osLight = this.transform.multiply(ssLight)
      // iterate over fragments for raytracing
      this.newLines = []
      for (let j = 0; j < this.resY; j++) {
        const eyes = []
        for (let i = 0; i < this.resX; i++) eyes.push(i)
        const rule = eyes.reduce((agg, eye) => agg.concat(this.rayTrace(eye, j)), [] as Array<string>)
        const line = rule.join('')
        this.newLines.push(line)
      }
      this.lines = this.newLines
      // var t1 = performance.now()
      // console.log("tick() took " + (t1 - t0) + " milliseconds.")
    },
    rayTrace(i: number, j: number): string {
      // let nextChar = '.' // '&nbsp;'
      let nextChar = '&nbsp;'
      // screen space rays
      const ssRayOrg = new Vec3((2*i / this.resX) - 1, (2*j / this.resY) - 1, -1)
      const osRayOrg = this.transform.multiply(ssRayOrg)
      // intersect with box
      for (const object of this.objects) {
        if(!this.environmentState.osRayDelta) return nextChar
        const result = object.rayIntersect(osRayOrg, this.environmentState.osRayDelta)
        // const result = object.rayIntersect(ssRayOrg, ssRayDelta)
        if (result.t !== Number.MAX_VALUE && result.normal !== null) {
          const amount = -result.normal.dot(this.environmentState.osLight)
          nextChar = '.'
          '.,-~:;=!*#$@'
          const luminance = ['.', ',', '-', '~', ':', ';', '=', '!', '*', '#', '$', '@']
          const steps = 12
          const step = 1/steps
          // if(amount > 0) nextChar = ','
          // if(amount > step) nextChar = ';'
          // if(amount > 2*step) nextChar = 'I'
          // if(amount > 3*step) nextChar = '&'
          // if(amount > 0.8) nextChar = '@'
          // return String(Math.floor(-amount*10))
          for(let s = 0; s < steps; s++) {
            if(amount > s*step) nextChar = luminance[s]
            else break
          }
        }
      }
      return nextChar
    }
  },
  mounted() {
    this.setup()
    this.toggle()
  }
})
</script>

<style lang="stylus">
html, body
  background-color black
  color white
  font-family consolas
  font-size 10px
</style>
