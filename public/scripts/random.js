const badDirector = function(coordinate) {
  let coord = coordinate;
  let randonNum = Math.random();
  let smallerNum = randonNum / 10;
  if (Math.random() < .5) {
    coord = coord - smallerNum;
  } else {
    coord = coord + smallerNum;
  }
  return coord;
};

console.log(badDirector(2.2344));
console.log(badDirector(2.2344));
console.log(badDirector(2.2344));
console.log(badDirector(2.2344));
console.log(badDirector(2.2344));
