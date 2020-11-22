<template lang="pug">
#app
  div(v-for="(line, index) in lines" :key="index" v-html="line")
  button(@click="stop") stop
  button(@click="play") play
</template>

<script>
String.prototype.replaceAt = function(index, replacement) {
  return this.substr(0, index) + replacement + this.substr(index + replacement.length)
}

export default {
  el: '#app',
  data() {
    return {
      lines: [],
      newLines: [],
      resX: 160,
      resY: 60,
      // recs: [{ x: 20, y: 30, char: 'W', width: 2, height: 20}],
      recs: [],
      circles: [{ x: 60, y: 30, char: 'O', radius: 20 }],
      interval: null,
      stepCounter: 0,
    }
  },
  computed: {},
  methods: {
    clear() {
      this.newLines = []
      for (let i = 0; i < this.resY; i++) {
        let rule = ''
        for (let j = 0; j < this.resX; j++) {
          // rule = rule.concat('&nbsp;')
          rule = rule.concat('.')
        }
        this.newLines.push(rule)
      }
    },
    drawThings() {
      for (const rec of this.recs) {
        const rX = Math.round(rec.x) % this.resX
        const rY = Math.round(rec.y) % this.resY
        this.drawRec(rX, rY, rec.char, rec.width, rec.height)
      }
      for (const circle of this.circles) {
        this.drawCircle(circle)
      }
    },
    drawCircle({ x, y, char, radius }) {
      const w = Math.floor(radius)
      const h = Math.floor(radius / 2)
      for (let i = -w; i <= w; i++) {
        for (let j = -h; j <= h; j++) {
          const xx = Math.round(x + i)
          const yy = Math.round(y + j)
          const dx = i
          const dy = 2 * j
          if (dx * dx + dy * dy < radius * radius) {
            this.setCharAt(xx, yy, char)
          }
        }
      }
      this.setCharAt(Math.round(x), Math.round(y), char)
    },
    drawRec(x, y, char, width, height) {
      const w = Math.floor(width / 2)
      const h = Math.floor(height / 4)
      for (let i = -w; i <= w; i++) {
        for (let j = -h; j <= h; j++) {
          this.setCharAt(x + i, y + j, char)
        }
      }
    },
    setCharAt(x, y, char) {
      let modX = x % this.resX
      let modY = y % this.resY
      if (modX < 0) modX = modX + this.resX
      if (modY < 0) modY = modY + this.resY
      this.newLines[modY] = this.newLines[modY]?.replaceAt(modX, char)
    },
    flush() {
      this.lines = this.newLines
    },
    draw() {
      this.clear()
      this.drawThings()
      this.flush()
    },
    update() {
      this.recs.forEach(rec => {
        rec.x = (rec.x + 1) % this.resX
        rec.y = (rec.y + 1) % this.resY
      })
      this.circles.forEach(c => {
        c.x = (c.x + 1.8) % this.resX
        c.y = (c.y + 0.5) % this.resY
        c.radius = 20 + 5 * Math.sin(this.stepCounter / 10)
        // c.char = this.stepCounter % 2 === 0 ? ',' : ':'
      })
    },
    tick() {
      this.update()
      this.draw()
      this.stepCounter++
    },
    stop() {
      clearInterval(this.interval)
      this.interval = null
    },
    play() {
      if (!this.interval) this.interval = setInterval(this.tick, 80)
    },
  },
  mounted() {
    // this.draw()
    this.play()
  },
}
</script>

<style lang="stylus">
html, body
  background-color black
  color white
  font-family consolas
  font-size 10px
</style>
