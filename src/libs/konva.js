import _ from 'lodash'
import randomColor from 'randomcolor'
import Konva from 'konva'

const konva = k = {
  stage: null,
  gridLayer: null,
  imageLayer: null,
}

konva.init = (container, { size, piece, url, ...options }) => {
  k.stage = new Konva.Stage({
    container,
    ...options
  })

  k.gridLayer = new Konva.Layer()
  k.imageLayer = new Konva.Layer()

  k.stage.add(k.gridLayer)
  k.stage.add(k.imageLayer)

  k.bindEvents()
  k.addImage({ url, size, piece })

  return k.stage
}

konva.bindEvents = () => {
  k.stage.on('pointerdown', (evt) => {
    try {
      if (evt.target instanceof Konva.Image) {
        evt.target.moveToTop()
      }
    } catch (ex) {
      console.log(ex)
    }
  })
}

konva.addImage = ({ url, size, piece }) => {
  Konva.Image.fromURL(url, handleImage)

  function handleImage (img) {
    const gridSize = size / piece
    const offset = gridSize / 2
    let count = 0
    let blocks = []

    _.times(piece, (rowIdx) => {
      _.times(piece, (colIdx) => {
        const grid = new Konva.Rect({
          x: (gridSize * rowIdx) + offset,
          y: (gridSize * colIdx) + offset,
          width: gridSize,
          height: gridSize,
          offsetX: offset,
          offsetY: offset,
          fill: randomColor(),
        })

        grid.__matchId = count

        k.gridLayer.add(grid)

        const croppedImage = new Konva.Image({
          image: img.image(),
          draggable: true,
          // x: ((gridSize * rowIdx) + offset) + size,
          // y: (gridSize * colIdx) + offset,
          width: gridSize,
          height: gridSize,
          offsetX: offset,
          offsetY: offset,
          crop: {
            x: gridSize * rowIdx,
            y: gridSize * colIdx,
            width: gridSize,
            height: gridSize
          }
        })

        blocks.push(croppedImage)

        croppedImage.__matchId = count

        croppedImage.on('dragend', (e) => {
          const grid = k.gridLayer.getIntersection(e.target.getAbsolutePosition())

          if (grid && (grid.__matchId === e.target.__matchId)) {
            e.target.x(grid.x())
            e.target.y(grid.y())
          }
        })

        count++
      })
    })

    blocks = _.shuffle(blocks)

    k.gridLayer.children.forEach((grid, gridIdx) => {
      const image = blocks[gridIdx]
      image.x(grid.x() + size)
      image.y(grid.y())
      k.imageLayer.add(image)
    })
  }
}

export default konva
