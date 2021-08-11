import React,{useState,useEffect,useContext} from 'react'
import {UserContext} from '../../App'
import M from 'materialize-css'
import {Link} from 'react-router-dom'
//const moment = require('moment')
const Home  = ()=>{
    const [data,setData] = useState([])
    const {state,dispatch} = useContext(UserContext)
    useEffect(()=>{
       fetch('/allpost',{
           headers:{
               "Authorization":"Bearer "+localStorage.getItem("jwt")
           }
       }).then(res=>res.json())
       .then(result=>{
           console.log(result)
           setData(result.posts)
       })
    },[])

    const likePost = (id)=>{
          fetch('/like',{
              method:"put",
              headers:{
                  "Content-Type":"application/json",
                  "Authorization":"Bearer "+localStorage.getItem("jwt")
              },
              body:JSON.stringify({
                  postId:id
              })
          }).then(res=>res.json())
          .then(result=>{
                   //   console.log(result)
            const newData = data.map(item=>{
                if(item._id==result._id){
                    return result
                }else{
                    return item
                }
            })
            setData(newData)
          }).catch(err=>{
              console.log(err)
          })
    }
    const unlikePost = (id)=>{
          fetch('/unlike',{
              method:"put",
              headers:{
                  "Content-Type":"application/json",
                  "Authorization":"Bearer "+localStorage.getItem("jwt")
              },
              body:JSON.stringify({
                  postId:id
              })
          }).then(res=>res.json())
          .then(result=>{
            //   console.log(result)
            const newData = data.map(item=>{
                if(item._id==result._id){
                    return result
                }else{
                    return item
                }
            })
            setData(newData)
          }).catch(err=>{
            console.log(err)
        })
    }

    const makeComment = (text,postId)=>{
          fetch('/comment',{
              method:"put",
              headers:{
                  "Content-Type":"application/json",
                  "Authorization":"Bearer "+localStorage.getItem("jwt")
              },
              body:JSON.stringify({
                  postId,
                  text
              })
          }).then(res=>res.json())
          .then(result=>{
              console.log(result)
              const newData = data.map(item=>{
                if(item._id==result._id){
                    return result
                }else{
                    return item
                }
             })
            setData(newData)
          }).catch(err=>{
              console.log(err)
          })
    }
    const deleteComment = (postId, commentId) => {
        fetch(`/posts/${postId}/comments/${commentId}`, {
          method: "delete",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("jwt")
          }
        }).then(res => res.json())
        .then(result => {
          const newData = data.map(item => {
            if (item._id == result._id) {
              return result
            }
            else {
              return item
            }
          })
          setData(newData)
          M.toast({html: "Comment Deleted Successfully", classes: "#43a047 green darken-1"})
        })
      }
    const deletePost = (postid)=>{
        fetch(`/deletepost/${postid}`,{
            method:"delete",
            headers:{
                Authorization:"Bearer "+localStorage.getItem("jwt")
            }
        }).then(res=>res.json())
        .then(result=>{
            console.log(result)
            const newData = data.filter(item=>{
                return item._id !== result._id
            })
            setData(newData)
        })
    }
   return (
       <div className="home">
           {
               
               data.map(item=>{
                   return(
                       
                       <div className="card home-card black darken-1" key={item._id}>
                       <div>
                       <div style={{float: "left", padding: "10px"}}>
                     <Link to={item.postedBy._id == state._id ? "/profile" : "/profile/"+item.postedBy._id} style={{color:"black"}} >
                     <img src = {item.postedBy.pic} style={{width: "30px", height: "30px", borderRadius: "50%"}} />
                     </Link>
                   </div>
                   <h5 style={{padding:"5px",fontWeight:500,color:"white"}}><Link to={item.postedBy._id !== state._id?"/profile/"+item.postedBy._id :"/profile"  }>{item.postedBy.name}</Link>
                             {item.postedBy._id == state._id 
                            && <i className="material-icons" style={{
                                float:"right"
                            }} 
                            onClick={()=>deletePost(item._id)}
                            >delete</i>

                            }</h5>
                 
              </div>
                            <div className="card-image">
                                <img src={item.photo}/>
                            </div>
                            <div className="card-content">
                            <i className="material-icons" style={{color:"red"}}>favorite</i>
                            {item.likes.includes(state._id)
                            ? 
                            <i className="material-icons" style={{color:"white"}}
                                    onClick={()=>{unlikePost(item._id)}}
                              >thumb_up</i>
                            : 
                            <i className="material-icons" style={{color:"white"}}
                            onClick={()=>{likePost(item._id)}}
                            >thumb_up_off_alt</i>
                            }
                            
                           
                                <h6 style={{color:'white'}}>{item.likes.length} likes</h6>
                                <h6 style={{color:'white'}}>{item.title}</h6>
                                <p style={{color:'white'}}>{item.body}</p>
                                {
                                    item.comments.map(record=>{
                                        return(
                                        <h6 key={record._id}><span style={{fontWeight:"500",color:'white'}}>{record.postedBy.name}</span><span style={{color:'white'}} >{record.text}</span> 
                                                        {item.postedBy._id == state._id 
                                            && <i className="material-icons" style={{
                                                float:"right"
                                            }} 
                                            onClick={()=>deleteComment(item._id)}
                                            >delete</i>

                            }
                                        </h6>
                                        )
                                    })
                                }
                                <form onSubmit={(e)=>{
                                    e.preventDefault()
                                    makeComment(e.target[0].value,item._id)
                                }} >
                                  <input style={{color:'white'}} type="text" placeholder="add a comment" />  
                                </form>
                                
                            </div>
                        </div> 
                   )
               })
           }
          
          
       </div>
   )
}


export default Home