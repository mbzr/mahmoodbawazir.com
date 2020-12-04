export default new (class PathListener {
  run() {
    this.m = MBZ
    const newPath = this.m.path.new
    const paths = {
      home: '/' === newPath,
      case: '/' !== newPath
    }

    return {
      is: paths
    }
  }
})()