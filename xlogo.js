
// helper functions
function randomPoint() {
    return new Point(Math.random() * w * 2.0 - w / 2.0, Math.random() * h * 2.0 - h / 2.0)
}

function closeIndexToIndex(index) {
    var distance = 100000.0
    var closeIndex = 42
    for (var i = 0; i < group.children.length / 3; i++) {
        var whoa = positionsIn[index] - positionsIn[i]
        if(whoa.length < distance) {
            distance = whoa.length
            closeIndex = i
        }
    }
    return closeIndex
}

// constants
var w = view.size.width
var h = view.size.height
var count = 5000
var linesCount = 500
var speed = 0.05
var pointSize = 2

// variables
var positionsIn = []
var positionsOut = []
var linePositions = []
var isDirectionOut = false
var pointerPosition = new Point(0, 0)

// background
var rectangle = new Rectangle(new Point(0, 0), new Point(w, h))
var background = new Path.Rectangle(rectangle)
background.fillColor = 'black'

// x logo path
var pathData = "M18.8,380.9L18.8,380.9c25.1,25.1,66.1,25.1,91.2,0l92.1-92.1 c19.1-16.6,46.5-9.1,57.1,1.5c9.6,9.6,13.5,22.8,11.6,35.3c-3.6,24.1,7.5,43.8,19,55.3c25.1,25.1,66.1,25.1,91.2,0l0,0 c25.1-25.1,25.1-66.1,0-91.2c-14.3-14.3-29.3-21.2-49.9-19.8c-18,1.2-36.4-5.1-50.1-18.8c-14.4-14.4-21-35.9-18.1-55.8 c2-13.1,8.1-25.7,18.1-35.8c13.4-13.4,31.2-19.7,48.8-18.8c17.2,0.9,27.3-6.8,32.4-11.9l18.8-18.8c25.1-25.1,25.1-66.1,0-91.2l0,0 c-25.1-25.1-66.1-25.1-91.2,0l-89.9,89.9L110,18.8c-25.1-25.1-66.1-25.1-91.2,0l0,0c-25.1,25.1-25.1,66.1,0,91.2 c30,30,59.9,59.9,89.9,89.9l-89.9,89.9C-6.3,314.8-6.3,355.8,18.8,380.9L18.8,380.9z"
var path = new Path(pathData)
path.fillColor = {hue: 0, saturation: 0, lightness: 0.0}
var xlogo = new Group(path)
xlogo.position = new Point(w / 2.0, h / 2.0)

// create groups
var lines = new Group()
var group = new Group()

// add points
for(var i = 0; i < count; i++) {
    var point = new Point(Math.random() * w, Math.random() * h)
    if(path.hitTest(point) != null) {
        var pos = randomPoint()
        positionsOut.push(pos)
        var dot = new Path.Circle(pos, pointSize)
        dot.fillColor = {hue: 0, saturation: 0, lightness: 0.5 + Math.random() / 2.0}
        group.addChild(dot)
        positionsIn.push(point)
    }
}

// helper for getting some close points
function closeIndexToIndex(index) {
    var distance = 100000.0
    var closeIndex = 42
    for (var i = 0; i < group.children.length / 3; i++) {
        var whoa = positionsIn[index] - positionsIn[i]
        if(whoa.length < distance) {
            distance = whoa.length
            closeIndex = i
        }
    }
    return closeIndex
}

// add lines
for(var i = 0; i < linesCount; i++) {
    var fromIndex = Math.floor(Math.random() * group.children.length)
    var toIndex = closeIndexToIndex(fromIndex)
    var from = positionsIn[fromIndex]
    var to = positionsIn[toIndex]
    linePositions.push({from: fromIndex, to: toIndex})
    var line = new Path.Line(positionsIn[fromIndex], positionsIn[toIndex])
    line.strokeColor = 'black'
    line.strokeWeight = 1
    lines.addChild(line)
}

// redrawing
function onFrame(event) {
  // update points
  for (var i = 0, len = group.children.length; i < len; i++) {
     var randomVector = new Point(Math.random() - 0.5, Math.random() - 0.5) * 2
     var pointerVector = pointerPosition - group.children[i].position
     if(pointerVector.length < 20) {
         randomVector += pointerVector.normalize() * (pointerVector.length - 40)
     }
     if(isDirectionOut) {
         var diff = positionsOut[i] - group.children[i].position
         if(diff.length < 0.5) {
           isDirectionOut = !isDirectionOut
         }
         group.children[i].position += diff.normalize() * diff.length * speed + randomVector
     } else {
         var diff = positionsIn[i] - group.children[i].position
         group.children[i].position += diff.normalize() * diff.length * speed + randomVector
     }
  }
  // update lines
  for (var j = 0; j < lines.children.length; j++) {
     var l = lines.children[j]
     l.segments[0].point = group.children[linePositions[j].from].position
     l.segments[1].point = group.children[linePositions[j].to].position
     l.strokeColor = {hue: 0, saturation: 0, lightness: 1.0 - l.length / 50.0}
  }
}

// mouse events
function onMouseUp(event) {
  isDirectionOut = !isDirectionOut
  if(isDirectionOut) {
      positionsOut = []
      for(var i = 0; i < count; i++) {
          var point = randomPoint()
          positionsOut.push(point)
      }
  }
}

function onMouseMove(event) {
    pointerPosition = event.point;
}
