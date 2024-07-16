
const AddOwner= require( "./DataStructures").AddOwner
const OwnerFilter= require( "./DataStructures").OwnerFilter
const UserFilter= require( "./DataStructures").UserFilter
const AddUser= require( "./DataStructures").AddUser
function SocketJoin(socket,id){
socket.on("join", async (message) => {
    console.log("yes");
    try {
      if (message.User === "User") {
        UserFilter(message.id);
        const UserId = message.id;
        const Socketid = socket.id;
        AddUser(UserId, Socketid);
      } else {
        OwnerFilter(message.id);
        const UserId = message.id;
        const Socketid = socket.id;
        AddOwner(UserId, Socketid);
      }
    //   console.log()
    } catch (err) {
      console.log(err);
    }
  })}
  ;
  module.exports={
    SocketJoin:SocketJoin
  }