const bcrypt = require('bcrypt');

//Need a salt -  Hashing is one way, i.e., once we encrypt,
//we cannot go back to to original password from the encrypted one

//However a hacker can compile a list of popular
//passwords and hash them. After having a look at the database of our application the 
// hacker comes to know the password


async function run(){
    const salt = await bcrypt.genSalt(10)
    const hashed = await bcrypt.hash('1234',salt);
    console.log(salt);
    console.log(hashed);
}

run(); 

