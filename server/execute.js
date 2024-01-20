const path=require('path');
const {v4:uuid}=require('uuid');
const {exec}=require("child_process");
const fs=require('fs');

const outputPath=path.join(__dirname,"outputs");

if(!fs.existsSync(outputPath)){
    fs.mkdirSync(outputPath,{recursive:true});
}


const executeCpp = (filePath, codeInputArray) => {
    // Join the array of individual values to form the codeinput string with spaces
    const codeinput = codeInputArray.join(" ");
    console.log("code iii"+codeinput);
    const jobId= path.basename(filePath).split(".")[0];
    const outPath=path.join(outputPath,`${jobId}.exe`);
    return new Promise((resolve,reject)=>{
     exec(
         `g++ ${filePath} -o ${outPath} && cd "${outputPath}" && (echo ${codeinput} | .\\${jobId}.exe)`,
 
         (error,stdout,stderr)=>{
             if(error){
                 reject({error,stderr});
             }
             if(stderr){
                 reject(stderr);
             } console.log(codeinput+ "\nexecute"+stdout);
             resolve(stdout);
         })
    })
 
 }

 module.exports={
    executeCpp
 }