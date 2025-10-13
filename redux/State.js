
export const userStateToProps=(state)=>{
    return{
      userInfo: state.auth?.userInfo
    }
}
