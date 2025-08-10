
const log = (containerName: string, data: unknown, type: string ='error') => {
    // type can be error, info
    if(type === 'error'){
        console.error(containerName, type, data);
    }else{
        console.log(containerName, type, data);
    }
};

export  { log, };