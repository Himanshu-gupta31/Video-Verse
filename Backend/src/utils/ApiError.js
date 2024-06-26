class Apierror extends Error{
    constructor(
        statusCode,
        message="Something went wrong",
        errors=[],
        stack
    ){
        super(message)
        this.statusCode=statusCode
        this.data=null //find this.data mein kya hota hai
        this.message=message
        this.success=false
        this.errors=errors
        if(stack){
            this.stack=stack
        }else{
            Error.captureStackTrace(this.constructor)
        }
        }
}
export {Apierror}