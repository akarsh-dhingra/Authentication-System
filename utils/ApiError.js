
class Parent{
    constructor(){
        this.name="Raman";
    }
    greet(){
        console.log(`Hello, I am ${this.name}`);
    }
}

class Child extends Parent{
    constructor(name,age){
        super(name);
        this.age=age;
    }
};

const c1=new Child("Akarsh",21);
const p1=new Parent();
console.log(p1.name);
console.log(c1.name);
class ApiError extends Error{
    constructor(statusCode,message="Something went wrong",error=[],stack=""){
        super(message);
        this.statusCode=statusCode;

    }

};