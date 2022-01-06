import {INCREASE, DECREASE, RESET} from './constants'

const  reducer = (state, action)=>{
    switch(action.type){
      case INCREASE:
        return {...state, amount : state.amount +1}
      case DECREASE:
        return {...state, amount : state.amount -1}
      case RESET:
        console.log(action)
        //return {...state, amount : 0}
     default :
        return state
    }
  }
  

  export default reducer