import { getDatabase, ref, get,push,query,orderByChild,equalTo} from "firebase/database";
import {  getDownloadURL } from "firebase/storage";

const UserDB = 'users/'

// user service
const CreateUserData = (data) => {
    const database = getDatabase();
    const dbstarRef = ref(database, UserDB);
    const dbRef = query(dbstarRef, orderByChild('email'),equalTo(data.email));
    return get(dbRef).then(snapshot => {
      if (snapshot.exists()) {
        return Promise.resolve("Email Exists")
      }else{
        return push(ref(database, UserDB), data);
      }
    });
   
  };

  const UploadImage = (ref)=>{
    return getDownloadURL(ref).then((downloadURL) => {
        return Promise.resolve(downloadURL)
    });     
  }
  export { CreateUserData, UploadImage };