const bs = require("browser-sync")
const { series, watch } = require("gulp")

function bsInit(done) {
  bs.init({
    server: {
      baseDir: "product/"
    },
    notify: false,
  })

  done()
}

function bsReload(done) {
  bs.reload()

  done()
}

function watchTask(done) {
  watch(["product/**"], series(bsReload))
}

exports.default = series(bsInit, bsReload, watchTask)