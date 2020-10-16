let video;
let poseNet;
let pose;
let skeleton;
let brain;
let state='waiting';
function keyPressed() {
    targetLabel = key;
    console.log(targetLabel);
    setTimeout(function() {
        console.log('collecting');
        state = 'collecting';
    }, 5000)
}

function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);
  
  video.hide();
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose', gotPoses);
    
    let options = {
        inputs: 50,
        outputs: 2,
        task:'classification',
        debug:true
    }
    brain = ml5.neuralNetwork(options);
    

}

function gotPoses(poses) {
  //console.log(poses);
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
  }
}

function modelLoaded() {
  console.log('poseNet ready');
}

function draw() {
  push();
  background(220);
  translate(video.width, 0);
  scale(-1, 1);
  //image(video, -7*(screen.width-2* video.width)/2, 0, screen.width, windowHeight);
  image(video, -(windowWidth - video.width), 0, windowWidth, windowHeight);
  pop();
}