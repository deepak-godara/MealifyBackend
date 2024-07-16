let ActiveOwners = new Map();
let ActiveUsers = new Map();
let ActiveOrders = new Map();
let NewOrder = new Map();
let OwnerOrderMap = new Map();
let OrderCount = 0;
const OwnerFind=async (hotelId)=>{
    if(ActiveOwners.has(hotelId.toString()))
    {
        return  ActiveOwners.get(hotelId.toString());
    }
    else
    return null;
}
const UsersFind=async (hotelId)=>{
    if(ActiveUsers.has(hotelId.toString()))
    {
        return  ActiveUsers.get(hotelId.toString());
    }
    else
    return null;
}
const AddUser=async(UserId,Data)=>{
    console.log("dsisn")
    console.log(ActiveOwners)
    console.log(ActiveUsers);
    return ActiveUsers.set(UserId,Data);

}
const AddOwner=async(UserId,Data)=>{
    console.log(ActiveOwners)
    console.log(ActiveUsers);
    return ActiveOwners.set(UserId,Data);
}
 const UserFilter=async(Id)=>{
    // ActiveUsers.delete(Id)
    ActiveUsers=new Map([...ActiveUsers].filter(([key, value]) => key != Id));
}
const OwnerFilter=async(Id)=>{
    // ActiveOwners.delete(Id)
    ActiveOwners=new Map([...ActiveOwners].filter(([key, value]) => key != Id));
}
 const AddOrder=async(OrderId,Data)=>
{
    NewOrder.set(OrderId,Data);
}
const GetOrder=async(orderid)=>{
    if(NewOrder.has(orderid)){
        return NewOrder.get(orderid);
    }
    else
    return null;

}
 const DeleteOrder=async(Id)=>{
    NewOrder=new Map([...NewOrder].filter(([key, value]) => key != Id));
}
const Initiate=async()=>{

}
module.exports={
    DeleteOrder:DeleteOrder,
    AddOrder:AddOrder,
    OwnerFilter:OwnerFilter,
    UserFilter:UserFilter,
    AddUser:AddUser,
    AddOwner:AddOwner,
    GetOrder:GetOrder,
    OwnerFind:OwnerFind,
    UsersFind:UsersFind,
    Initiate:Initiate
}

