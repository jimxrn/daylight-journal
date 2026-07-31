const greeting=document.getElementById("greeting");
const today=document.getElementById("today");

const now=new Date();

const hour=now.getHours();

let message="Good Evening";

if(hour<12){

message="Good Morning";

}

else if(hour<18){

message="Good Afternoon";

}

greeting.textContent=`${message}, Jim.`;

today.textContent=now.toLocaleDateString("en-US",{

weekday:"long",

month:"long",

day:"numeric"

});