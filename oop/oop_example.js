//console.log('===== Class Person ==================');
var Person = function (){
	console.log('Constructor: Person');
	this.name = "";
	this.birthday = "";
};
Person.prototype.getName = function(){
	return this.name;
}
Person.prototype.setName = function(name){
	this.name = name;
}
Person.prototype.getBirthday = function(){
	return this.birthday;
}
Person.prototype.setBirthday = function(birthday){
	this.birthday = birthday;
}
Person.prototype.sayHello = function(){
	return this.name + " : " + this.birthday;
}

//console.log('===== Class Student ==================');
var Student = function(){
	Person.call(this);
	console.log('Constructor: Student');
}
Student.prototype.sayHello = function(){
	return "I'm a student. " + this.name + " : " + this.birthday;
}
Student.prototype = Object.create( Person.prototype );

//console.log('===== Class Teacher ==================');
var Teacher = function(){
	Person.call(this);
	console.log('Constructor: Teacher');
}
Teacher.prototype.sayHello = function(){
	return "I'm an teacher. " + this.name + " : " + this.birthday;
}
Teacher.prototype = Object.create( Person.prototype );

//console.log('===== Class MathTeacher ==================');
var MathTeacher = function(){
	Teacher.call(this);
	console.log('Constructor: MathTeacher');
}
MathTeacher.prototype.sayHello = function(){
	return "I'm an math teacher. " + this.name + " : " + this.birthday;
}
MathTeacher.prototype = Object.create( Teacher.prototype );

(function(){

var personsList = [];

console.log('===== Create Student 1 ==================');
var c1 = new Student;
personsList.push(c1);
c1.setName('John');
c1.setBirthday('2000/3/8');
console.log(c1.sayHello());

console.log('===== Create Student 2 ==================');
var c2 = new Student;
personsList.push(c2);
c2.setName('Mary');
c2.setBirthday('2000/10/30');
console.log(c2.sayHello());

console.log('===== Create Teacher 1 ==================');
var i1 = new Teacher;
personsList.push(i1);
i1.setName('Bill');
i1.setBirthday('1980/12/3');
console.log(i1.sayHello());

console.log('===== Create MathTeacher 2 ==================');
var i2 = new MathTeacher;
personsList.push(i2);
i2.setName('Gary');
i2.setBirthday('1970/1/22');
console.log(i2.sayHello());

console.log('===== Test polymorphism ==================');
for(var o in personsList){
	if( personsList[o] instanceof Person ){
		console.log(personsList[o].sayHello());
	}
}

})();
