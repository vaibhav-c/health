let video;
let poseNet;
let pose;
let skeleton;
let brain;
let state='waiting';
let targetLabel;


function setup() {
  let canvas = createCanvas(windowWidth, windowHeight);
  video = createCapture(VIDEO);
  
  video.hide();
  poseNet = ml5.poseNet(video, modelLoaded);
  poseNet.on('pose', gotPoses);

}

function gotPoses(poses) {
  //console.log(poses);
  mulFacHeight = windowHeight/480;
  factor = -(windowWidth - video.width);
  mul = windowWidth/640;
  if (poses.length > 0) {
    pose = poses[0].pose;
    skeleton = poses[0].skeleton;
    if(state == 'collecting') {
        let inputs = [];
        for(let i = 0; i < pose.keypoints.length; i++) {
            let x = pose.keypoints[i].position.x * mul + factor;
            let y = pose.keypoints[i].position.y * mulFacHeight;
            inputs.push(x);
            inputs.push(y);
        }
        let target = [targetLabel];
        brain.addData(inputs, target);
    }
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
  factor = -(windowWidth - video.width);
  mulFacHeight = 1;
  image(video, factor, 0, windowWidth, windowHeight);
  mul = 1;
  if (pose) {
    let eyeR = pose.rightEye;
    let eyeL = pose.leftEye;
    let d = dist(eyeR.x * mul + factor, eyeR.y * mulFacHeight, eyeL.x * mul + factor, eyeL.y * mulFacHeight);
    fill(255, 255, 255);
    ellipse(eyeR.x * mul + factor, eyeR.y * mulFacHeight, 40);
    ellipse(eyeL.x * mul + factor, eyeL.y * mulFacHeight, 40);
    for (let i = 0; i < pose.keypoints.length; i++) {
      if(pose.keypoints[i].part == "leftEye" || pose.keypoints[i].part == "rightEye" ) {
        let x = pose.keypoints[i].position.x * mul + factor;
        let y = pose.keypoints[i].position.y * mulFacHeight;
        fill(0, 0, 0);
        ellipse(x,y,16,16);   
      } else if(pose.keypoints[i].part != "leftEar" && pose.keypoints[i].part != "rightEar" && pose.keypoints[i].part != "nose") {
        let x = pose.keypoints[i].position.x * mul + factor;
        let y = pose.keypoints[i].position.y * mulFacHeight;
        fill(255, 255, 0);
        ellipse(x,y,64,64);  
      }
    }
    
    for (let i = 0; i < skeleton.length; i++) {
      let a = skeleton[i][0];
      let b = skeleton[i][1];
      strokeWeight(20);
      stroke(0);
      line(a.position.x * mul + factor, a.position.y * mulFacHeight,b.position.x * mul + factor,b.position.y * mulFacHeight);      
    }
  }
  pop();
}