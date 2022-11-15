import { getDatabase, ref, get,push,} from "firebase/database";
import {  getDownloadURL } from "firebase/storage";

const ProductDB = 'products/'

// product service
const CreateProductData = (data) => {
    const database = getDatabase();
    return push(ref(database, ProductDB), data);
}
const UploadImage = (ref)=>{
    return getDownloadURL(ref).then((downloadURL) => {
        return Promise.resolve(downloadURL)
    });     
  }

export { CreateProductData,UploadImage };