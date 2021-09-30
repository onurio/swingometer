export default function sketch (p) {
    let r; //radius
    let angle
    let step //distance between steps in radians
    let step2
    let angle2
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
        c = p.color('rgba(207, 159, 78,0.7)'); // Define color 'c'
        p.fill(c);
        p.noStroke();
        p.ellipse(x, y, current===i?50:30);

      }
  
    p.setup = function () {
      let width;
      if(window.innerWidth<769){
        width = window.innerWidth*0.9;
      }else{
        width = 400;
      }
      p.createCanvas(width, width);
        //initialize variables
        r = 100;
        angle = 0;
        angle2 = 0;
        step = p.TWO_PI / 4; //in radians equivalent of 360/6 in degrees
        step2 = p.TWO_PI / 6;
        p.translate(p.width / 2, p.height / 2);
    };
  
    p.myCustomRedrawAccordingToNewPropsHandler = function (props) {
    //   if (props.rotation !== null){
    //     rotation = props.rotation * Math.PI / 180;
    //   }
        if(props.swing!==null){
            if(props.swing>0){
                brazilian = false;
                swing = props.swing*4.2;

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
        c = p.color('#59656F'); // Define color 'c'
        p.fill(c);
        //convert polar coordinates to cartesian coordinates
      
        counter2 = (counter2+0.01)%1;
        for(let i=6;i>-1;i--){
          angle2 = (angle2 + step2)%(p.TWO_PI);
          var x2 = r * p.sin(angle2);
          var y2 = r * p.cos(angle2);  
          c = p.color('#59656F'); // Define color 'c'
          p.fill(c);
          p.ellipse(x2, y2, 6);

        }
        
        // p.arc(0, 0, 190, 190, -p.PI/2, 2*p.PI*counter2-p.PI/2,p.PIE);
        c = p.color('#59656F'); // Define color 'c'
        p.fill(c); // Use color variable 'c' as fill color
        //draw ellipse at every x,y point
        
        for(let i=3;i>-1;i--){          
          angle = (angle + step)%(p.TWO_PI);
          counter = (counter+1)%4;
          var x1 = r * p.sin(angle);
          var y1 = r * p.cos(angle);
          c = p.color('#59656F'); // Define color 'c'
          p.fill(c);
          p.ellipse(x1, y1, 10);
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
          

          // c = p.color(200, 20, 0); // Define color 'c'
          // p.fill(c);
          


         
        };
        
        c = p.color('#59A96A'); // Update 'c' with grayscale value
        p.fill(c);

  };
}
  

  