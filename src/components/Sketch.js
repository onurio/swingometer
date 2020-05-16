export default function sketch (p) {
    let r; //radius
    let angle
    let step //distance between steps in radians
    let counter2 =0;
    let c;
    p.frameRate(30);
    let current=0;
    let counter=0;
    let factor = 1;
    let swing = 0;
    let brazilian = false;
    const makeCircle=(i)=>{
        var newAngle = angle+factor/4;
        var x = r * p.sin(newAngle);
        var y = r * p.cos(newAngle);
        c = p.color(255, 100, 0,150); // Define color 'c'
        p.fill(c);
        p.noStroke();
        p.ellipse(x, y, current===i?50:30);

      }
  
    p.setup = function () {
      p.createCanvas(350, 350);
        //initialize variables
        r = 100;
        angle = 0;
        step = p.TWO_PI / 4; //in radians equivalent of 360/6 in degrees
        p.translate(p.width / 2, p.height / 2);
    };
  
    p.myCustomRedrawAccordingToNewPropsHandler = function (props) {
    //   if (props.rotation !== null){
    //     rotation = props.rotation * Math.PI / 180;
    //   }
        if(props.swing!==null){
            if(props.swing>0){
                brazilian = false;
                swing = props.swing*6;

            }else{
                brazilian = true;
                swing = props.swing*3;

            }
        }

        if(props.counter!==null){
            current = (props.counter);
            
        }
    };
  
    p.draw = function () {
        p.clear();
      
        //move 0,0 to the center of the screen
        p.translate(p.width / 2, p.height / 2);
        p.ellipse(0, 0, 200);
        c = p.color('255, 010, 0'); // Define color 'c'
        p.fill(c);
        //convert polar coordinates to cartesian coordinates
      
        counter2 = (counter2+0.01)%1;
        
        // p.arc(0, 0, 190, 190, -p.PI/2, 2*p.PI*counter2-p.PI/2,p.PIE);
        c = p.color(255, 204, 0); // Define color 'c'
        p.fill(c); // Use color variable 'c' as fill color
        //draw ellipse at every x,y point
      
        for(let i=3;i>-1;i--){
            angle = (angle + step)%(step*4);
            counter = (counter+1)%4;
            if(brazilian){
                switch(i){
                    case 3:
                      factor =-swing
                      makeCircle(i)
                      break;
                    case 2:
                      factor =-swing
                      makeCircle(i)
                      break;
                    case 1:
                      factor =swing
                      makeCircle(i)
                      break;
                    default:
                      factor = 0
                      makeCircle(i)
                      break;
                    }

            }else{
                switch(i){
                    case 3:
                      factor =-swing;
                      makeCircle(i)
                      break;
                    case 2:
                      factor =0
                      makeCircle(i)
                      break;
                    case 1:
                      factor =-swing;
                      makeCircle(i)
                      break;
                    default:
                      factor = 0
                      makeCircle(i)
                      break;
                    }
            }
          
          c = p.color(200, 20, 255); // Define color 'c'
          p.fill(c);
          var x1 = r * p.sin(angle);
          var y1 = r * p.cos(angle);
          p.ellipse(x1, y1, 10);


         
          c = p.color(65); // Update 'c' with grayscale value
          p.fill(c);
        };
  };
}
  

  