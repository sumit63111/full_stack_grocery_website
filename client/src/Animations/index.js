export const buttonClick={
    whileTap:{scale:0.9},
}
export const fadeInOut={
    initial:{opacity:0}, animate:{opacity:2}, exit:{opacity:0},
}
export const slideTop={
    initial:{ opacity: 0, y: 30 },
    animate:{ opacity: 1, y: 0 },
    exit:{ opacity: 0, y: 30 },
}
export const staggerFadeInFadeOut=(i)=>{
    return{
        initial: {opacity:0, y:50},
        animate: {opacity:1, y:0},
        exit: {opacity:0, y:50},
        transition: {duration:0.1, delay:(i*0.2)+1},
        
}
}
export const slideIn = {
    initial: { opacity: 0, x: 30 },
    animate: { opacity: 1, x: 0, transition: { delay:0.3,duration: 0.2 } },
    exit: { opacity: 0, x: 30 },
    
  }
  
  export const slideOut = {
    initial: { opacity: 1, x: 0 },
    animate: { opacity: 0, x: -30, transition: { duration: 0.5 } },
    exit: { opacity: 0, x: -30 },
  };
  
