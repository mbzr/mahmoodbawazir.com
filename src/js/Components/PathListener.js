export default new (class PathListener {
  run() {
    this.m = MBZ
    const newPath = this.m.path.new
    const paths = {
      home: '/' === newPath,
      case: 'rivoli' === newPath
    }

    return {
      is: paths
    }
  }
})()